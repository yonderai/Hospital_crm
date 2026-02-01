import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from '@/lib/models/LabOrder';

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

        const labs = await LabOrder.find({ patientId: id })
            .populate('orderingProviderId', 'firstName lastName')
            .populate('reviewedBy', 'firstName lastName')
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

        const newLab = await LabOrder.create({
            patientId: id,
            orderId: `LAB-${Date.now()}`,
            tests: [testType], // Wrapped in array as per LabOrder model
            status: 'ordered',
            orderingProviderId: (session.user as any).id,
            priority: priority || 'routine',
            results: [],
            createdAt: new Date(),
            encounterId: body.encounterId,
            appointmentId: body.appointmentId
        });

        return NextResponse.json(newLab, { status: 201 });
    } catch (error) {
        console.error("Create lab order error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
