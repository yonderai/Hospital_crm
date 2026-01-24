import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "admin"].includes(session.user?.role as string)) {
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
        if (!session || session.user?.role !== "pharmacist") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.sku || !body.name) {
            return NextResponse.json({ error: "SKU and Name required" }, { status: 400 });
        }

        const newItem = await InventoryItem.create(body);
        return NextResponse.json({ success: true, item: newItem });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error creating item" }, { status: 500 });
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
