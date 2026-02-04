import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import MedicalAsset from "@/lib/models/MedicalAsset";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Fetch all assets, or filter just by params if needed. 
        // Finance wants to see everything including furniture/generators.
        const assets = await MedicalAsset.find().sort({ purchaseDate: -1 });
        return NextResponse.json(assets);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        const asset = await MedicalAsset.create(body);
        return NextResponse.json(asset, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
    }
}
