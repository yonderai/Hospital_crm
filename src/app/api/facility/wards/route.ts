import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import { Ward } from "@/lib/models/Facility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const wards = await Ward.find({}).sort({ wing: 1, floor: 1, name: 1 });
        return NextResponse.json(wards);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();
        const ward = await Ward.create(data);
        return NextResponse.json(ward, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
