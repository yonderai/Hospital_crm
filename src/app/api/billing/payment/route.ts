import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Invoice from "@/lib/models/Invoice";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "accountant") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { invoiceId, paymentMethod } = await req.json();

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

        // Logic: Full payment
        invoice.amountPaid = invoice.totalAmount;
        invoice.balanceDue = 0;
        invoice.status = "paid";
        // invoice.paymentMethod = paymentMethod; // If we had this field in schema

        await invoice.save();

        return NextResponse.json({ success: true, invoice });

    } catch (error) {
        console.error("Error processing payment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
