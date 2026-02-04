import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import ImagingOrder from "@/lib/models/ImagingOrder";
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
        const order = await ImagingOrder.create(data);
        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        console.error("Imaging Order Creation Error:", error);
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

        const orders = await ImagingOrder.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("orderedBy", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
