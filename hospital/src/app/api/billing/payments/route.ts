import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Payment from "@/lib/models/Payment";
import Invoice from "@/lib/models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mongoose = require('mongoose');
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
        await dbConnect();
        const data = await req.json();

        const payment = await Payment.create([data], { session: dbSession });

        // If payment is for an invoice, update the invoice
        if (data.invoiceId) {
            const invoice = await Invoice.findById(data.invoiceId).session(dbSession);
            if (invoice) {
                invoice.amountPaid += data.amount;
                invoice.balanceDue -= data.amount;

                if (invoice.balanceDue <= 0) {
                    invoice.status = "paid";
                    invoice.balanceDue = 0;
                } else if (invoice.amountPaid > 0) {
                    invoice.status = "partial";
                }

                await invoice.save({ session: dbSession });
            }
        }

        await dbSession.commitTransaction();
        dbSession.endSession();

        return NextResponse.json(payment[0], { status: 201 });
    } catch (error: any) {
        await dbSession.abortTransaction();
        dbSession.endSession();
        console.error("Payment Creation Error:", error);
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

        let filter: any = {};
        if (patientId) filter.patientId = patientId;

        const payments = await Payment.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("invoiceId", "invoiceNumber")
            .sort({ paymentDate: -1 });

        return NextResponse.json(payments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
