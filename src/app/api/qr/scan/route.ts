import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { qrCode, mrn } = body;

        const identifier = qrCode || mrn;

        if (!identifier) {
            return NextResponse.json({ error: "No identifier provided" }, { status: 400 });
        }

        await dbConnect();

        // 1. Find Patient
        const patient = await Patient.findOne({ mrn: identifier });
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // 2. Find Today's Appointment
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const appointment = await Appointment.findOne({
            patientId: patient._id,
            startTime: { $gte: todayStart, $lte: todayEnd },
            status: { $in: ["scheduled", "checked-in"] }
        })
            .populate("providerId", "firstName lastName department")
            .sort({ startTime: 1 });

        return NextResponse.json({
            patient: {
                id: patient._id,
                name: `${patient.firstName} ${patient.lastName}`,
                mrn: patient.mrn,
                dob: patient.dob,
                gender: patient.gender,
                phone: patient.contact?.phone || "N/A"
            },
            appointment: appointment ? {
                id: appointment._id,
                time: new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                doctor: `Dr. ${appointment.providerId.firstName} ${appointment.providerId.lastName}`,
                department: appointment.providerId.department,
                status: appointment.status
            } : null
        });

    } catch (error: any) {
        console.error("QR Scan API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
