import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
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
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        // 2. Find or create a default Payer (Insurance)
        let payer = await Payer.findOne({ name: patient.insuranceInfo?.provider || "Default Insurance" });
        if (!payer) {
            payer = await Payer.create({
                name: patient.insuranceInfo?.provider || "Default Insurance",
                payerType: "insurance",
                isActive: true
            });
        }

        // 3. Create the Claim record
        const claim = await Claim.create({
            patientId: patient._id,
            encounterId: new mongoose.Types.ObjectId(), // Mocking encounter link
            payerId: payer._id,
            claimNumber: `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            status: "paid", // Auto-approving for demo purposes
            amountBilled: amount,
            amountAllowed: amount,
            submittedAt: new Date(),
            adjudicationNotes: reason || "Manual claim submission"
        });

        // 4. Update Invoices (Oldest first)
        const invoices = await Invoice.find({
            patientId: patient._id,
            balanceDue: { $gt: 0 },
            status: { $nin: ["paid", "void"] }
        }).sort({ createdAt: 1 });

        let remainingClaim = amount;
        for (const inv of invoices) {
            if (remainingClaim <= 0) break;

            const deduction = Math.min(inv.balanceDue, remainingClaim);

            inv.balanceDue -= deduction;
            inv.insuranceCoverage = (inv.insuranceCoverage || 0) + deduction;

            // Update insurance calculation fields
            if (!inv.insuranceCalculation) {
                inv.insuranceCalculation = {
                    totalBillAmount: inv.totalAmount,
                    insuranceCoveredAmount: 0,
                    totalPatientPayable: inv.totalAmount,
                    claimStatus: "not_initiated"
                };
            }

            inv.insuranceCalculation.insuranceCoveredAmount += deduction;
            inv.insuranceCalculation.totalPatientPayable -= deduction;
            inv.insuranceCalculation.claimStatus = inv.balanceDue === 0 ? "approved" : "partial";
            inv.insuranceCalculation.claimId = claim.claimNumber;

            if (inv.balanceDue === 0) {
                inv.status = "paid";
            } else {
                inv.status = "partial";
            }

            await inv.save();
            remainingClaim -= deduction;
        }

        // 5. Update Patient Insurance Utilization
        if (patient.insuranceInfo && patient.insuranceInfo.hasInsurance) {
            // This part depends on how you want to track total balance.
            // Sum insured vs balance.
            // For now, let's assume sumInsured is the limit and we subtract from balance if it exists.
            // If patient insuranceInfo just contains metadata, we might need a separate way to track usage.
            // In the UI, 'balance' was used.

            // Let's update insuranceInfo.sumInsured related fields if they exist
            // (Note: Patient model doesn't have an 'availableBalance' field, but the UI mocked it)
            // We could store it in notes or a custom metadata for now if needed, 
            // but the UI calculates it from invoices usually.
        }

        return NextResponse.json({
            message: 'Claim processed and billing updated',
            claimNumber: claim.claimNumber,
            amountDeducted: amount - remainingClaim
        });

    } catch (error) {
        console.error("Claim processing error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
