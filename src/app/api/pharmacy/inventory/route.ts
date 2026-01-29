import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const items = await InventoryItem.find({}).sort({ name: 1 });
        return NextResponse.json(items);

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.sku || !body.name || !body.unit || body.unitCost === undefined) {
            return NextResponse.json({ error: "SKU, Name, Unit, and Unit Cost are required" }, { status: 400 });
        }

        const newItem = await InventoryItem.create({
            ...body,
            quantityOnHand: body.quantityOnHand || 0,
            reorderLevel: body.reorderLevel || 10,
            isActive: true
        });

        return NextResponse.json({ success: true, item: newItem });

    } catch (error: any) {
        console.error("Inventory Item Creation Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Error creating item" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { _id, ...updates } = await req.json();

        const updatedItem = await InventoryItem.findByIdAndUpdate(_id, updates, { new: true });
        return NextResponse.json({ success: true, item: updatedItem });

    } catch (error) {
        return NextResponse.json({ error: "Error updating item" }, { status: 500 });
    }
}
