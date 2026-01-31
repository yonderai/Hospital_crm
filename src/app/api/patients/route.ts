import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import Appointment from "@/lib/models/Appointment";
import Prescription from "@/lib/models/Prescription";
import mongoose from "mongoose";
import { startOfDay, endOfDay, subDays } from "date-fns";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        const userId = (session.user as any).id;

        if (!['doctor', 'admin', 'nurse'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const filterDate = searchParams.get('date'); // 'today', 'yesterday', or ISO string

        const doctorId = new mongoose.Types.ObjectId(userId);
        let matchStage: any = {};

        // stats calculations need boundaries
        const today = new Date();
        const yesterday = subDays(today, 1);
        const todayStart = startOfDay(today);
        const todayEnd = endOfDay(today);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        // 1. Base Criteria (RBAC) - Include patients from appointments
        let baseCriteria: any = {};
        if (role === 'doctor') {
            const patientIdsFromAppts = await Appointment.find({ providerId: doctorId }).distinct('patientId');
            baseCriteria = {
                $or: [
                    { assignedDoctorId: doctorId },
                    { _id: { $in: patientIdsFromAppts.map(id => new mongoose.Types.ObjectId(id)) } }
                ]
            };
        }

        // 2. Search Criteria
        let searchCriteria: any = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            searchCriteria = {
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { mrn: { $regex: regex } },
                ]
            };
        }

        // 3. Date Criteria
        let dateCriteria: any = {};
        if (filterDate) {
            let targetStart, targetEnd;
            if (filterDate === 'today') {
                targetStart = todayStart;
                targetEnd = todayEnd;
            } else if (filterDate === 'yesterday') {
                targetStart = yesterdayStart;
                targetEnd = yesterdayEnd;
            } else {
                targetStart = startOfDay(new Date(filterDate));
                targetEnd = endOfDay(new Date(filterDate));
            }

            const apptsInRange = await Appointment.find({
                providerId: doctorId,
                startTime: { $gte: targetStart, $lte: targetEnd }
            }).distinct('patientId');

            dateCriteria = { _id: { $in: apptsInRange.map(id => new mongoose.Types.ObjectId(id)) } };
        }

        // Combine all criteria using $and for the aggregation pipe
        const criteriaList = [baseCriteria, searchCriteria, dateCriteria].filter(c => Object.keys(c).length > 0);
        matchStage = criteriaList.length > 0 ? { $and: criteriaList } : {};

        // Stats calculations (Global for the stats bar)
        const statsQuery: any = {};
        if (role === 'doctor') statsQuery.providerId = doctorId;

        const [todayCount, yesterdayCount, completedRxToday, completedApptsToday] = await Promise.all([
            Appointment.countDocuments({ ...statsQuery, startTime: { $gte: todayStart, $lte: todayEnd } }),
            Appointment.countDocuments({ ...statsQuery, startTime: { $gte: yesterdayStart, $lte: yesterdayEnd } }),
            Prescription.find({
                providerId: doctorId,
                createdAt: { $gte: todayStart, $lte: todayEnd }
            }).distinct('patientId'),
            Appointment.find({
                providerId: doctorId,
                status: "completed",
                startTime: { $gte: todayStart, $lte: todayEnd }
            }).distinct('patientId')
        ]);

        // Combine unique patient IDs from both prescriptions and completed appointments
        const allCompletedPatientIds = new Set([
            ...completedRxToday.map(id => id.toString()),
            ...completedApptsToday.map(id => id.toString())
        ]);
        const outpatientCompletedToday = allCompletedPatientIds.size;

        const patients = await Patient.aggregate([
            { $match: matchStage },
            { $sort: { updatedAt: -1 } },
            {
                $lookup: {
                    from: "encounters",
                    let: { patientId: "$_id" },
                    pipeline: [
                        { $match: { $expr: { $and: [{ $eq: ["$patientId", "$$patientId"] }, { $eq: ["$status", "open"] }] } } },
                        { $sort: { createdAt: -1 } },
                        { $limit: 1 }
                    ],
                    as: "activeEncounter"
                }
            },
            {
                $lookup: {
                    from: "prescriptions",
                    localField: "_id",
                    foreignField: "patientId",
                    as: "prescriptions"
                }
            },
            {
                $lookup: {
                    from: "appointments",
                    let: { patientId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$patientId", "$$patientId"] },
                                        { $eq: ["$status", "completed"] },
                                        { $gte: ["$startTime", todayStart] },
                                        { $lte: ["$startTime", todayEnd] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "todayCompletedAppt"
                }
            },
            // Removed strict prescription filter as requested - allow viewing all assigned patients
            {
                $lookup: {
                    from: "orcases",
                    let: { patientId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$patientId", "$$patientId"] },
                                        { $eq: ["$status", "completed"] },
                                        { $gte: ["$endTime", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }
                                    ]
                                }
                            }
                        },
                        { $sort: { endTime: -1 } },
                        { $limit: 1 }
                    ],
                    as: "recentSurgery"
                }
            }
        ]);

        const formattedPatients = patients.map((p: any) => {
            const activeEnc = p.activeEncounter?.[0];
            const recentSurg = p.recentSurgery?.[0];
            const hasPrescription = p.prescriptions && p.prescriptions.length > 0;

            let status = "Awaiting Treatment";
            let category = "pending"; // Internal tag for awaiting medication

            if (recentSurg) {
                status = "Post-Op";
                category = "post-op";
            } else if (activeEnc) {
                if (activeEnc.type === 'emergency') {
                    status = "Critical Care";
                    category = "critical";
                } else if (activeEnc.type === 'inpatient') {
                    status = "Admitted";
                    category = "inpatient";
                }
            }

            const isApptCompletedToday = p.todayCompletedAppt && p.todayCompletedAppt.length > 0;
            const treatmentGiven = hasPrescription || isApptCompletedToday;

            // High-priority override: If treatment is done (Prescription written OR Appt marked completed)
            if (treatmentGiven) {
                status = "Treatment Done";
                category = "outpatient";
            } else if (category === 'pending' || category === 'outpatient') {
                // If no prescription/completion and not admitted/post-op, it's a pending case
                status = "Awaiting Tx";
                category = "inpatient"; // Map to the 'In-Patient' tab as requested for pending
            }

            const severity = activeEnc?.vitals?.oxygenSaturation < 95 ? "High" : "Medium";

            return {
                _id: p._id,
                firstName: p.firstName,
                lastName: p.lastName,
                mrn: p.mrn,
                status: status,
                category: category,
                hasPrescription,
                condition: p.chronicConditions?.[0] || "General Checkup",
                lastVisit: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : "Never",
                severity: severity
            };
        });

        // Refined Counts for Tabs
        const counts = {
            all: formattedPatients.length,
            inPatient: formattedPatients.filter((p: any) => p.category === 'inpatient').length,
            outPatient: formattedPatients.filter((p: any) => p.category === 'outpatient').length,
            critical: formattedPatients.filter((p: any) => p.category === 'critical').length,
            postOp: formattedPatients.filter((p: any) => p.category === 'post-op').length,
        };

        return NextResponse.json({
            patients: formattedPatients,
            counts,
            stats: {
                today: todayCount,
                yesterday: yesterdayCount,
                outpatientCompleted: outpatientCompletedToday
            }
        });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
