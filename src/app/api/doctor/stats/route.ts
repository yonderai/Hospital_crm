import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Appointment from '@/lib/models/Appointment';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    // For demo purposes, we'll use the first doctor found
    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
        return NextResponse.json({ stats: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await Appointment.countDocuments({
        providerId: doctor._id,
        startTime: { $gte: today, $lt: tomorrow }
    });

    // Count unique patients for this doctor
    const patientsUnderCare = (await Appointment.distinct('patientId', { providerId: doctor._id })).length;

    return NextResponse.json({
        stats: [
            { title: "Today's Appointments", value: appointmentsToday.toString(), icon: "Calendar", color: "text-olive-500", bg: "bg-olive-50" },
            { title: "Patients Under Care", value: patientsUnderCare.toString(), icon: "Users", color: "text-olive-600", bg: "bg-olive-50" },
            { title: "Pending Lab Results", value: "05", icon: "Beaker", color: "text-olive-400", bg: "bg-olive-50/50" },
            { title: "Critical Alerts", value: "02", icon: "AlertTriangle", color: "text-red-500", bg: "bg-red-50" },
        ]
    });
}
