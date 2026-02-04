import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import User from "@/lib/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user?.role !== "frontdesk") {
            // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            // Allow admin too if needed, but requirements say Front Desk.
        }

        await dbConnect();

        const doctors = await User.find({ role: "doctor" })
            .select("_id firstName lastName department customId")
            .sort({ firstName: 1 });

        return NextResponse.json(doctors);

    } catch (error) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
