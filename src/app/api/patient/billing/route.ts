import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invoice from '@/lib/models/Invoice';
import Patient from '@/lib/models/Patient';

export async function GET() {
    await dbConnect();

    // Demo: Fetch for the first patient or a specific one
    const patient = await Patient.findOne({});
    if (!patient) return NextResponse.json({ error: 'Patient not found' }, { status: 404 });

    const invoices = await Invoice.find({ patientId: patient._id }).sort({ createdAt: -1 });

    // Aggregate stats
    let totalSpent = 0;
    let balanceDue = 0;
    const categoryBreakdown: any = {
        'Medicines': 0,
        'Lab Reports': 0,
        'Operations': 0,
        'Consultation': 0
    };

    invoices.forEach((inv: any) => {
        totalSpent += inv.totalAmount;
        balanceDue += inv.balanceDue;

        inv.items.forEach((item: any) => {
            const cat = item.category || 'Other';
            categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + item.total;
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
        amount: inv.totalAmount,
        status: inv.status,
        file: `/api/invoices/download/${inv.invoiceNumber}` // Mock download link
    }));

    return NextResponse.json({
        stats: {
            totalSpent,
            balanceDue,
            insuranceCovered: totalSpent * 0.6 // Mock insurance coverage
        },
        breakdown: categories,
        invoices: invoiceList
    });
}
