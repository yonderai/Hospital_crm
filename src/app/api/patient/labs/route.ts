import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabResult from '@/lib/models/LabResult';
import Patient from '@/lib/models/Patient';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find the clinical patient profile for this user
        const patient = await Patient.findOne({ "contact.email": session.user?.email });
        if (!patient) return NextResponse.json({ data: [] });

        const labs = await LabResult.find({ patientId: patient._id })
            .populate('performedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        const data = labs.map((lab: any) => ({
            id: lab._id,
            title: lab.testType,
            type: 'lab',
            provider: lab.performedBy ? `Dr. ${lab.performedBy.firstName} ${lab.performedBy.lastName}` : 'Main Lab',
            date: new Date(lab.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
            status: lab.status || 'final',
            value: lab.resultValue,
            unit: lab.unit,
            abnormal: lab.abnormalFlag
        }));

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Lab fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
