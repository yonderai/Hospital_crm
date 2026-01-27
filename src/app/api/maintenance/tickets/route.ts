import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";
import { SessionUser } from "@/lib/types";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || (session.user as unknown as SessionUser).role !== "maintenance") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const ticket = await MaintenanceTicket.create({
            ...data,
            requestedBy: (session.user as unknown as SessionUser).id,
            status: "Open" // Force status on create
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        let query = {};
        if (role === "maintenance") {
            query = { requestedBy: userId };
        } else if (role === "backoffice") {
            // Backoffice sees all
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const tickets = await MaintenanceTicket.find(query)
            .populate("requestedBy", "firstName lastName")
            .populate("approvedBy", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
