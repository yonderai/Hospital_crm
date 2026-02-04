import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Supplier from "@/lib/models/Supplier";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const suppliers = await Supplier.find({ isActive: true }).sort({ name: 1 });
        return NextResponse.json(suppliers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
    }
}
