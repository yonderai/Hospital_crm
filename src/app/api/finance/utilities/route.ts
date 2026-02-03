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

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id, status } = await req.json();
        await dbConnect();

        const updatedBill = await UtilityBill.findByIdAndUpdate(
            id,
            { status, paymentDate: status === 'paid' ? new Date() : undefined },
            { new: true }
        );

        if (!updatedBill) {
            return NextResponse.json({ error: "Bill not found" }, { status: 404 });
        }

        return NextResponse.json(updatedBill);
    } catch (error: any) {
        console.error("Payment Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update bill" }, { status: 500 });
    }
}
