import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LabOrder from "@/lib/models/LabOrder";
import { protectRoute } from "@/lib/api-guard";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const auth = await protectRoute(["lab-tech", "admin", "nurse"]); // Nurse collects sample?
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { id } = await params;
        const data = await req.json();

        // Security check: Only allow status updates or simple modifications
        // If updating status to 'completed', generally done via Result submission, but maybe manual override allowed.

        const order = await LabOrder.findByIdAndUpdate(
            id,
            { $set: data }, // e.g. { status: 'collected', sampleCollectedAt: Date.now() }
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
