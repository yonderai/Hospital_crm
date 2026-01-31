import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Claim from "@/lib/models/Claim";
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

        if (!data.claimNumber) {
            data.claimNumber = `CLM-${Date.now().toString().slice(-8)}`;
        }

        const claim = await Claim.create(data);
        return NextResponse.json(claim, { status: 201 });
    } catch (error: any) {
        console.error("Claim Creation Error:", error);
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
        const patientId = searchParams.get("patientId");
        const status = searchParams.get("status");

        let filter: any = {};
        if (patientId) filter.patientId = patientId;
        if (status) filter.status = status;

        const claims = await Claim.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .populate("payerId", "name")
            .sort({ createdAt: -1 });

        const formattedClaims = claims.map((clm: any) => ({
            id: clm.claimNumber || "N/A",
            name: clm.patientId ? `${clm.patientId.firstName} ${clm.patientId.lastName}` : "Unknown Patient",
            status: clm.status.charAt(0).toUpperCase() + clm.status.slice(1),
            date: new Date(clm.createdAt).toLocaleDateString(),
            value: `₹${(clm.amountBilled || 0).toLocaleString()}`,
            _raw: clm
        }));

        return NextResponse.json({
            success: true,
            data: formattedClaims,
            stats: [
                { label: "Active Claims", value: formattedClaims.length.toString(), change: "Live", icon: "Ticket", color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Pending Adjudication", value: claims.filter((c: any) => c.status === 'pending').length.toString(), change: "Review", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Total Billed", value: `₹${claims.reduce((acc: number, curr: any) => acc + (curr.amountBilled || 0), 0).toLocaleString()}`, change: "Updated", icon: "DollarSign", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "Denial Rate", value: claims.length > 0 ? `${(claims.filter((c: any) => c.status === 'denied').length / claims.length * 100).toFixed(1)}%` : "0%", change: "Health", icon: "AlertCircle", color: "text-red-600", bg: "bg-red-50" }
            ]
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
