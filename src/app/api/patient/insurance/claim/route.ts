import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from '@/lib/models/Patient';
import Invoice from '@/lib/models/Invoice';
import Claim from '@/lib/models/Claim';
import Payer from '@/lib/models/Payer';
import mongoose from 'mongoose';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { mrn, email, amount, reason, policyNumber } = body;

        console.log("Claim request received:", { mrn, email, amount, reason, policyNumber });

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Valid claim amount is required' }, { status: 400 });
        }

        await dbConnect();

        // 1. Find the patient
        let patient;
        if (mrn) {
            patient = await Patient.findOne({ mrn });
        } else if (email) {
            patient = await Patient.findOne({ "contact.email": email });
        } else if ((session.user as any).role === 'patient') {
            patient = await Patient.findOne({ "contact.email": session.user.email });
        }

        if (!patient) {
            console.error("Patient not found for claim");
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // 2. Fetch unpaid invoices to check total balance
        const invoices = await Invoice.find({
            patientId: patient._id,
            balanceDue: { $gt: 0 },
            status: { $nin: ["paid", "void"] }
        }).sort({ createdAt: 1 });

        const totalBalanceDue = invoices.reduce((sum, inv) => sum + (inv.balanceDue || 0), 0);
        console.log(`Total balance due for patient ${patient.mrn}: ${totalBalanceDue}`);

        // Validation: Amount cannot exceed total balance due
        if (amount > totalBalanceDue) {
            console.warn(`Claim amount ${amount} exceeds balance ${totalBalanceDue}`);
            return NextResponse.json({
                error: `Not valid to claim: Amount ₹${amount} exceeds total outstanding balance of ₹${totalBalanceDue}`
            }, { status: 400 });
        }

        // 3. Find or create a default Payer (Insurance)
        let payer = await Payer.findOne({ name: patient.insuranceInfo?.provider || "Default Insurance" });
        if (!payer) {
            payer = await Payer.create({
                name: patient.insuranceInfo?.provider || "Default Insurance",
                payerType: "insurance",
                isActive: true
            });
        }

        // 4. Create the Claim record
        // Note: Claim model requires encounterId, payerId, patientId
        const claim = await Claim.create({
            patientId: patient._id,
            encounterId: patient.lastEncounterId || new mongoose.Types.ObjectId(), // Use real encounter if available, else mock
            payerId: payer._id,
            claimNumber: `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            status: "paid", // Auto-approving for demo purposes
            amountBilled: amount,
            amountAllowed: amount,
            submittedAt: new Date(),
            adjudicationNotes: reason || "Manual claim submission from patient portal"
        });

        console.log("Created claim:", claim.claimNumber);

        // 5. Update Invoices (Deduct from oldest first)
        let remainingClaim = amount;
        for (const inv of invoices) {
            if (remainingClaim <= 0) break;

            const deduction = Math.min(inv.balanceDue, remainingClaim);

            inv.balanceDue -= deduction;
            inv.insuranceCoverage = (inv.insuranceCoverage || 0) + deduction;

            // Safely update insuranceCalculation
            if (!inv.insuranceCalculation) {
                inv.insuranceCalculation = {
                    totalBillAmount: inv.totalAmount || 0,
                    insuranceCoveredAmount: 0,
                    totalPatientPayable: inv.totalAmount || 0,
                    deductibleApplied: 0,
                    coPayApplied: 0,
                    coInsuranceApplied: 0,
                    claimStatus: "not_initiated"
                };
            }

            // Ensure numeric values to prevent NaN
            const currentCovered = Number(inv.insuranceCalculation.insuranceCoveredAmount) || 0;
            const currentPayable = Number(inv.insuranceCalculation.totalPatientPayable) || (Number(inv.totalAmount) || 0);

            inv.insuranceCalculation.insuranceCoveredAmount = currentCovered + deduction;
            inv.insuranceCalculation.totalPatientPayable = currentPayable - deduction;
            inv.insuranceCalculation.totalBillAmount = Number(inv.totalAmount) || 0;
            inv.insuranceCalculation.claimStatus = inv.balanceDue === 0 ? "approved" : "partial";
            inv.insuranceCalculation.claimId = claim.claimNumber;

            if (inv.balanceDue === 0) {
                inv.status = "paid";
            } else {
                inv.status = "partial";
            }

            await inv.save();
            remainingClaim -= deduction;
            console.log(`Updated invoice ${inv.invoiceNumber}: New balance ${inv.balanceDue}`);
        }

        return NextResponse.json({
            success: true,
            message: 'Claim processed and billing updated',
            claimNumber: claim.claimNumber,
            amountDeducted: amount - remainingClaim,
            remainingBalance: totalBalanceDue - (amount - remainingClaim)
        });

    } catch (error: any) {
        console.error("CRITICAL ERROR in Claim Processing:");
        console.error("Message:", error.message);
        console.error("Stack:", error.stack);

        // Return the specific error message so we can see it in the alert box
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: error.stack
        }, { status: 500 });
    }
}
