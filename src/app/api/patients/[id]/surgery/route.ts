import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import ORCase from '@/lib/models/ORCase';

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    await dbConnect();
    try {
        const patientId = params.id;
        const surgeries = await ORCase.find({ patientId })
            .populate('surgeonId', 'firstName lastName')
            .sort({ scheduledDate: -1 });
        return NextResponse.json(surgeries);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
