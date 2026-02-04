import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
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
        const method = searchParams.get("method");

        let filter: any = {};
        if (patientId) filter.patientId = patientId;

        if (method === "cash") {
            filter.method = "cash";
        } else if (method === "digital") {
            filter.method = { $in: ["credit_card", "debit_card", "eft"] };
        }

        const payments = await Payment.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("invoiceId", "invoiceNumber")
            .sort({ paymentDate: -1 })
            .lean();

        const formattedPayments = payments.map((pay: any) => {
            let displayName = "Walk-in Customer";

            if (pay.patientId && typeof pay.patientId === 'object' && (pay.patientId.firstName || pay.patientId.lastName)) {
                displayName = `${pay.patientId.firstName || ''} ${pay.patientId.lastName || ''}`.trim();
            } else if (pay.customerName) {
                displayName = pay.customerName;
            }

            return {
                id: pay.transactionReference || pay._id.toString().slice(-6).toUpperCase(),
                name: displayName,
                status: pay.status.charAt(0).toUpperCase() + pay.status.slice(1),
                date: new Date(pay.paymentDate).toLocaleDateString(),
                value: `₹${(pay.amount || 0).toLocaleString()}`,
                _raw: pay
            };
        });

        return NextResponse.json({
            success: true,
            data: formattedPayments,
            stats: [
                { label: "Total Collected", value: `₹${payments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0).toLocaleString()}`, change: "Updated", icon: "DollarSign", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Transactions", value: formattedPayments.length.toString(), change: "Live", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Recent Payer", value: formattedPayments[0]?.name || "None", change: "Patient", icon: "Users", color: "text-slate-600", bg: "bg-slate-50" },
                { label: "Average Payment", value: payments.length > 0 ? `₹${(payments.reduce((acc: number, curr: any) => acc + (curr.amount || 0), 0) / payments.length).toFixed(0)}` : "₹0", change: "Insight", icon: "Package", color: "text-orange-600", bg: "bg-orange-50" }
            ]
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
