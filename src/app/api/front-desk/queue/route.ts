import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User"; // For Doctor details
import Patient from "@/lib/models/Patient"; // For Patient details
import { startOfDay, endOfDay } from "date-fns";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        // Fetch appointments scheduled for today that aren't checked in yet
        const queue = await Appointment.find({
            startTime: { $gte: todayStart, $lte: todayEnd },
            status: "scheduled"
        })
            .populate("patientId", "firstName lastName mrn contact")
            .populate("providerId", "firstName lastName department")
            .sort({ startTime: 1 }); // Earliest first

        const formattedQueue = queue.map(app => ({
            id: app.appointmentId,
            appointmentId: app._id,
            patientName: `${app.patientId.firstName} ${app.patientId.lastName}`,
            mrn: app.patientId.mrn,
            time: new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            doctor: `Dr. ${app.providerId.firstName} ${app.providerId.lastName}`,
            department: app.providerId.department,
            type: app.type
        }));

        return NextResponse.json({ queue: formattedQueue });

    } catch (error: any) {
        console.error("Front Desk Queue API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
