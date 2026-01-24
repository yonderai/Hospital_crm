import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import LabOrder from "@/lib/models/LabOrder";
import Invoice from "@/lib/models/Invoice";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // 1. Create Lab Order
        const labOrder = await LabOrder.create({
            ...data,
            orderingProviderId: session.user.id,
            orderId: `LAB-${Date.now()}`,
            status: "ordered",
            results: []
        });

        // 2. Auto-Billing Trigger
        let invoice = await Invoice.findOne({
            patientId: data.patientId,
            status: "draft"
        });

        if (invoice) {
            // Add tests to invoice
            data.tests.forEach((test: string) => {
                invoice.items.push({
                    description: `Lab Test: ${test}`,
                    quantity: 1,
                    unitPrice: 25, // Placeholder price
                    total: 25
                });
            });

            invoice.totalAmount = invoice.items.reduce((sum: number, item: any) => sum + item.total, 0);
            invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
            await invoice.save();
        }

        return NextResponse.json({ success: true, labOrder });

    } catch (error) {
        console.error("Error creating lab order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
