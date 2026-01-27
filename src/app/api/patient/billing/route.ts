import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import Invoice from '@/lib/models/Invoice';
import Patient from '@/lib/models/Patient';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'patient') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find the clinical patient profile for this user
        const patient = await Patient.findOne({ "contact.email": session.user?.email });
        if (!patient) {
            return NextResponse.json({
                stats: { totalSpent: 0, balanceDue: 0, insuranceCovered: 0 },
                breakdown: [],
                invoices: []
            });
        }

        const invoices = await Invoice.find({ patientId: patient._id }).sort({ createdAt: -1 });

        // Aggregate stats
        let totalSpent = 0;
        let balanceDue = 0;
        let insuranceCovered = 0;
        const categoryBreakdown: any = {
            'Medicines': 0,
            'Lab Reports': 0,
            'Operations': 0,
            'Consultation': 0
        };

        invoices.forEach((inv: any) => {
            totalSpent += inv.totalAmount;
            balanceDue += inv.balanceDue;
            insuranceCovered += (inv.insuranceCoverage || 0);

            inv.items.forEach((item: any) => {
                const cat = item.category || 'Consultation';
                const normalizedCat = item.description.toLowerCase().includes('pharmacy') ? 'Medicines' : cat;
                categoryBreakdown[normalizedCat] = (categoryBreakdown[normalizedCat] || 0) + item.total;
            });
        });

        const categories = Object.keys(categoryBreakdown).map(cat => ({
            label: cat,
            value: categoryBreakdown[cat],
            color: cat === 'Medicines' ? 'bg-blue-500' :
                cat === 'Lab Reports' ? 'bg-purple-500' :
                    cat === 'Operations' ? 'bg-red-500' : 'bg-olive-500'
        })).filter(c => c.value > 0);

        const invoiceList = invoices.map((inv: any) => ({
            id: inv.invoiceNumber,
            date: new Date(inv.createdAt).toLocaleDateString(),
            description: inv.items.map((i: any) => i.description).join(', '),
            totalAmount: inv.totalAmount,
            insuranceCoverage: inv.insuranceCoverage || 0,
            patientPayable: inv.balanceDue + inv.amountPaid, // Total minus insurance
            balanceDue: inv.balanceDue,
            status: inv.status,
            file: `#`
        }));

        return NextResponse.json({
            stats: {
                totalSpent,
                balanceDue,
                insuranceCovered
            },
            breakdown: categories,
            invoices: invoiceList
        });
    } catch (error) {
        console.error("Billing fetch error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
