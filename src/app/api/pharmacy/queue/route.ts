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

        const prescriptions = await Prescription.find({ status: "active" })
            .populate("patientId", "firstName lastName mrn")
            .populate("providerId", "firstName lastName")
            .sort({ prescribedDate: 1 });

        return NextResponse.json(prescriptions);

    } catch (error) {
        console.error("Error fetching pharmacy queue:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
