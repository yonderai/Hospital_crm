import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import TelehealthSession from "@/lib/models/TelehealthSession";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const data = await req.json();
        const telehealthSession = await TelehealthSession.create(data);
        return NextResponse.json(telehealthSession, { status: 201 });
    } catch (error: any) {
        console.error("Telehealth Session Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");
        const providerId = searchParams.get("providerId");

        let filter: any = {};
        if (patientId) filter.patientId = patientId;
        if (providerId) filter.providerId = providerId;

        const sessions = await TelehealthSession.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName")
            .sort({ startTime: -1 });

        return NextResponse.json(sessions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
