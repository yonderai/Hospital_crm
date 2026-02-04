import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pathologist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all pending/ordered lab orders
        const orders = await LabOrder.find({ status: { $in: ["ordered", "in-progress"] } })
            .populate("patientId", "firstName lastName mrn dob gender")
            .populate("orderingProviderId", "firstName lastName") // Note: LabOrder uses orderingProviderId
            .sort({ createdAt: 1 });

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Error fetching pathology queue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
