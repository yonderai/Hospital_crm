import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Claim from "@/lib/models/Claim";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        if (!data.claimNumber) {
            data.claimNumber = `CLM-${Date.now().toString().slice(-8)}`;
        }

        const claim = await Claim.create(data);
        return NextResponse.json(claim, { status: 201 });
    } catch (error: any) {
        console.error("Claim Creation Error:", error);
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
        const status = searchParams.get("status");

        let filter: any = {};
        if (patientId) filter.patientId = patientId;
        if (status) filter.status = status;

        const claims = await Claim.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("payerId", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(claims);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
