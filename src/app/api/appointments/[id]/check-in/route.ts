import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import { startOfDay, endOfDay } from "date-fns";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await dbConnect();

        // Find Appointment
        const appointment = await Appointment.findById(id);
        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        if (appointment.status === "checked-in") {
            return NextResponse.json({ error: "Patient already checked in" }, { status: 400 });
        }

        // Generate Token Number (Simple logic: Count visible appointments today + 1)
        // Or finding existing tokens for today + 1
        // For simplicity: We'll generate a random token or count
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const countToday = await Appointment.countDocuments({
            startTime: { $gte: todayStart, $lte: todayEnd },
            status: { $in: ["checked-in", "in-progress", "completed"] }
        });

        const tokenNumber = countToday + 1;

        // Update Status
        appointment.status = "checked-in";
        // Optionally store token in notes or a proper field if available. 
        // We'll append to notes for now as I don't recall a token field.
        appointment.notes = (appointment.notes || "") + ` [Token: ${tokenNumber}]`;

        await appointment.save();

        return NextResponse.json({
            success: true,
            status: "checked-in",
            token: tokenNumber
        });

    } catch (error: any) {
        console.error("Check-in API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
