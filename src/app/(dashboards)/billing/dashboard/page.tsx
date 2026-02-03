"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import DateRangeFilter from "@/components/billing/DateRangeFilter";
import SummaryCards from "@/components/billing/SummaryCards";
import PaymentModeChart from "@/components/billing/PaymentModeChart";
import TrendChart from "@/components/billing/TrendChart";
import { Loader2 } from "lucide-react";

interface AnalyticsData {
    summary: {
        totalSales: number;
        billsGenerated: number;
        totalPaid: number;
        totalPending: number;
    };
    paymentModeBreakdown: {
        cash: number;
        upi: number;
        card: number;
        insurance: {
            total: number;
            approved: number;
            pending: number;
        };
    };
    dailyTrend: Array<{
        _id: string;
        sales: number;
        pending: number;
        count: number;
    }>;
    recentTransactions: Array<{
        invoiceNumber: string;
        patientName: string;
        amount: number;
        paymentMode: string;
        status: string;
        date: string;
    }>;
}

export default function BillingDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPreset, setCurrentPreset] = useState("today");
    const [error, setError] = useState("");

    const fetchAnalytics = async (preset: string, startDate?: string, endDate?: string) => {
        setLoading(true);
        setError("");

        try {
            let url = `/api/billing/overview?preset=${preset}`;
            if (preset === "custom" && startDate && endDate) {
                url = `/api/billing/overview?startDate=${startDate}&endDate=${endDate}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            if (res.ok && data.success) {
                setAnalytics(data);
            } else {
                setError(data.error || "Failed to fetch analytics");
            }
        } catch (err) {
            console.error("Analytics fetch error:", err);
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics("today");
    }, []);

    const handleDateChange = (preset: string, startDate?: string, endDate?: string) => {
        setCurrentPreset(preset);
        fetchAnalytics(preset, startDate, endDate);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
                        Billing Overview
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track sales, payments, and revenue analytics
                    </p>
                </div>

                {/* Date Filter */}
                <DateRangeFilter onDateChange={handleDateChange} currentPreset={currentPreset} />

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-emerald-500" size={48} />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-600 font-semibold">{error}</p>
                    </div>
                )}

                {/* Analytics Content */}
                {!loading && !error && analytics && (
                    <>
                        {/* Summary Cards */}
                        <SummaryCards
                            totalSales={analytics.summary.totalSales}
                            billsGenerated={analytics.summary.billsGenerated}
                            totalPaid={analytics.summary.totalPaid}
                            totalPending={analytics.summary.totalPending}
                        />

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <PaymentModeChart data={analytics.paymentModeBreakdown} />
                            <TrendChart data={analytics.dailyTrend} />
                        </div>


                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
