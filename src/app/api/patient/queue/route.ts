import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
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

    // Get patient's appointments for today
    const myAppointments = await Appointment.find({
        patientId: patient._id,
        startTime: { $gte: startOfDay, $lte: endOfDay },
        status: { $nin: ['completed', 'cancelled', 'no-show'] }
    })
        .populate('providerId', 'firstName lastName department')
        .sort({ startTime: 1 })
        .lean();

    console.log("Patient appointments:", myAppointments.length);

    // For each appointment, get the full doctor's queue
    const enrichedAppointments = await Promise.all(
        myAppointments.map(async (apt: any) => {
            // Get all appointments for this doctor today
            const doctorQueue = await Appointment.find({
                providerId: apt.providerId._id,
                startTime: { $gte: startOfDay, $lte: endOfDay },
                status: { $nin: ['completed', 'cancelled', 'no-show'] }
            })
                .populate('patientId', 'firstName lastName mrn')
                .sort({ startTime: 1 })
                .lean();

            console.log(`Doctor ${apt.providerId.firstName} queue:`, doctorQueue.length);

            // Find current patient's position in queue
            const myPosition = doctorQueue.findIndex((queueApt: any) =>
                queueApt._id.toString() === apt._id.toString()
            ) + 1;

            // Get patients ahead in queue
            const patientsAhead = doctorQueue
                .slice(0, myPosition - 1)
                .map((queueApt: any) => ({
                    name: `${queueApt.patientId?.firstName} ${queueApt.patientId?.lastName}`,
                    mrn: queueApt.patientId?.mrn,
                    time: queueApt.startTime,
                    status: queueApt.status,
                    isCurrentPatient: false
                }));

            // Get total queue info
            const totalInQueue = doctorQueue.length;
            const patientsAheadCount = myPosition - 1;

            return {
                id: apt.appointmentId,
                doctor: `Dr. ${apt.providerId?.firstName} ${apt.providerId?.lastName}`,
                department: apt.providerId?.department || 'General',
                startTime: apt.startTime,
                status: apt.status,
                queuePosition: myPosition,
                totalInQueue: totalInQueue,
                patientsAheadCount: patientsAheadCount,
                patientsAhead: patientsAhead,
                estimatedWaitTime: patientsAheadCount * 15 // Assume 15 mins per patient
            };
        })
    );

    return NextResponse.json({ data: enrichedAppointments });
}
