import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import InventoryItem from "@/lib/models/InventoryItem";
import { protectRoute } from "@/lib/api-guard";

export async function POST(req: NextRequest) {
    const auth = await protectRoute(["pharmacist", "inventory", "admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const data = await req.json();
        const item = await InventoryItem.create(data);
        return NextResponse.json(item, { status: 201 });
    } catch (error: any) {
        console.error("Inventory Item Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const auth = await protectRoute(["pharmacist", "inventory", "doctor", "nurse", "admin", "billing"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const category = searchParams.get("category");

        let filter: any = { isActive: true };
        if (query) {
            filter.$or = [
                { name: { $regex: query, $options: "i" } },
                { sku: { $regex: query, $options: "i" } }
            ];
        }
        if (category) filter.category = category;

        const items = await InventoryItem.find(filter).sort({ name: 1 });
        return NextResponse.json(items);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
