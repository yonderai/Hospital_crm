import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "radiologist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all pending/ordered imaging orders
        // In a real app we might filter by 'assignedDoctorId' if assigned, or show all 'ordered' if pool.
        // We will show all 'ordered' status items.

        const orders = await ImagingOrder.find({ status: { $in: ["ordered", "in-progress"] } })
            .populate("patientId", "firstName lastName mrn dob gender")
            .populate("orderedBy", "firstName lastName")
            .sort({ createdAt: 1 });

        return NextResponse.json(orders);

    } catch (error) {
        console.error("Error fetching radiology queue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
