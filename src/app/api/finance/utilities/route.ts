import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import UtilityBill from "@/lib/models/UtilityBill";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const bills = await UtilityBill.find().sort({ billDate: -1 }).limit(100);
        return NextResponse.json(bills);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch utility bills" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        const bill = await UtilityBill.create(body);
        return NextResponse.json(bill, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create utility bill" }, { status: 500 });
    }
}
