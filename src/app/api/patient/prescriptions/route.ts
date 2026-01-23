import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Prescription from '@/lib/models/Prescription';
import Patient from '@/lib/models/Patient';
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect();

    // For demo: Use the first patient found
    const patient = await Patient.findOne({});
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    const prescriptions = await Prescription.find({ patientId: patient._id })
        .populate('providerId', 'firstName lastName department')
        .sort({ prescribedDate: -1 });

    const data = prescriptions.map((rx: any) => ({
        id: rx.prescriptionId,
        date: new Date(rx.prescribedDate).toLocaleDateString(),
        doctor: `Dr. ${rx.providerId?.firstName} ${rx.providerId?.lastName}`,
        department: rx.providerId?.department || 'General',
        medications: rx.medications,
        status: rx.status.toUpperCase()
    }));

    return NextResponse.json({ data });
}
