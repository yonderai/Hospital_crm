
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Allow admin or doctor to trigger this manually
        if (!session || !['admin', 'doctor'].includes((session.user as any).role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const now = new Date();
        // Cut-off time: 15 minutes past start time
        const cutoffTime = new Date(now.getTime() - 15 * 60000);

        // Find Scheduled Appointments started more than 15 mins ago
        const result = await Appointment.updateMany(
            {
                status: "scheduled",
                startTime: { $lt: cutoffTime }
            },
            {
                $set: { status: "no-show" }
            }
        );

        return NextResponse.json({
            success: true,
            processed: result.modifiedCount,
            message: `Processed ${result.modifiedCount} appointments as No-Show.`
        });

    } catch (error) {
        console.error("Auto-Cancel Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
