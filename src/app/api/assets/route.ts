import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import MedicalAsset from "@/lib/models/MedicalAsset";
import MaintenanceLog from "@/lib/models/MaintenanceLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");
        const status = searchParams.get("status");

        let filter: any = {};
        if (category) filter.category = category;
        if (status) filter.status = status;

        const assets = await MedicalAsset.find(filter).sort({ nextMaintenanceDate: 1 });
        return NextResponse.json(assets);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const asset = await MedicalAsset.create(data);
        return NextResponse.json(asset, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
