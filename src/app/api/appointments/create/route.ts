
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { patientId, providerId, startTime, reason, type } = body;

        if (!patientId || !providerId || !startTime || !reason || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Enforce 30 Minute Slots
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 30 * 60000); // Add 30 minutes

        // Validate minutes (must be 00 or 30) - strict slot enforcement
        const minutes = start.getMinutes();
        if (minutes !== 0 && minutes !== 30) {
            return NextResponse.json({ error: "Appointments must start on the hour or half-hour (e.g., 10:00, 10:30)" }, { status: 400 });
        }

        await dbConnect();

        // 2. Check overlap
        const existingAppointment = await Appointment.findOne({
            providerId,
            status: { $nin: ["cancelled", "no-show"] },
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } }
            ]
        });

        if (existingAppointment) {
            return NextResponse.json({ error: "Time slot already booked" }, { status: 409 });
        }

        // 3. Generate AI Insight
        let aiInsight = undefined;
        // Temporary Debug Logging
        const fs = require('fs');
        const logPath = require('path').join(process.cwd(), 'debug_ai_log.txt');

        try {
            fs.appendFileSync(logPath, `[CREATE] Attempting AI Gen for: ${reason}\n`);

            const insightRes = await fetch("http://127.0.0.1:5001/api/clinical-insight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symptoms: reason,
                    history: "Not available",
                    medications: "Not available"
                }),
            });

            fs.appendFileSync(logPath, `[CREATE] AI Status: ${insightRes.status}\n`);

            if (insightRes.ok) {
                const insightData = await insightRes.json();
                aiInsight = insightData.insight;
                fs.appendFileSync(logPath, `[CREATE] AI Success. Length: ${aiInsight?.length}\n`);
            } else {
                const text = await insightRes.text();
                fs.appendFileSync(logPath, `[CREATE] AI Failed: ${text}\n`);
            }
        } catch (e: any) {
            console.error("AI Gen Failed", e);
            fs.appendFileSync(logPath, `[CREATE] AI Exception: ${e.message}\n`);
        }

        // 4. Create Appointment
        const newAppointment = await Appointment.create({
            appointmentId: `APT-${Date.now()}`,
            patientId,
            providerId,
            startTime: start,
            endTime: end,
            status: "scheduled",
            type,
            reason,
            aiInsights: aiInsight,
            createdBy: (session.user as any).role === 'patient' ? 'patient' : 'staff'
        });

        return NextResponse.json({
            success: true,
            appointment: newAppointment,
            message: "Appointment booked successfully (25m Consult + 5m Buffer)"
        });

    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
