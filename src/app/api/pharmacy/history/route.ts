import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Prescription from "@/lib/models/Prescription";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const history = await Prescription.find({
            status: "completed",
            patientId: { $ne: null },
            providerId: { $ne: null }
        })
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName")
            .sort({ updatedAt: -1 })
            .limit(20);

        return NextResponse.json(history);

    } catch (error) {
        console.error("Error fetching pharmacy history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
