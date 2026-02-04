
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Prescription from "@/lib/models/Prescription";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['doctor', 'admin', 'pharmacist'].includes((session.user as any).role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');

        let query: any = {};
        if (status) query.status = status;

        const prescriptions = await Prescription.find(query)
            .populate('patientId', 'firstName lastName mrn')
            .populate('providerId', 'firstName lastName department')
            .sort({ prescribedDate: -1 });

        return NextResponse.json(prescriptions);
    } catch (error) {
        console.error("Fetch all prescriptions error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
