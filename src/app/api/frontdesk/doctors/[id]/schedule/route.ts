import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user?.role !== "frontdesk" && session.user?.role !== "doctor")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const dateParam = searchParams.get('date');

        if (!dateParam) {
            return NextResponse.json({ error: "Date is required" }, { status: 400 });
        }

        // Logic to fetch appointments for this doctor on this date
        const dateObj = new Date(dateParam);
        const startOfDay = new Date(dateObj); startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateObj); endOfDay.setHours(23, 59, 59, 999);

        const appointments = await Appointment.find({
            providerId: params.id,
            startTime: { $gte: startOfDay, $lte: endOfDay },
            status: { $nin: ["cancelled"] }
        }).select("startTime endTime status");

        return NextResponse.json(appointments);

    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
