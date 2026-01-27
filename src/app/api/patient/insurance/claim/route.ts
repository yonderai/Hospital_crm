import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import Invoice from '@/lib/models/Invoice';
import Patient from '@/lib/models/Patient';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { claimAmount, notes } = body;

        if (!claimAmount || isNaN(claimAmount)) {
            return NextResponse.json({ error: "Invalid claim amount" }, { status: 400 });
        }

        await dbConnect();

        // Find the clinical patient profile for this user
        const patient = await Patient.findOne({ "contact.email": session.user?.email });
        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // Find the most recent invoice that isn't fully paid
        const latestInvoice = await Invoice.findOne({
            patientId: patient._id,
            status: { $ne: "paid" }
        }).sort({ createdAt: -1 });

        if (!latestInvoice) {
            return NextResponse.json({ error: "No active invoices found to file a claim against." }, { status: 404 });
        }

        // Apply insurance coverage
        // In a real system, this would be an "approval" process. 
        // For the demo, we'll assume it's accepted as per user request "if accept then...".

        latestInvoice.insuranceCoverage = (latestInvoice.insuranceCoverage || 0) + Number(claimAmount);

        // Ensure coverage doesn't exceed total
        if (latestInvoice.insuranceCoverage > latestInvoice.totalAmount) {
            latestInvoice.insuranceCoverage = latestInvoice.totalAmount;
        }

        // Recalculate balance
        latestInvoice.balanceDue = latestInvoice.totalAmount - latestInvoice.insuranceCoverage - latestInvoice.amountPaid;

        if (latestInvoice.balanceDue <= 0) {
            latestInvoice.balanceDue = 0;
            latestInvoice.status = "paid";
        } else if (latestInvoice.insuranceCoverage > 0 || latestInvoice.amountPaid > 0) {
            latestInvoice.status = "partial";
        }

        latestInvoice.notes = (latestInvoice.notes ? latestInvoice.notes + "\n" : "") + `Insurance Claim: $${claimAmount} applied. ${notes || ""}`;

        await latestInvoice.save();

        return NextResponse.json({
            message: "Insurance claim processed and applied to billing.",
            invoice: latestInvoice
        });

    } catch (error) {
        console.error("Insurance Claim Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
