import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";
import "@/lib/models/Patient"; // Ensure Patient model is registered for populate
import "@/lib/models/Encounter"; // Ensure Encounter model is registered

export const dynamic = 'force-dynamic'; // CRITICAL: Prevent static caching

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        console.log("[API] Billing Invoices - Session Role:", session?.user?.role);

        // Allow Admin, Accountant, and Finance
        if (!session || (session.user?.role !== "accountant" && session.user?.role !== "admin" && session.user?.role !== "finance")) {
            console.error("[API] Unauthorized Access Attempt. Role:", session?.user?.role);
            return NextResponse.json({ error: "Unauthorized", role: session?.user?.role }, { status: 401 });
        }

        await dbConnect();

        // Fetch draft/sent/overdue invoices
        const rawInvoices = await Invoice.find({ status: { $in: ["draft", "sent", "overdue"] } })
            .populate("patientId", "firstName lastName mrn")
            .sort({ updatedAt: -1 })
            .lean();

        const invoices = rawInvoices.map((inv: any) => ({
            id: inv.invoiceNumber || "N/A",
            name: inv.patientId ? `${inv.patientId.firstName} ${inv.patientId.lastName}` : "Unknown Patient",
            status: inv.status.charAt(0).toUpperCase() + inv.status.slice(1),
            date: new Date(inv.updatedAt).toLocaleDateString(),
            value: `₹${(inv.balanceDue || 0).toLocaleString()}`,
            _raw: inv
        }));

        console.log(`[API] Returning ${invoices.length} invoices`);
        return NextResponse.json({
            success: true,
            data: invoices,
            stats: [
                { label: "Pending Invoices", value: invoices.length.toString(), change: "Live", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
                { label: "Total Outstanding", value: `₹${rawInvoices.reduce((acc: number, curr: any) => acc + (curr.balanceDue || 0), 0).toLocaleString()}`, change: "Updated", icon: "DollarSign", color: "text-emerald-600", bg: "bg-emerald-50" },
                { label: "DUE TODAY", value: rawInvoices.filter((i: any) => i.status === 'overdue').length.toString(), change: "Critical", icon: "AlertCircle", color: "text-red-600", bg: "bg-red-50" },
                { label: "SYSTEM STATUS", value: "Locked", change: "SECURE", icon: "CheckCircle", color: "text-blue-600", bg: "bg-blue-50" }
            ]
        });

    } catch (error: any) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
