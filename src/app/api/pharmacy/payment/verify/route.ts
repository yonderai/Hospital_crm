import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Invoice from "@/lib/models/Invoice";
import Prescription from "@/lib/models/Prescription";

import InventoryItem from "@/lib/models/InventoryItem";
import mongoose from "mongoose";

// GET: Fetch Invoice/Payment Status for a Prescription
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const prescriptionId = searchParams.get("prescriptionId");

        if (!prescriptionId) {
            return NextResponse.json({ error: "Prescription ID required" }, { status: 400 });
        }

        await dbConnect();

        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) {
            return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
        }

        // Find invoice linked to the encounter or patient
        // Priority: Encounter ID -> Recent unpaid invoice for Patient
        let invoice;
        if (prescription.encounterId) {
            invoice = await Invoice.findOne({ encounterId: prescription.encounterId }).sort({ createdAt: -1 });
        }

        // Fallback: Check for open invoices for this patient created around the same time
        if (!invoice) {
            const date = new Date(prescription.prescribedDate);
            const startOfDay = new Date(date.setHours(0, 0, 0, 0));
            const endOfDay = new Date(date.setHours(23, 59, 59, 999));

            invoice = await Invoice.findOne({
                patientId: prescription.patientId,
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            }).sort({ createdAt: -1 });
        }

        if (!invoice) {
            // Calculate Potential Total from Inventory
            let potentialTotal = 0;
            const potentialItems = [];

            console.log("RX Medications:", prescription.medications);

            for (const med of prescription.medications) {
                // Try loose matching if exact fails
                const item = await InventoryItem.findOne({
                    name: { $regex: new RegExp(`^\\s*${med.drugName.trim()}\\s*$`, "i") }
                });

                console.log(`Looking up price for ${med.drugName}: Found`, item);

                const unitPrice = item?.sellingPrice || 0;
                if (unitPrice) {
                    potentialTotal += (med.quantity * unitPrice);
                }

                potentialItems.push({
                    drugName: med.drugName,
                    quantity: med.quantity,
                    unitPrice: unitPrice
                });
            }
            console.log("Calculated Potential Total:", potentialTotal);

            return NextResponse.json({
                status: "not_generated",
                invoiceId: "POTENTIAL", // Virtual ID
                totalAmount: potentialTotal,
                amountPaid: 0,
                balanceDue: potentialTotal,
                paymentSplit: [],
                message: "Invoice not generated yet, showing potential cost.",
                items: potentialItems // Added items breakdown
            });
        }

        // If invoice exists, refresh the unit prices from inventory to ensure accuracy
        // (Draft invoices might have stale or placeholder prices)
        const updatedItems = await Promise.all(invoice.items.map(async (invItem: any) => {
            // Extract drug name from "Pharmacy: DOLO (10)" -> "DOLO"
            // Format was: items.push({ description: `Pharmacy: ${med.drugName} (${med.quantity})` ...
            let drugName = invItem.description;
            const match = invItem.description.match(/^Pharmacy:\s*(.*?)\s*\(/);
            if (match) {
                drugName = match[1];
            }

            const item = await InventoryItem.findOne({
                name: { $regex: new RegExp(`^\\s*${drugName.trim()}\\s*$`, "i") }
            });

            return {
                ...invItem.toObject ? invItem.toObject() : invItem,
                unitPrice: item?.sellingPrice || invItem.unitPrice,
                drugName: drugName // Helper for frontend matching
            };
        }));

        // Recalculate total based on these fresh prices if status is draft
        let displayedTotal = invoice.totalAmount;
        if (invoice.status === 'draft' || invoice.status === 'partial') {
            displayedTotal = updatedItems.reduce((acc, i) => acc + (i.quantity * (i.unitPrice || 0)), 0);
        }

        return NextResponse.json({
            invoiceId: invoice._id,
            totalAmount: displayedTotal,
            amountPaid: invoice.amountPaid,
            balanceDue: displayedTotal - invoice.amountPaid,
            status: invoice.status,
            paymentSplit: invoice.paymentSplit,
            items: updatedItems
        });

    } catch (error: any) {
        console.error("Payment Fetch Error:", error);
        return NextResponse.json({ error: "Error fetching payment details" }, { status: 500 });
    }
}

// POST: Accept/Verify Payment
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["pharmacist", "pharmacy", "admin"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { invoiceId, paymentMode, amount, transactionId } = body;

        if (!invoiceId || !amount) {
            return NextResponse.json({ error: "Invoice ID and Amount required" }, { status: 400 });
        }

        await dbConnect();

        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Add payment entry
        invoice.paymentSplit.push({
            payer: "patient",
            amount: Number(amount),
            status: "paid",
            method: paymentMode || "cash",
            transactionId: transactionId || `MANUAL-${Date.now()}`,
            date: new Date()
        });

        // Update totals
        invoice.amountPaid += Number(amount);
        invoice.balanceDue = invoice.totalAmount - invoice.amountPaid - (invoice.insuranceCoverage || 0);

        if (invoice.balanceDue <= 0) {
            invoice.status = "paid";
            invoice.balanceDue = 0; // Prevent negative
        } else {
            invoice.status = "partial";
        }

        await invoice.save();

        return NextResponse.json({
            success: true,
            invoice: {
                invoiceId: invoice._id,
                totalAmount: invoice.totalAmount,
                amountPaid: invoice.amountPaid,
                balanceDue: invoice.balanceDue,
                status: invoice.status,
                paymentSplit: invoice.paymentSplit
            }
        });

    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json({ error: "Error verifying payment" }, { status: 500 });
    }
}
