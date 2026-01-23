import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Appointment from '@/lib/models/Appointment';
import User from '@/lib/models/User';
import Patient from '@/lib/models/Patient';

export async function GET() {
    await dbConnect();

    // Fetch recent completed appointments as "Clinical Updates"
    const appointments = await Appointment.find({ status: { $in: ['completed', 'checked-in'] } })
        .limit(20)
        .sort({ updatedAt: -1 })
        .populate('patientId', 'firstName lastName')
        .populate('providerId', 'firstName lastName');

    const data = appointments.map((apt: any) => ({
        id: apt.appointmentId || 'N/A',
        name: apt.reason || 'Consultation',
        status: apt.status.charAt(0).toUpperCase() + apt.status.slice(1),
        date: new Date(apt.updatedAt || apt.startTime).toLocaleDateString(),
        value: apt.patientId ? `${apt.patientId.firstName} ${apt.patientId.lastName}` : 'Unknown' // Showing Patient Name in 'Value' col
    }));

    return NextResponse.json({
        data,
        stats: [
            { label: "New Updates", value: appointments.length.toString(), change: "+12%", icon: "Activity", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Pending Review", value: "5", change: "-2", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Protocols Updated", value: "3", change: "0%", icon: "LayoutGrid", color: "text-blue-600", bg: "bg-blue-50" },
        ]
    });
}
