import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";

import { getAiInsight } from "@/lib/ai";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Validate Payload
        const { patientId, doctorId, date, timeSlot, type, reason, chiefComplaint, payment } = body;

        // Verify Patient Exists
        const patient = await Patient.findOne({ $or: [{ _id: patientId }, { mrn: patientId }] });
        if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

        // Verify Doctor Exists
        const doctor = await User.findById(doctorId);
        if (!doctor || doctor.role !== 'doctor') return NextResponse.json({ error: "Doctor not found" }, { status: 404 });

        // Generate Appointment ID
        const appointmentId = `APT-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;

        // Construct Start/End Time
        const startTime = new Date(`${date}T${timeSlot}:00`);
        const endTime = new Date(startTime.getTime() + 30 * 60000); // Default 30 min duration

        const now = new Date();
        // Validation: Cannot book in the past
        if (startTime < new Date(now.getTime() - 5 * 60000)) { // 5 min grace
            return NextResponse.json({ error: "Cannot book appointments in the past." }, { status: 400 });
        }

        // Check for double booking / overlaps
        const conflict = await Appointment.findOne({
            providerId: doctorId,
            status: { $nin: ["cancelled", "no-show"] },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } },
                { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
            ]
        });

        if (conflict) {
            return NextResponse.json({ error: "Doctor is not available at this time slot." }, { status: 409 });
        }

        // Generate Receipt No if paid
        let receiptNo = undefined;
        let paymentStatus = "pending";
        if (payment && payment.method) {
            if (payment && payment.method) {
                paymentStatus = "paid"; // Flag to trigger receipt generation
                receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
            }
            receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
        }

        // Generate AI Insight (Non-blocking preference, but awaiting for simplicity in V1)
        let aiInsight = undefined;

        try {
            console.log(`[BOOK] Attempting AI Gen for: ${chiefComplaint || reason}`);

            const insightRes = await fetch("http://127.0.0.1:5001/api/clinical-insight", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    symptoms: chiefComplaint || reason,
                    history: "Not available during booking",
                    medications: "Not available during booking"
                }),
            });

            if (insightRes.ok) {
                const insightData = await insightRes.json();
                aiInsight = insightData.insight;
            } else {
                const text = await insightRes.text();
                console.error(`[BOOK] AI Failed: ${text}`);
            }
        } catch (error: any) {
            console.error("AI Insight Generation Failed:", error);
            // We do not block booking if AI fails
        }

        // Create Appointment
        const appointment = await Appointment.create({
            appointmentId,
            patientId: patient._id,
            providerId: doctorId,
            startTime,
            endTime,
            status: "scheduled",
            type: type || "consultation",
            reason: reason || "Consultation",
            chiefComplaint: chiefComplaint,
            aiInsight: aiInsight || undefined,
            notes: body.notes,
            aiInsights: aiInsight, // Save the generated insight
            payment: {
                totalAmount: payment?.totalAmount || 0,
                paidAmount: payment?.paidAmount || 0,
                dueAmount: payment?.dueAmount || 0,
                method: payment?.method || "cash",
                status: "paid", // Always paid for this flow
                receiptNo: receiptNo
            },
            createdBy: "staff"
        });

        // Update Patient's latestAiInsight
        if (aiInsight) {
            await Patient.findByIdAndUpdate(patient._id, { latestAiInsight: aiInsight });
        }

        return NextResponse.json({
            success: true,
            appointment,
            details: {
                patientName: `${patient.firstName} ${patient.lastName}`,
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                date: date,
                time: timeSlot,
                receiptNo
            }
        });

    } catch (error: any) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: error.message || "Booking Failed" }, { status: 500 });
    }
}
