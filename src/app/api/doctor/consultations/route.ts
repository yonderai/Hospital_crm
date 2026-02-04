import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Encounter from "@/lib/models/Encounter";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const consultations = await Encounter.find({ providerId: session.user.id })
            .populate('patientId', 'firstName lastName')
            .sort({ createdAt: -1 });

        return NextResponse.json(consultations);
    } catch (error) {
        console.error("Fetch doctor consultations error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
