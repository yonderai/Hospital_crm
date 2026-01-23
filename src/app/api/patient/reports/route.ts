import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import LabResult from '@/lib/models/LabResult';
import Patient from '@/lib/models/Patient';

export async function GET() {
    await dbConnect();

    // For demo: Use the first patient found
    const patient = await Patient.findOne({});
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    const results = await LabResult.find({ patientId: patient._id })
        .sort({ createdAt: -1 });

    const data = results.map((res: any) => ({
        id: res._id,
        testName: res.testType,
        value: res.resultValue,
        unit: res.unit,
        range: res.referenceRange,
        date: new Date(res.createdAt).toLocaleDateString(),
        status: res.status.toUpperCase()
    }));

    return NextResponse.json({ data });
}
