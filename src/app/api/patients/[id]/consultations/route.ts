import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Encounter from "@/lib/models/Encounter";

export async function GET(
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

        const consultations = await Encounter.find({ patientId: id })
            .populate('providerId', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(consultations);
    } catch (error) {
        console.error("Fetch patient consultations error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
