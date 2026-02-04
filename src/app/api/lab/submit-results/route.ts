import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const { orderId, results } = data;

        if (!orderId || !results || !Array.isArray(results)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
        }

        // Update the lab order with results
        const labOrder = await LabOrder.findById(orderId);

        if (!labOrder) {
            return NextResponse.json({ error: "Lab order not found" }, { status: 404 });
        }

        labOrder.results = results;
        labOrder.status = "completed";
        labOrder.resultDate = new Date();
        labOrder.reviewedBy = session.user.id;
        labOrder.technicianId = session.user.id;

        await labOrder.save();

        return NextResponse.json({ success: true, labOrder });

    } catch (error) {
        console.error("Error submitting lab results:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
