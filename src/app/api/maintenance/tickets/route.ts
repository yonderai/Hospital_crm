import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import MaintenanceTicket from "@/lib/models/MaintenanceTicket";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        // Maintenance staff can only view their own tickets
        // Other roles might view all, but for now we enforce restriction if maintenance

        await dbConnect();

        const query: any = {};

        if (role === 'maintenance') {
            query.requestedBy = (session.user as any).id;
        } else if (role === 'admin' || role === 'finance') {
            // Admins/Finance can see all (optional, but good for testing)
            // query is empty
        } else {
            // Other roles should not access this endpoint or see only their own?
            // Safest to restrict to own for general users if exposed, or strictly maintenance endpoint
            query.requestedBy = (session.user as any).id;
        }

        const tickets = await MaintenanceTicket.find(query).populate("requestedBy", "firstName lastName").sort({ createdAt: -1 });

        return NextResponse.json(tickets);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only allowed roles can raise? Or anyone?
        // User request: "Maintenance staff should be able to... Raise Maintenance Tickets"
        // Implicitly allows maintenance staff.

        const body = await req.json();
        const { title, description, category, priority, estimatedCost, images } = body;

        await dbConnect();

        const ticket = await MaintenanceTicket.create({
            title,
            description,
            category,
            priority,
            estimatedCost,
            images,
            requestedBy: (session.user as any).id,
            status: "Open"
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
