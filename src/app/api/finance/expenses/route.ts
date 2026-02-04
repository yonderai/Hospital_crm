import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Expense from "@/lib/models/Expense";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await dbConnect();
        const expenses = await Expense.find().sort({ expenseDate: -1 }).limit(100);
        return NextResponse.json(expenses);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        // Basic RBAC check - real apps might need finer grain
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        await dbConnect();

        const expense = await Expense.create(body);
        return NextResponse.json(expense, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create expense" }, { status: 500 });
    }
}
