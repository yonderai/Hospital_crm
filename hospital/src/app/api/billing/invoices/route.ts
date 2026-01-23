import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        if (!data.invoiceNumber) {
            data.invoiceNumber = `INV-${Date.now().toString().slice(-8)}`;
        }

        // Ensure balanceDue is set correctly initially
        if (!data.balanceDue) {
            data.balanceDue = data.totalAmount;
        }

        const invoice = await Invoice.create(data);
        return NextResponse.json(invoice, { status: 201 });
    } catch (error: any) {
        console.error("Invoice Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get("patientId");
        const status = searchParams.get("status");

        let filter: any = {};
        if (patientId) filter.patientId = patientId;
        if (status) filter.status = status;

        const invoices = await Invoice.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .sort({ createdAt: -1 });

        return NextResponse.json(invoices);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
