import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
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

        if (!['doctor', 'admin', 'nurse', 'pharmacist', 'pharmacy'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const filterDate = searchParams.get('date'); // 'today', 'yesterday', or ISO string

        const doctorId = new mongoose.Types.ObjectId(userId);
        let matchStage: any = {};

        // Anchor date for stats calculations (tiles)
        const anchorDateParam = searchParams.get('anchorDate');
        let todayStart, todayEnd, yesterdayStart, yesterdayEnd;

        let baseDate = anchorDateParam ? new Date(anchorDateParam) : new Date();
        if (isNaN(baseDate.getTime())) baseDate = new Date();

        // Define boundaries relative to the anchor date (UTC)
        todayStart = new Date(baseDate);
        todayStart.setUTCHours(0, 0, 0, 0);
        todayEnd = new Date(baseDate);
        todayEnd.setUTCHours(23, 59, 59, 999);

        const yDate = new Date(todayStart);
        yDate.setUTCDate(yDate.getUTCDate() - 1);
        yesterdayStart = new Date(yDate);
        yesterdayStart.setUTCHours(0, 0, 0, 0);
        yesterdayEnd = new Date(yDate);
        yesterdayEnd.setUTCHours(23, 59, 59, 999);

        // 1. Base Criteria (Appointment Filter) - Only show patients who have booked
        let baseCriteria: any = {};
        const appointmentQuery: any = {};
        if (role === 'doctor') {
            appointmentQuery.providerId = doctorId;
        }

        const patientIdsWithAppts = await Appointment.find(appointmentQuery).distinct('patientId');
        baseCriteria = { _id: { $in: patientIdsWithAppts.map(id => new mongoose.Types.ObjectId(id)) } };

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

        // Determine target range for the patient list lookup
        let focusStart = todayStart;
        let focusEnd = todayEnd;
        if (filterDate === 'yesterday') {
            focusStart = yesterdayStart;
            focusEnd = yesterdayEnd;
        } else if (filterDate && filterDate !== 'all' && filterDate !== 'today') {
            focusStart = startOfDay(new Date(filterDate));
            focusEnd = endOfDay(new Date(filterDate));
        }

        // Target range for status settle (Show historical treatment done if filtered by 'all')
        let targetStart = focusStart;
        let targetEnd = focusEnd;
        if (!filterDate || filterDate === 'all') {
            targetStart = new Date(0);
            targetEnd = todayEnd;
        }

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
                    let: { patientId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$patientId", "$$patientId"] },
                                        { $gte: ["$createdAt", targetStart] }, // Relative to filter
                                        { $lte: ["$createdAt", targetEnd] }
                                    ]
                                }
                            }
                        }
                    ],
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
                                        { $gte: ["$startTime", targetStart] }, // Relative to filter
                                        { $lte: ["$startTime", targetEnd] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "rangeCompletedAppt"
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
                                        { $eq: ["$providerId", doctorId] }, // Only count appointments for this doctor
                                        { $gte: ["$startTime", focusStart] }, // Focus-aware (Today/Yesterday)
                                        { $lte: ["$startTime", focusEnd] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "rangeAppointments"
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

            const isApptCompletedInFocus = p.rangeAppointments?.some((a: any) => a.status === 'completed');
            const hasPrescriptionInFocus = p.prescriptions?.some((rx: any) => new Date(rx.createdAt) >= focusStart && new Date(rx.createdAt) <= focusEnd);
            const treatmentGivenInFocus = isApptCompletedInFocus || hasPrescriptionInFocus;

            const hasCancelledInFocus = p.rangeAppointments?.some((a: any) => a.status === 'cancelled');
            const treatmentGivenHistory = (p.prescriptions && p.prescriptions.length > 0) || (p.rangeCompletedAppt && p.rangeCompletedAppt.length > 0);

            // 1. If treatment happened in the current focus range -> DONE
            if (treatmentGivenInFocus) {
                status = "Treatment Done";
                category = "outpatient";
            }
            // 2. If NO treatment happened in focus, but a CANCELLATION did -> CANCELLED
            else if (hasCancelledInFocus) {
                status = "Cancelled";
                category = "inpatient";
            }
            // 3. If no focus activity, check if they were ever treated (for general directory view)
            else if (treatmentGivenHistory) {
                status = "Treatment Done";
                category = "outpatient";
            }
            // 4. Default to Awaiting Tx
            else {
                status = "Awaiting Tx";
                category = "inpatient";
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
                severity: severity,
                appointmentCount: p.rangeAppointments?.length || 0
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
