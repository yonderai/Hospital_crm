import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Invoice from '@/lib/models/Invoice';
import Patient from '@/lib/models/Patient';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'frontdesk', 'billing'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const patientId = params.id;
        await dbConnect();

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
        }

        const invoices = await Invoice.find({ patientId: patient._id }).sort({ createdAt: -1 });

        // Aggregate stats
        let totalSpent = 0;
        let balanceDue = 0;
        let insuranceCovered = 0;

        invoices.forEach((inv: any) => {
            totalSpent += inv.totalAmount;
            balanceDue += inv.balanceDue;
            insuranceCovered += (inv.insuranceCoverage || 0);
        });

        const invoiceList = invoices.map((inv: any) => ({
            id: inv.invoiceNumber,
            date: new Date(inv.createdAt).toLocaleDateString(),
            description: inv.items.map((i: any) => i.description).join(', '),
            amount: inv.totalAmount,
            insuranceCoverage: inv.insuranceCoverage || 0,
            balanceDue: inv.balanceDue,
            status: inv.status,
            file: `#`
        }));

        return NextResponse.json({
            patient: {
                name: `${patient.firstName} ${patient.lastName}`,
                mrn: patient.mrn,
                insurance: patient.insuranceInfo
            },
            stats: {
                totalSpent,
                balanceDue,
                insuranceCovered
            },
            invoices: invoiceList
        });
    } catch (error) {
        console.error("Billing fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
