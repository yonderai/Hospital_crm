import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Appointment from '@/lib/models/Appointment';
import User from '@/lib/models/User';
import Patient from '@/lib/models/Patient';

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { patientId, doctorId, date, time, reason, type } = body;

        // Basic validation
        if (!patientId || !doctorId || !date || !time) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Just simplistic date handling for demo
        const appointmentDate = new Date(`${date}T${time}`);

        // Create appointment
        const newAppointment = await Appointment.create({
            appointmentId: `APT-${Date.now().toString().slice(-6)}`,
            patientId, // Assuming this is the Mongo ID of the patient
            providerId: doctorId,
            startTime: appointmentDate,
            endTime: new Date(appointmentDate.getTime() + 30 * 60000), // 30 min duration default
            status: 'scheduled',
            type: type || 'consultation',
            reason: reason || 'General Checkup'
        });

        return NextResponse.json({ success: true, appointment: newAppointment });

    } catch (error: any) {
        console.error('Appointment creation error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
