import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabResult from '@/lib/models/LabResult';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !['doctor', 'admin', 'nurse', 'labtech'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const labs = await LabResult.find({ patientId: id })
            .populate('performedBy', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(labs);
    } catch (error) {
        console.error("Fetch patient labs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !['doctor', 'admin', 'nurse'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const { testType, priority } = body;
        if (!testType) {
            return NextResponse.json({ error: 'Test type is required' }, { status: 400 });
        }

        const newLab = await LabResult.create({
            patientId: id,
            testType,
            status: 'pending',
            performedBy: (session.user as any).id,
            resultValue: 'Pending',
            priority: priority || 'routine',
            createdAt: new Date()
        });

        return NextResponse.json(newLab, { status: 201 });
    } catch (error) {
        console.error("Create lab order error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
