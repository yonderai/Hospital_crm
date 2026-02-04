import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import StockLedger from "@/lib/models/StockLedger";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const itemId = searchParams.get("itemId");
        const limit = parseInt(searchParams.get("limit") || "50");

        await dbConnect();

        const query: any = {};
        if (itemId) query.itemId = itemId;

        const history = await StockLedger.find(query)
            .populate("itemId", "name sku unit")
            .populate("recordedBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .limit(limit);

        return NextResponse.json(history);

    } catch (error) {
        console.error("Ledger Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
