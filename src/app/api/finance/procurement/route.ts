import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import PurchaseOrder from "@/lib/models/PurchaseOrder";
import Supplier from "@/lib/models/Supplier";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const pos = await PurchaseOrder.find()
            .populate("supplierId", "name")
            .sort({ createdAt: -1 })
            .limit(100);
        return NextResponse.json(pos);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        // In a real app, we would validate items vs Inventory, etc.
        const po = await PurchaseOrder.create(body);
        return NextResponse.json(po, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create purchase order" }, { status: 500 });
    }
}
