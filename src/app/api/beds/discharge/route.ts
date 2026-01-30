import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Bed from "@/lib/models/Bed";
import Patient from "@/lib/models/Patient";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { bedId } = body;

        // 1. Verify Bed
        const bed = await Bed.findById(bedId);
        if (!bed) return NextResponse.json({ error: "Bed not found" }, { status: 404 });
        if (bed.status !== "occupied") return NextResponse.json({ error: "Bed is not occupied" }, { status: 400 });

        // 2. Discharge Logic
        // In a real app, we would update an Admission record with discharge time/notes.
        // For now, we just free up the bed.

        const previousPatientId = bed.currentPatientId;

        bed.status = "available";
        bed.currentPatientId = undefined;
        await bed.save();

        // 3. Return success
        return NextResponse.json({
            success: true,
            message: "Patient discharged successfully",
            details: {
                bed: `${bed.roomNumber} - ${bed.bedNumber}`,
                dischargedPatientId: previousPatientId
            }
        });

    } catch (error: any) {
        console.error("Discharge Error:", error);
        return NextResponse.json({ error: error.message || "Discharge Failed" }, { status: 500 });
    }
}
