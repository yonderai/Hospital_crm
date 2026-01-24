import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";
import RadiologyReport from "@/lib/models/RadiologyReport";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "radiologist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { orderId, findings, impression, recommendations } = body;

        // 1. Create Report
        const order = await ImagingOrder.findById(orderId);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const report = await RadiologyReport.create({
            orderId,
            patientId: order.patientId,
            interpretedBy: session.user.id,
            findings,
            impression,
            recommendations,
            status: "final",
            signedAt: new Date()
        });

        // 2. Update Order Status
        order.status = "completed";
        order.completedAt = new Date();
        await order.save();

        return NextResponse.json({ success: true, report });

    } catch (error) {
        console.error("Error submitting radiology report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
