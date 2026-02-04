import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ICUFlowsheet from '@/lib/models/ICUFlowsheet';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');
        const admissionId = searchParams.get('admissionId');

        let query: any = {};
        if (patientId) query.patientId = patientId;
        if (admissionId) query.admissionId = admissionId;

        const flowsheet = await ICUFlowsheet.find(query)
            .populate('recordedBy', 'firstName lastName')
            .sort({ recordTime: -1 });

        return NextResponse.json(flowsheet);
    } catch (error) {
        console.error('ICU Flowsheet GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const newRecord = await ICUFlowsheet.create({
            ...data,
            recordedBy: session.user.id
        });

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        console.error('ICU Flowsheet POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
