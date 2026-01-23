"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Briefcase,
    Download,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Activity
} from "lucide-react";

export default function AdminFinancePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchFinance = async () => {
            try {
                const res = await fetch('/api/admin/finance');
                const data = await res.json();
                if (data.summary) {
                    setStats(data.summary);
                }
            } catch (error) {
                console.error("Failed to fetch finance stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFinance();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Oversight</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">REVENUE • EXPENSES • PAYROLL (READ ONLY)</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} /> Export Fiscal Report
                    </button>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <FinanceCard
                        label="Total Revenue (YTD)"
                        value={stats ? `$${stats.revenue.toLocaleString()}` : "Loading..."}
                        icon={DollarSign}
                        trend="+12% vs last year"
                        trendUp={true}
                        color="bg-emerald-500"
                    />
                    <FinanceCard
                        label="Operating Expenses"
                        value="$1.2M"
                        icon={Briefcase}
                        trend="-5% efficiency gain"
                        trendUp={false} // Good that it's down, but visual indicates 'down'
                        color="bg-orange-500"
                    />
                    <FinanceCard
                        label="Outstanding Dues"
                        value={stats ? `$${stats.outstanding.toLocaleString()}` : "Loading..."}
                        icon={CreditCard}
                        trend="Critical Alert"
                        trendUp={false}
                        color="bg-red-500"
                    />
                    <FinanceCard
                        label="Net Profit Margin"
                        value="18.2%"
                        icon={TrendingUp}
                        trend="Healthy"
                        trendUp={true}
                        color="bg-blue-500"
                    />
                </div>

                {/* Breakdown Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Revenue Source */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Streams</h3>
                            <button className="p-2 hover:bg-slate-50 rounded-xl"><Activity size={20} className="text-slate-400" /></button>
                        </div>
                        <div className="space-y-6">
                            <StreamItem label="Insurance Claim Settlements" amount="$842,000" percent={65} color="bg-emerald-500" />
                            <StreamItem label="Direct Patient Payments" amount="$310,000" percent={24} color="bg-blue-500" />
                            <StreamItem label="Pharmacy Retail" amount="$92,000" percent={7} color="bg-purple-500" />
                            <StreamItem label="Government Grants" amount="$55,000" percent={4} color="bg-slate-500" />
                        </div>
                    </div>

                    {/* Invoice Status */}
                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Invoice Status</h3>
                        <div className="space-y-4">
                            {stats?.breakdown?.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${item._id === 'paid' ? 'bg-emerald-500' : item._id === 'pending' || item._id === 'sent' ? 'bg-orange-500' : 'bg-red-500'}`} />
                                        <span className="font-bold text-slate-700 capitalize text-sm">{item._id}</span>
                                    </div>
                                    <span className="font-black text-slate-900 text-sm">${item.total.toLocaleString()}</span>
                                </div>
                            ))}
                            {!stats && <div className="text-slate-400 text-center py-10">Loading Data...</div>}
                        </div>
                    </div>
                </div>

                {/* Read-Only Banner */}
                <div className="bg-slate-900 rounded-3xl p-6 flex items-center justify-center gap-4 text-slate-400 text-sm font-medium">
                    <Briefcase size={18} />
                    <span>This dashboard is in READ-ONLY mode. Transactions must be processed through the Billing Portal.</span>
                </div>
            </div>
        </DashboardLayout>
    );
}

function FinanceCard({ label, value, icon: Icon, trend, trendUp, color }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group hover:border-slate-200 transition-all">
            <div className={`absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-all`}>
                <Icon size={80} className="text-slate-900" />
            </div>

            <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg mb-6`}>
                    <Icon size={24} />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter mb-4">{value}</p>

                <div className="flex items-center gap-2">
                    {trendUp ? <ArrowUpRight size={14} className="text-emerald-500" /> : <ArrowDownRight size={14} className={color.includes("bg-orange") ? "text-orange-500" : "text-red-500"} />}
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${trendUp ? "text-emerald-600" : color.includes("bg-orange") ? "text-orange-600" : "text-red-600"}`}>
                        {trend}
                    </span>
                </div>
            </div>
        </div>
    );
}

function StreamItem({ label, amount, percent, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <span className="text-sm font-black text-slate-900">{amount}</span>
            </div>
            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden flex">
                <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
}
