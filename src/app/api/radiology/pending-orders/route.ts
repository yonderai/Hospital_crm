import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["radiology", "lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all imaging orders that are pending
        const pendingOrders = await ImagingOrder.find({
            status: { $in: ["pending", "scheduled", "ordered", "in-progress"] }
        })
            .populate("patientId", "firstName lastName mrn contact")
            .populate("orderedBy", "firstName lastName department")
            .sort({ priority: 1, createdAt: 1 })
            .lean();

        // Sort by priority (stat > urgent > routine)
        const priorityOrder = { stat: 1, urgent: 2, routine: 3 };
        pendingOrders.sort((a, b) => {
            const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
            if (priorityDiff !== 0) return priorityDiff;
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

        return NextResponse.json(pendingOrders);

    } catch (error) {
        console.error("Error fetching pending imaging orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
