import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";

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
        // Assuming date is "YYYY-MM-DD" and timeSlot is "HH:mm"
        const startTime = new Date(`${date}T${timeSlot}:00`);
        const endTime = new Date(startTime.getTime() + 30 * 60000); // Default 30 min duration

        // Check for double booking
        const conflict = await Appointment.findOne({
            providerId: doctorId,
            status: { $nin: ["cancelled", "no-show"] },
            startTime: startTime
        });

        if (conflict) {
            return NextResponse.json({ error: "Slot already booked" }, { status: 409 });
        }

        // Generate Receipt No if paid
        let receiptNo = undefined;
        let paymentStatus = "pending";
        if (payment && payment.method) {
            paymentStatus = "paid"; // Auto-confirm for simulation
            receiptNo = `RCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
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
            notes: body.notes,
            payment: {
                amount: payment?.amount || 0,
                method: payment?.method || "cash",
                status: paymentStatus,
                receiptNo: receiptNo
            },
            createdBy: "staff"
        });

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
