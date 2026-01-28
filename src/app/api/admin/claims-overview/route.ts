import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Claim from "@/lib/models/Claim";
import Patient from "@/lib/models/Patient";
import Payer from "@/lib/models/Payer";
import { DollarSign, FileText, Activity, AlertCircle } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const claims = await Claim.find()
            .populate("patientId", "firstName lastName")
            .populate("payerId", "name")
            .sort({ createdAt: -1 })
            .limit(100);

        // Calculate Stats
        const totalClaims = claims.length;
        const totalBilled = claims.reduce((acc, curr) => acc + curr.amountBilled, 0);
        const denied = claims.filter(c => c.status === 'denied').length;
        const paid = claims.filter(c => c.status === 'paid').length;
        const pending = claims.filter(c => ['submitted', 'pending'].includes(c.status)).length;

        const denialRate = totalClaims > 0 ? ((denied / totalClaims) * 100).toFixed(1) + "%" : "0%";

        const formatCurrency = (amount: number) => `₹${(amount / 1000).toFixed(1)}k`;

        const stats = [
            { label: "Total Claimed", value: formatCurrency(totalBilled), change: "+8.4%", icon: "DollarSign", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Pending Review", value: pending.toString(), change: "+12", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Denial Rate", value: denialRate, change: "-1.2%", icon: "AlertCircle", color: "text-red-600", bg: "bg-red-50" },
            { label: "Settled Claims", value: paid.toString(), change: "+5", icon: "CheckCircle", color: "text-green-600", bg: "bg-green-50" },
        ];

        const mappedData = claims.map(c => ({
            id: c.claimNumber,
            name: (c.payerId as any)?.name || "Unknown Payer",
            status: c.status.charAt(0).toUpperCase() + c.status.slice(1),
            date: new Date(c.createdAt).toLocaleDateString(),
            value: `₹${c.amountBilled.toLocaleString()}`
        }));

        return NextResponse.json({
            data: mappedData,
            stats: stats
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
    }
}
