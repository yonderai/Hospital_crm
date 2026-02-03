import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Invoice from "@/lib/models/Invoice";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        const userRole = (session?.user as any)?.role;

        if (!session || !['accountant', 'admin', 'finance', 'billing'].includes(userRole)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch all invoices with full details
        const invoices = await Invoice.find({})
            .populate("patientId", "firstName lastName mrn")
            .sort({ createdAt: -1 })
            .lean();

        // Serialize for JSON
        const serializedInvoices = invoices.map((inv: any) => ({
            _id: inv._id.toString(),
            invoiceNumber: inv.invoiceNumber || "N/A",
            patientId: inv.patientId ? {
                firstName: inv.patientId.firstName,
                lastName: inv.patientId.lastName,
                mrn: inv.patientId.mrn
            } : (inv.customerDetails && inv.customerDetails.name ? {
                firstName: inv.customerDetails.name,
                lastName: "",
                mrn: "N/A"
            } : { firstName: "Unknown", lastName: "Patient", mrn: "N/A" }),
            totalAmount: inv.totalAmount || 0,
            amountPaid: inv.amountPaid || 0,
            balanceDue: inv.balanceDue || 0,
            status: inv.status || "draft",
            items: inv.items || [],
            paymentSplit: inv.paymentSplit || [],
            createdAt: inv.createdAt,
            updatedAt: inv.updatedAt
        }));

        return NextResponse.json({
            success: true,
            invoices: serializedInvoices
        });

    } catch (error: any) {
        console.error("Error fetching detailed invoices:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
