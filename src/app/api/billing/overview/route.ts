import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Payment from "@/lib/models/Payment";
import Invoice from "@/lib/models/Invoice";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const preset = searchParams.get("preset");
        const startDateParam = searchParams.get("startDate");
        const endDateParam = searchParams.get("endDate");

        // Calculate date range based on preset or custom dates
        let startDate: Date;
        let endDate: Date;

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        if (preset === "today") {
            startDate = todayStart;
            endDate = todayEnd;
        } else if (preset === "yesterday") {
            const yesterday = new Date(todayStart);
            yesterday.setDate(yesterday.getDate() - 1);
            startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
            endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);
        } else if (preset === "last7days") {
            startDate = new Date(todayStart);
            startDate.setDate(startDate.getDate() - 6);
            endDate = todayEnd;
        } else if (preset === "last30days") {
            startDate = new Date(todayStart);
            startDate.setDate(startDate.getDate() - 29);
            endDate = todayEnd;
        } else if (startDateParam && endDateParam) {
            startDate = new Date(startDateParam);
            endDate = new Date(endDateParam);
            endDate.setHours(23, 59, 59, 999);
        } else {
            // Default to today
            startDate = todayStart;
            endDate = todayEnd;
        }

        // 1. Summary Statistics from Payments (for consistency with breakdown)
        const paymentSummary = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalPaid: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] } },
                    totalPending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
                    totalSales: { $sum: "$amount" },
                    billsGenerated: { $sum: 1 }
                }
            }
        ]);

        const summary = paymentSummary[0] || {
            totalSales: 0,
            totalPaid: 0,
            totalPending: 0,
            billsGenerated: 0
        };

        // 2. Payment Mode Breakdown
        const paymentBreakdown = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startDate, $lte: endDate },
                    status: "completed"
                }
            },
            {
                $group: {
                    _id: "$method",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Map payment methods to display categories
        const paymentModeBreakdown = {
            cash: 0,
            upi: 0,
            card: 0,
            insurance: {
                total: 0,
                approved: 0,
                pending: 0
            }
        };

        paymentBreakdown.forEach((item: any) => {
            if (item._id === "cash") {
                paymentModeBreakdown.cash = item.total;
            } else if (item._id === "eft") {
                paymentModeBreakdown.upi = item.total;
            } else if (item._id === "credit_card" || item._id === "debit_card") {
                paymentModeBreakdown.card += item.total;
            } else if (item._id === "insurance_eft") {
                paymentModeBreakdown.insurance.total += item.total;
            }
        });

        // Get insurance breakdown (approved vs pending)
        const insuranceBreakdown = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startDate, $lte: endDate },
                    method: "insurance_eft"
                }
            },
            {
                $group: {
                    _id: "$status",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        insuranceBreakdown.forEach((item: any) => {
            if (item._id === "completed") {
                paymentModeBreakdown.insurance.approved = item.total;
            } else if (item._id === "pending") {
                paymentModeBreakdown.insurance.pending = item.total;
            }
        });

        // 3. Daily Trend
        const dailyTrend = await Payment.aggregate([
            {
                $match: {
                    paymentDate: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$paymentDate" }
                    },
                    sales: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$amount", 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, "$amount", 0] } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 4. Recent Transactions
        const recentTransactions = await Payment.find({
            paymentDate: { $gte: startDate, $lte: endDate }
        })
            .populate("patientId", "firstName lastName mrn")
            .populate("invoiceId", "invoiceNumber")
            .sort({ paymentDate: -1 })
            .limit(50)
            .lean();

        const formattedTransactions = recentTransactions.map((payment: any) => {
            let patientName = "Walk-in Customer";

            if (payment.patientId && typeof payment.patientId === 'object' && (payment.patientId.firstName || payment.patientId.lastName)) {
                patientName = `${payment.patientId.firstName || ''} ${payment.patientId.lastName || ''}`.trim();
            } else if (payment.customerName) {
                patientName = payment.customerName;
            }

            // Map method to display name
            let paymentMode = payment.method;
            if (payment.method === "eft") paymentMode = "UPI";
            else if (payment.method === "credit_card") paymentMode = "Credit Card";
            else if (payment.method === "debit_card") paymentMode = "Debit Card";
            else if (payment.method === "insurance_eft") paymentMode = "Insurance";
            else if (payment.method === "cash") paymentMode = "Cash";

            return {
                invoiceNumber: payment.invoiceId?.invoiceNumber || "N/A",
                patientName,
                amount: payment.amount,
                paymentMode,
                status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
                date: payment.paymentDate
            };
        });

        return NextResponse.json({
            success: true,
            summary,
            paymentModeBreakdown,
            dailyTrend,
            recentTransactions: formattedTransactions
        });

    } catch (error: any) {
        console.error("Billing Overview Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
