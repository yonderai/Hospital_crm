import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Ticket from "@/lib/models/Ticket";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const body = await req.json();

        const { title, description, category, priority, photoUrl } = body;

        const newTicket = await Ticket.create({
            title,
            description,
            category,
            priority,
            photoUrl,
            requestedBy: session.user.id,
            requestedByRole: session.user.role,
            history: [{
                action: "Created",
                performedBy: session.user.name || session.user.email,
                date: new Date(),
                statusTo: "Pending"
            }]
        });

        return NextResponse.json({ success: true, ticket: newTicket });
    } catch (error) {
        console.error("Create ticket error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        let tickets;
        // Finance and Admin allow full visibility
        if (["finance", "admin"].includes(session.user.role)) {
            tickets = await Ticket.find({}).populate("requestedBy", "firstName lastName email").sort({ createdAt: -1 });
        } else if (session.user.role === "maintenance") {
            // Maintenance staff only see Approved tickets (Work Orders)
            tickets = await Ticket.find({ status: "Approved" })
                .populate("requestedBy", "firstName lastName email")
                .sort({ createdAt: -1 });
        } else {
            // Other users only see their own tickets
            tickets = await Ticket.find({ requestedBy: session.user.id }).sort({ createdAt: -1 });
        }

        return NextResponse.json(tickets);
    } catch (error) {
        console.error("Fetch tickets error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["finance", "admin"].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const { id, status, action } = body;

        // Support both direct status update or "action" (approve/reject)
        let newStatus = status;
        if (action === "approve") newStatus = "Approved";
        if (action === "reject") newStatus = "Denied";

        if (!id || !newStatus) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 });

        ticket.status = newStatus;

        // Add to history
        ticket.history.push({
            action: `Status updated to ${newStatus}`,
            performedBy: session.user.name || session.user.email,
            date: new Date(),
            statusTo: newStatus
        });

        // Add approval details if approved
        if (newStatus === "Approved") {
            ticket.approvalDetails = {
                approvedBy: session.user.id,
                date: new Date()
            };
        }

        await ticket.save();

        return NextResponse.json({ success: true, ticket });
    } catch (error) {
        console.error("Update ticket error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
