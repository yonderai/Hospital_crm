import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Invoice from "@/lib/models/Invoice";
import Patient from "@/lib/models/Patient";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !['admin', 'frontdesk', 'billing'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all invoices that have balance due, ordered by recent
        const invoices = await Invoice.find({ balanceDue: { $gt: 0 } })
            .populate('patientId', 'firstName lastName mrn')
            .sort({ createdAt: -1 })
            .limit(50);

        // Calculate stats for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const collectedToday = await Invoice.find({
            updatedAt: { $gte: today },
            status: { $in: ['paid', 'partial'] }
        });

        const stats = {
            collectedToday: collectedToday.reduce((acc, curr) => acc + curr.amountPaid, 0),
            regFeesCollectedToday: collectedToday.filter(inv => inv.invoiceNumber.includes('REG')).reduce((acc, curr) => acc + curr.amountPaid, 0)
        };

        const formattedInvoices = invoices.map(inv => ({
            id: inv._id,
            invoiceNumber: inv.invoiceNumber,
            patientName: inv.patientId ? `${(inv.patientId as any).firstName} ${(inv.patientId as any).lastName}` : "Unknown",
            mrn: inv.patientId ? (inv.patientId as any).mrn : "N/A",
            description: inv.items.map((i: any) => i.description).join(', '),
            totalAmount: inv.totalAmount,
            balanceDue: inv.balanceDue,
            status: inv.status,
            date: inv.createdAt,
            type: inv.invoiceNumber.includes('REG') ? 'Registration' : 'Clinical'
        }));

        return NextResponse.json({
            success: true,
            invoices: formattedInvoices,
            todayStats: stats
        });
    } catch (error: any) {
        console.error("Fees fetch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
