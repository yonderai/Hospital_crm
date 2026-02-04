import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all lab orders for tracking (all statuses)
        const orders = await LabOrder.find({})
            .populate("patientId", "firstName lastName mrn contact name")
            .populate("orderingProviderId", "firstName lastName name department")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Error tracking lab orders:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
