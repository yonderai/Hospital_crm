import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ORCase from '@/lib/models/ORCase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const surgeonId = searchParams.get('surgeonId');

        let query: any = {};
        if (status) query.status = status;
        if (surgeonId) query.surgeonId = surgeonId;

        const cases = await ORCase.find(query)
            .populate('patientId', 'firstName lastName mrn')
            .populate('surgeonId', 'firstName lastName')
            .sort({ scheduledDate: 1 });

        return NextResponse.json(cases);
    } catch (error) {
        console.error('OR Cases GET Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const data = await req.json();
        const newCase = await ORCase.create(data);

        return NextResponse.json(newCase, { status: 201 });
    } catch (error) {
        console.error('OR Case POST Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
