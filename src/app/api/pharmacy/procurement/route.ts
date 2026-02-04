import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import InventoryItem from "@/lib/models/InventoryItem";
import Supplier from "@/lib/models/Supplier";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "admin", "finance"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const pos = await PurchaseOrder.find({})
            .populate("supplierId", "name contactPerson")
            .populate("items.itemId", "name sku")
            .sort({ createdAt: -1 });

        return NextResponse.json(pos);

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json(); // { supplierId, items: [{ itemId, quantity, unitCost }] }

        // Create PO
        // Create PO
        const now = new Date();
        const year = now.getFullYear();
        const count = await PurchaseOrder.countDocuments();
        const poNumber = `PO-${year}-${(count + 1).toString().padStart(3, '0')}`;

        let subtotal = 0;
        const items = body.items.map((i: any) => {
            const lineTotal = i.quantity * i.unitCost;
            subtotal += lineTotal;
            return {
                itemId: i.itemId,
                quantity: i.quantity,
                unitCost: i.unitCost,
                total: lineTotal
            };
        });

        // Simple tax calculation (e.g. 0 for now, or from body)
        const tax = body.tax || 0;
        const totalAmount = subtotal + tax;

        // Ensure we have a valid supplier Key (Simulating "Generic" if none provided for MVP)
        let supplierId = body.supplierId;
        if (!supplierId) {
            const genericSupplier = await Supplier.findOne({ name: "Generic Supplier" });
            if (genericSupplier) supplierId = genericSupplier._id;
            else {
                const newSup = await Supplier.create({ name: "Generic Supplier", categories: ["General"] });
                supplierId = newSup._id;
            }
        }

        const newPO = await PurchaseOrder.create({
            poNumber,
            supplierId,
            items,
            subtotal,
            tax,
            totalAmount,
            status: "ordered", // Direct to ordered for this flow
            orderedAt: new Date(),
            expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : undefined,
            notes: body.notes
        });

        return NextResponse.json({ success: true, po: newPO });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating PO" }, { status: 500 });
    }
}
