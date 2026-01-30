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

        // Manual serialization to ensure 100% clean JSON
        const invoices = rawInvoices.map((inv: any) => ({
            _id: inv._id.toString(),
            invoiceNumber: inv.invoiceNumber || "N/A",
            totalAmount: inv.totalAmount || 0,
            amountPaid: inv.amountPaid || 0,
            balanceDue: inv.balanceDue || 0,
            status: inv.status,
            updatedAt: inv.updatedAt,
            items: inv.items || [],
            patientId: inv.patientId ? {
                firstName: inv.patientId.firstName,
                lastName: inv.patientId.lastName,
                mrn: inv.patientId.mrn
            } : { firstName: "Unknown", lastName: "Patient", mrn: "N/A" }
        }));

        console.log(`[API] Returning ${invoices.length} invoices`);
        return NextResponse.json(invoices);

    } catch (error: any) {
        console.error("Error fetching invoices:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
