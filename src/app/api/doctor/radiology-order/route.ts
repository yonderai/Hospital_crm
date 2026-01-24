import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";
import Invoice from "@/lib/models/Invoice";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // 1. Create Imaging Order
        const order = await ImagingOrder.create({
            ...data,
            orderedBy: session.user.id,
            status: "ordered"
        });

        // 2. Auto-Billing Trigger (if needed)
        // Simplified: Add to invoice if exists
        let invoice = await Invoice.findOne({
            patientId: data.patientId,
            status: "draft"
        });

        if (invoice) {
            invoice.items.push({
                description: `Radiology: ${data.imagingType} - ${data.bodyPart}`,
                quantity: 1,
                unitPrice: 100, // Placeholder price
                total: 100
            });
            invoice.totalAmount = invoice.items.reduce((sum: number, item: any) => sum + item.total, 0);
            invoice.balanceDue = invoice.totalAmount - invoice.amountPaid;
            await invoice.save();
        }

        return NextResponse.json({ success: true, order });

    } catch (error) {
        console.error("Error creating radiology order:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
