import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";
import { SessionUser } from "@/lib/types";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const ticket = await MaintenanceTicket.findById(id)
            .populate("requestedBy", "firstName lastName")
            .populate("approvedBy", "firstName lastName")
            .populate("comments.user", "firstName lastName");

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        // Access check
        if (role === "maintenance" && ticket.requestedBy._id.toString() !== userId) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        if (role !== "maintenance" && role !== "backoffice") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error fetching ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { status, action, feedback } = await req.json(); // action: "approve" | "reject"
        await dbConnect();

        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        const ticket = await MaintenanceTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        if (role === "backoffice") {
            if (action === "approve") {
                ticket.status = "Approved";
                ticket.approvedBy = userId;
            } else if (action === "reject") {
                ticket.status = "Rejected";
            }
            if (feedback) {
                ticket.comments.push({
                    user: userId,
                    text: feedback,
                    date: new Date()
                })
            }
        } else if (role === "maintenance") {
            if (ticket.requestedBy.toString() !== userId) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            // Maintenance can only update info or status if not closed? 
            if (status) ticket.status = status;
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await ticket.save();
        return NextResponse.json(ticket);

    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
