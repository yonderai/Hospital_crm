import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Encounter from "@/lib/models/Encounter";
import Invoice from "@/lib/models/Invoice";
import Claim from "@/lib/models/Claim";
import Patient from "@/lib/models/Patient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Revenue Analytics (Last 6 months)
        const revenueStats = await Invoice.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    revenue: { $sum: "$totalAmount" },
                    paid: { $sum: "$amountPaid" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // 2. Patient Demographics (Gender)
        const genderDist = await Patient.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        // 3. Encounter Volume by Type
        const encounterTypes = await Encounter.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        // 4. Claim Status Breakdown
        const claimStatus = await Claim.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        return NextResponse.json({
            revenue: revenueStats,
            demographics: { gender: genderDist },
            encounters: encounterTypes,
            claims: claimStatus
        });
    } catch (error: any) {
        console.error("Analytics Fetch Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
