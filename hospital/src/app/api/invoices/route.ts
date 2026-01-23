
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";
import Patient from "@/lib/models/Patient";
import { protectRoute } from "@/lib/api-guard";

export async function GET(req: Request) {
    const auth = await protectRoute(["admin", "doctor", "front-desk", "revenue"]); // Assuming 'revenue' role exists or reusing admin/front-desk
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const invoices = await Invoice.find({})
            .sort({ createdAt: -1 })
            .populate("patientId", "firstName lastName");

        return NextResponse.json({ invoices });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await protectRoute(["admin", "revenue"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.patientId || !body.items || body.items.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Calculate totals
        const totalAmount = body.items.reduce((sum: number, item: any) => sum + item.total, 0);
        const balanceDue = totalAmount - (body.amountPaid || 0);

        const invoice = await Invoice.create({
            ...body,
            invoiceNumber: `INV-${Date.now().toString().slice(-6)}`, // Simple auto-gen
            totalAmount,
            balanceDue,
            status: balanceDue <= 0 ? 'paid' : 'sent'
        });

        return NextResponse.json(invoice, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
