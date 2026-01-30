import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Ticket from "@/lib/models/Ticket";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["finance", "admin"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        await dbConnect();
        const { status, remarks, amount } = await req.json();

        const ticket = await Ticket.findById(params.id);
        if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

        const previousStatus = ticket.status;

        // Update fields
        ticket.status = status;

        // Add approval details if finalizing
        if (status === "Approved" || status === "Denied") {
            ticket.approvalDetails = {
                approvedBy: session.user.id,
                date: new Date(),
                remarks,
                amount: status === "Approved" ? amount : 0
            };
        }

        // Add to history
        ticket.history.push({
            action: `Status change: ${status}`,
            performedBy: session.user.name || "Finance Team",
            date: new Date(),
            statusFrom: previousStatus,
            statusTo: status
        });

        await ticket.save();

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error("Review ticket error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
