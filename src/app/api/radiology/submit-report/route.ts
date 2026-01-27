import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";
import RadiologyReport from "@/lib/models/RadiologyReport";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["radiology", "lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const { orderId, findings, impression, recommendations, status } = data;

        if (!orderId || !findings || !impression) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Find the imaging order
        const imagingOrder = await ImagingOrder.findById(orderId);

        if (!imagingOrder) {
            return NextResponse.json({ error: "Imaging order not found" }, { status: 404 });
        }

        // Create radiology report
        const report = await RadiologyReport.create({
            orderId: imagingOrder._id,
            patientId: imagingOrder.patientId,
            interpretedBy: session.user.id,
            findings,
            impression,
            recommendations: recommendations || "",
            status: status || "final",
            signedAt: status === "final" ? new Date() : undefined
        });

        // Update imaging order status
        imagingOrder.status = "completed";
        imagingOrder.completedAt = new Date();
        await imagingOrder.save();

        return NextResponse.json({ success: true, report });

    } catch (error) {
        console.error("Error submitting radiology report:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
