import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "accountant") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch draft/sent/overdue invoices
        const invoices = await Invoice.find({ status: { $in: ["draft", "sent", "overdue"] } })
            .populate("patientId", "firstName lastName mrn")
            .sort({ updatedAt: -1 });

        return NextResponse.json(invoices);

    } catch (error) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
