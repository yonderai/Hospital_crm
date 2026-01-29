import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        // Verify doctor/admin/nurse role
        if (!['doctor', 'admin', 'nurse'].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        let matchStage: any = {};

        if (search) {
            const regex = new RegExp(search, 'i');
            matchStage = {
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { mrn: { $regex: regex } },
                ]
            };
        }

        // Strict RBAC: Doctor only sees assigned patients
        if (role === 'doctor') {
            matchStage.assignedDoctorId = new mongoose.Types.ObjectId((session.user as any).id);
        }

        // Use Aggregation to join with Encounters and OR Cases for status
        const patients = await Patient.aggregate([
            { $match: matchStage },
            { $sort: { updatedAt: -1 } },
            // Lookup latest Open Encounter
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
            // Lookup if patient has any prescriptions
            {
                $lookup: {
                    from: "prescriptions",
                    localField: "_id",
                    foreignField: "patientId",
                    as: "prescriptions"
                }
            },
            // Only show patients who have their prescription and medication done
            {
                $match: { "prescriptions.0": { $exists: true } }
            },
            // Lookup recent Completed Surgery (last 7 days)
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

        // Map to UI format with Status Logic
        const formattedPatients = patients.map((p: any) => {
            const activeEnc = p.activeEncounter?.[0];
            const recentSurg = p.recentSurgery?.[0];

            let status = "Out-Patient"; // Default
            let category = "outpatient";

            if (recentSurg) {
                status = "Post-Op";
                category = "post-op";
            } else if (activeEnc) {
                if (activeEnc.type === 'emergency') {
                    status = "Critical Care";
                    category = "critical";
                } else if (activeEnc.type === 'inpatient') {
                    status = "In-Patient";
                    category = "inpatient";
                }
            }

            // Mock Severity if not in Encounter
            const severity = activeEnc?.vitals?.oxygenSaturation < 95 ? "High" : "Medium";

            return {
                _id: p._id,
                firstName: p.firstName,
                lastName: p.lastName,
                mrn: p.mrn,
                status: status,
                category: category,
                condition: p.chronicConditions?.[0] || "General Checkup",
                lastVisit: new Date(p.updatedAt).toLocaleDateString(),
                severity: severity
            };
        });

        // Calculate Counts
        const counts = {
            all: formattedPatients.length,
            inPatient: formattedPatients.filter((p: any) => p.category === 'inpatient').length,
            outPatient: formattedPatients.filter((p: any) => p.category === 'outpatient').length,
            critical: formattedPatients.filter((p: any) => p.category === 'critical').length,
            postOp: formattedPatients.filter((p: any) => p.category === 'post-op').length,
        };

        return NextResponse.json({ patients: formattedPatients, counts });
    } catch (error) {
        console.error("Error fetching patients:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
