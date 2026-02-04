import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import User from '@/lib/models/User';
import Patient from '@/lib/models/Patient'; // Ensure Patient model is registered

export async function GET() {
    await dbConnect();

    const doctor = await User.findOne({ role: 'doctor' });

    if (!doctor) {
        return NextResponse.json({ queue: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
        providerId: doctor._id,
        startTime: { $gte: today, $lt: tomorrow }
    })
        .populate('patientId')
        .sort({ startTime: 1 });

    const queue = appointments.map((apt: any) => {
        const patientName = apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : 'Unknown';
        return {
            name: patientName,
            time: new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1), // Capitalize
            reason: apt.reason
        };
    });

    return NextResponse.json({ queue });
}
