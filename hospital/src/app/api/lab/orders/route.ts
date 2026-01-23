import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LabOrder from "@/lib/models/LabOrder";
import { protectRoute } from "@/lib/api-guard";

export async function GET(req: NextRequest) {
    const auth = await protectRoute(["lab-tech", "doctor", "nurse", "admin", "front-desk"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const patientId = searchParams.get("patientId");

        let filter: any = {};
        if (status) filter.status = status;
        if (patientId) filter.patientId = patientId;

        const orders = await LabOrder.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("orderingProviderId", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(orders);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const auth = await protectRoute(["doctor", "admin"]); // Only doctors order labs usually
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const data = await req.json();

        // Auto-generate Order ID if not present (simple logic or utilize mongoose pre-save)
        // Check if OrderId field exists in data, if not generate one.
        // Assuming frontend or Pre-save hook handles it, but let's be safe.
        if (!data.orderId) {
            data.orderId = "LAB-" + Math.floor(100000 + Math.random() * 900000);
        }

        const order = await LabOrder.create(data);
        return NextResponse.json(order, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
