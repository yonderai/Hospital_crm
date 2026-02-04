import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
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
        const ticket = await MaintenanceTicket.findById(id).populate("requestedBy", "firstName lastName");

        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        // Access check
        const isStaff = ["maintenance", "backoffice", "finance", "admin"].includes(role);

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

        const body = await req.json();
        const { status, action, feedback, comments, images } = body;

        await dbConnect();

        const role = (session.user as unknown as SessionUser).role;
        const userId = (session.user as unknown as SessionUser).id;

        const ticket = await MaintenanceTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        // Logic for Finance/Backoffice/Admin approval
        if (role === "backoffice" || role === "finance" || role === "admin") {
            if (action === "approve") {
                ticket.status = "Approved";
                ticket.approvedBy = userId;
            } else if (action === "reject") {
                ticket.status = "Rejected";
            } else if (status) {
                // Direct status set if needed
                ticket.status = status;
            }

            if (feedback) {
                ticket.comments.push({
                    user: userId,
                    text: feedback,
                    date: new Date()
                });
            }
        } else if (role === "maintenance") {
            // Maintenance staff updates
            if (ticket.requestedBy.toString() === userId || role === 'maintenance') {
                // Allow maintenance to comment or add images
                if (comments) {
                    ticket.comments.push({
                        user: userId,
                        text: comments,
                        date: new Date()
                    });
                }
                if (images && Array.isArray(images)) {
                    ticket.images.push(...images);
                }
            } else {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
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
