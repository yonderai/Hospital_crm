import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Payer from "@/lib/models/Payer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const payer = await Payer.create(data);
        return NextResponse.json(payer, { status: 201 });
    } catch (error: any) {
        console.error("Payer Creation Error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        let filter: any = { isActive: true };
        if (query) {
            filter.name = { $regex: query, $options: "i" };
        }

        const payers = await Payer.find(filter).sort({ name: 1 });
        return NextResponse.json(payers);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
