import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Appointment from '@/lib/models/Appointment';
import Patient from '@/lib/models/Patient';

export async function GET() {
    await dbConnect();

    // For demo: Use the first patient found
    const patient = await Patient.findOne({});
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    // Get start and end of TODAY
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
        patientId: patient._id,
        startTime: { $gte: startOfDay, $lte: endOfDay }
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

    // DEMO INJECTION: Ensure there's always an appointment 20 mins from NOW to show the alert functionality
    const demoTime = new Date(Date.now() + 20 * 60000); // 20 mins from now
    data.unshift({
        id: 'DEMO-URGENT',
        doctor: 'Dr. Emily Davis',
        department: 'Cardiology',
        startTime: demoTime.toISOString(),
        status: 'scheduled',
        queuePosition: null,
        // isDemo Removed as it's not in the type definition
    });

    return NextResponse.json({ data });
}
