import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    // In a real app, we might filter by the nurse's ward.
    // For now, return all patients to populate the table.
    const patients = await Patient.find({})
        .limit(20)
        .sort({ createdAt: -1 })
        .populate('assignedDoctorId', 'firstName lastName');

    const data = patients.map(p => ({
        id: p.mrn || 'N/A',
        name: `${p.firstName} ${p.lastName}`,
        status: 'Admitted', // Mock status for ward context
        date: new Date(p.createdAt).toLocaleDateString(),
        value: p.gender // Using 'value' column for Gender for now, or we can rename col in frontend
    }));

    return NextResponse.json({
        data,
        stats: [
            { label: "Occupancy Rate", value: "85%", change: "+2%", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Active Patients", value: patients.length.toString(), change: "+5", icon: "Users", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Discharges Pending", value: "3", change: "-1", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Critical Cases", value: "2", change: "0%", icon: "Activity", color: "text-red-500", bg: "bg-red-50" },
        ]
    });
}
