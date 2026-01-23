import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Invoice from '@/lib/models/Invoice';

export async function GET() {
    await dbConnect();

    // Fetch invoices to represent expenses (e.g. vendor invoices)
    const invoices = await Invoice.find({})
        .limit(20)
        .sort({ createdAt: -1 });

    const data = invoices.map(inv => ({
        id: inv.invoiceNumber || 'EXP-000',
        name: inv.items?.[0]?.description || 'Operational Expense',
        status: inv.status === 'paid' ? 'Settled' : 'Pending',
        date: new Date(inv.dueDate || Date.now()).toLocaleDateString(),
        value: `$${inv.totalAmount?.toLocaleString() || '0'}`
    }));

    // Calculate total expenses for stats
    const totalExpense = invoices.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);

    return NextResponse.json({
        data,
        stats: [
            { label: "Total Expenses", value: `$${(totalExpense / 1000).toFixed(1)}k`, change: "+4.5%", icon: "DollarSign", color: "text-red-600", bg: "bg-red-50" },
            { label: "Pending Approvals", value: "12", change: "-2", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Budget Utilization", value: "74%", change: "+1.2%", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Procurement Requests", value: "8", change: "0%", icon: "Package", color: "text-olive-600", bg: "bg-olive-50" },
        ]
    });
}
