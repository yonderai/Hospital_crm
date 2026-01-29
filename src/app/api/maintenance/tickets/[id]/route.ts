import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";

export async function POST(req: Request, context: { params: { id: string } }) {
    return PATCH(req, context);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = params;
        console.log("PATCH request for ticket ID:", id);

        const body = await req.json();
        const { comment, images } = body;

        await dbConnect();

        const ticket = await MaintenanceTicket.findById(id);
        console.log("Ticket found:", !!ticket);

        if (!ticket) {
            console.log("Ticket not found for ID:", id);
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // RBAC: Maintenance staff cannot change status or approved amounts
        const role = (session.user as any).role;

        if (role === 'maintenance') {
            if (ticket.requestedBy.toString() !== (session.user as any).id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            // Can only add comments or images
            if (body.status || body.approvedAmount) {
                return NextResponse.json({ error: "Maintenance staff cannot update status or amounts" }, { status: 403 });
            }
        }

        // Finance/Admin Approval Logic
        if (role === 'finance' || role === 'admin') {
            if (body.status) {
                ticket.status = body.status;
                if (body.status === 'Approved') {
                    ticket.approvedBy = (session.user as any).id;
                }
            }
            if (body.actualCost) {
                ticket.actualCost = body.actualCost;
            }
        }

        if (comment) {
            ticket.comments.push({
                user: (session.user as any).id,
                text: comment,
                date: new Date()
            });
        }

        if (images && Array.isArray(images)) {
            ticket.images.push(...images);
        }

        await ticket.save();

        return NextResponse.json(ticket);
    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const ticket = await MaintenanceTicket.findById(params.id).populate("requestedBy", "firstName lastName");

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }
=
        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        // Access check
        const isStaff = ["maintenance", "backoffice", "finance"].includes(role);

        if (!isStaff) {
            // Regular users can only see their own tickets
            if (ticket.requestedBy._id.toString() !== userId) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

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

        if (role === "backoffice" || role === "finance") {
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
            // Maintenance can update status (e.g. In Progress, Completed)
            if (status) ticket.status = status;
        } else {
            // Regular users cannot update tickets
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await ticket.save();
        return NextResponse.json(ticket);

    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
