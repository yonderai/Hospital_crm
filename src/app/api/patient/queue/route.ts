import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Appointment from '@/lib/models/Appointment';
import Patient from '@/lib/models/Patient';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const patient = await Patient.findOne({ "contact.email": session.user?.email });
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    // Get start and end of TODAY
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
        patientId: patient._id,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['completed', 'cancelled', 'no-show'] }
    })
        .populate('providerId', 'firstName lastName department')
        .sort({ startTime: 1 });

    let data = appointments.map((apt: any) => ({
        id: apt.appointmentId,
        doctor: `Dr. ${apt.providerId?.firstName} ${apt.providerId?.lastName}`,
        department: apt.providerId?.department || 'General',
        startTime: apt.startTime,
        status: apt.status,
        queuePosition: apt.status === 'checked-in' ? 3 : null // Mock queue position
    }));

    return NextResponse.json({ data });
}
