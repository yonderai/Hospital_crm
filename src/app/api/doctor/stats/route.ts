import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import mongoose from 'mongoose';
import Appointment from '@/lib/models/Appointment';
import User from '@/lib/models/User';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        const userId = (session.user as any).id;

        if (role !== 'doctor') {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');

        let startDate, endDate;

        if (dateParam) {
            startDate = new Date(dateParam);
            startDate.setUTCHours(0, 0, 0, 0);
            endDate = new Date(dateParam);
            endDate.setUTCHours(23, 59, 59, 999);
        } else {
            startDate = new Date();
            startDate.setUTCHours(0, 0, 0, 0);
            endDate = new Date(startDate);
            endDate.setUTCDate(endDate.getUTCDate() + 1);
        }

        // Aggregation to get stats in one go
        const stats = await Appointment.aggregate([
            {
                $match: {
                    providerId: new mongoose.Types.ObjectId(userId as string),
                    startTime: { $gte: startDate, $lte: endDate },
                    status: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalAppointments: { $sum: 1 },
                    consultedPatients: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "completed"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        const todayStats = stats[0] || { totalAppointments: 0, consultedPatients: 0 };

        // Count unique patients under care (Total distinct patients ever seen)
        const patientsUnderCare = (await Appointment.distinct('patientId', { providerId: userId })).length;

        return NextResponse.json({
            stats: [
                {
                    title: "Today's Patients",
                    value: todayStats.totalAppointments.toString().padStart(2, '0'),
                    icon: "Calendar",
                    color: "text-olive-500",
                    bg: "bg-olive-50"
                },
                {
                    title: "Patients Consulted",
                    value: todayStats.consultedPatients.toString().padStart(2, '0'),
                    icon: "Users",
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                },
                {
                    title: "Patients Under Care",
                    value: patientsUnderCare.toString().padStart(2, '0'),
                    icon: "Stethoscope",
                    color: "text-purple-600",
                    bg: "bg-purple-50"
                },
                {
                    title: "Critical Alerts",
                    value: "02", // Hardcoded for now as per requirement scope
                    icon: "AlertTriangle",
                    color: "text-red-500",
                    bg: "bg-red-50"
                },
            ]
        });

    } catch (error) {
        console.error("Error fetching doctor stats:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
