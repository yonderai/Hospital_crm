import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Expense from "@/lib/models/Expense";
import { DollarSign, FileText, CheckCircle, Activity } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const expenses = await Expense.find().sort({ expenseDate: -1 }).limit(100);

        // Calculate Stats
        const totalSpend = expenses.reduce((acc, curr) => acc + curr.amount, 0);
        const pending = expenses.filter(e => e.status === 'pending').length;
        const paid = expenses.filter(e => e.status === 'paid').length;
        const approved = expenses.filter(e => e.status === 'approved').length;

        // Formatter for Currency
        const formatCurrency = (amount: number) => `₹${(amount / 1000).toFixed(1)}k`;

        const stats = [
            { label: "Total Spend", value: formatCurrency(totalSpend), change: "+12.5%", icon: "DollarSign", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Pending Approval", value: pending.toString(), change: "-3", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Paid Invoices", value: paid.toString(), change: "+8", icon: "CheckCircle", color: "text-green-600", bg: "bg-green-50" },
            { label: "Active Budget", value: "Optimal", change: "+4%", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
        ];

        const mappedData = expenses.map(e => ({
            id: e.invoiceNumber || e._id.toString().substring(0, 8).toUpperCase(),
            name: e.description,
            status: e.status.charAt(0).toUpperCase() + e.status.slice(1),
            date: new Date(e.expenseDate).toLocaleDateString(),
            value: `₹${e.amount.toLocaleString()}`
        }));

        return NextResponse.json({
            data: mappedData,
            stats: stats
        });

    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}
