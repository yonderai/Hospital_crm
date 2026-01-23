import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";
import { protectRoute } from "@/lib/api-guard";

export async function GET() {
    const auth = await protectRoute(["admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();

        // Aggregation for Finance Stats
        // 1. Total Revenue (Paid)
        // 2. Outstanding Balance
        // 3. Status Breakdown

        const stats = await Invoice.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amountPaid" },
                    outstanding: { $sum: "$balanceDue" },
                    avgInvoiceValue: { $avg: "$totalAmount" }
                }
            }
        ]);

        const statusBreakdown = await Invoice.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } }
        ]);

        // Mocking expenses for demo since Expense model doesn't exist yet (plan called for "Expense summary")
        // In real app, we would query Expense model.
        const financeSummary = {
            revenue: stats[0]?.totalRevenue || 0,
            outstanding: stats[0]?.outstanding || 0,
            avgTransaction: stats[0]?.avgInvoiceValue || 0,
            breakdown: statusBreakdown
        };

        return NextResponse.json({ summary: financeSummary });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
