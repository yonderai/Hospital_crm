import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Appointment from "@/lib/models/Appointment";
import { protectRoute } from "@/lib/api-guard"; // Helper created in Phase 2

export async function GET(req: Request) {
    const auth = await protectRoute(["doctor", "nurse", "front-desk", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const role = searchParams.get("role"); // 'doctor'

        // Filter logic
        let filter: any = {};
        if (role === 'doctor' && auth.user?.role === 'doctor') {
            // Ideally filter by auth.user.id if Appointment has doctorId
            // Appointment model (checked in next step) needs to be consistent
            // filter.doctorId = auth.user.id;
        }

        const appointments = await Appointment.find(filter)
            .populate('patientId', 'firstName lastName')
            .sort({ date: 1 })
            .limit(20)
            .lean();

        // Transform to UI shape
        const schedule = appointments.map((appt: any) => ({
            time: appt.date ? new Date(appt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "TBD",
            period: appt.date ? (new Date(appt.date).getHours() >= 12 ? "PM" : "AM") : "",
            patientName: appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : "Unknown",
            type: appt.type || "consultation",
            duration: appt.duration || "30m",
            reason: appt.reason || "Visit",
            status: appt.status || "scheduled"
        }));

        return NextResponse.json({ schedule });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
