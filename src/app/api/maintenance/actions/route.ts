import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, status, comment, actualCost, approvedAmount, images } = body;

        if (!id) {
            return NextResponse.json({ error: "Ticket ID is required" }, { status: 400 });
        }

        await dbConnect();

        const ticket = await MaintenanceTicket.findById(id);
        if (!ticket) {
            return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
        }

        const role = (session.user as any).role;

        // RBAC Logic
        if (role === 'maintenance') {
            if (ticket.requestedBy.toString() !== (session.user as any).id) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
            if (status || approvedAmount) {
                return NextResponse.json({ error: "Maintenance staff cannot update status or amounts" }, { status: 403 });
            }
        }

        if (role === 'finance' || role === 'admin') {
            if (status) {
                ticket.status = status;
                if (status === 'Approved') {
                    ticket.approvedBy = (session.user as any).id;
                }
            }
            if (actualCost) ticket.actualCost = actualCost;
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
        console.error("Error evaluating ticket action:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
