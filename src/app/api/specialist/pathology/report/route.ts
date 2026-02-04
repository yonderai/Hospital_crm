import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";
import PathologyReport from "@/lib/models/PathologyReport";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pathologist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { orderId, specimenSource, grossDescription, microscopicDescription, diagnosis } = body;

        // 1. Create Report
        const order = await LabOrder.findById(orderId);
        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        const report = await PathologyReport.create({
            orderId,
            patientId: order.patientId,
            pathologistId: session.user.id,
            specimenSource,
            grossDescription,
            microscopicDescription,
            diagnosis,
            status: "final",
            signedAt: new Date()
        });

        // 2. Update Order Status
        order.status = "completed";
        await order.save();

        return NextResponse.json({ success: true, report });

    } catch (error) {
        console.error("Error submitting pathology report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
