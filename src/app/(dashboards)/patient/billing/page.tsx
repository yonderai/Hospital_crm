"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    IndianRupee,
    CreditCard,
    Receipt,
    ShieldCheck,
    ChevronRight,
    Download,
    AlertCircle,
    TrendingUp,
    PieChart,
    ArrowUpRight
} from "lucide-react";

interface BillingData {
    stats: {
        totalSpent: number;
        balanceDue: number;
        insuranceCovered: number;
    };
    breakdown: {
        label: string;
        value: number;
        color: string;
    }[];
    invoices: {
        id: string;
        date: string;
        description: string;
        amount: number;
        status: string;
        file: string;
    }[];
}

export default function PatientBillingPage() {
    const [data, setData] = useState<BillingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch("/api/patient/billing");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Failed to fetch billing data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBilling();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-10 text-slate-400 font-bold animate-pulse text-center">
                    Accessing financial records...
                </div>
            </DashboardLayout>
        );
    }

    if (!data) return null;

    return (
        <DashboardLayout>
            <div className="space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Financial Overview</h1>
                        <p className="text-olive-600 text-sm font-bold mt-2 flex items-center gap-2">
                            <ShieldCheck size={16} /> Verified billing & insurance claims tracking
                        </p>
                    </div>
                    <button className="px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-sm flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                        <CreditCard size={18} /> Pay Outstanding Balance
                    </button>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <TrendingUp size={80} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Expenditure</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-slate-900">₹{data.stats.totalSpent.toLocaleString()}</span>
                            <span className="text-slate-400 font-bold">INR</span>
                        </div>
                        <div className="mt-6 flex items-center gap-2 text-green-600 font-bold text-xs bg-green-50 w-fit px-3 py-1.5 rounded-full">
                            <ArrowUpRight size={14} /> +12% from last month
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 text-white/10">
                            <AlertCircle size={80} />
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Balance Due</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white">₹{data.stats.balanceDue.toLocaleString()}</span>
                            <span className="text-slate-500 font-bold">INR</span>
                        </div>
                        <p className="mt-6 text-slate-400 text-xs font-medium">Due by next billing cycle (15th of the month)</p>
                    </div>

                    <div className="bg-olive-50/50 rounded-[40px] p-8 border border-olive-100/50 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 text-olive-200/50">
                            <ShieldCheck size={80} />
                        </div>
                        <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest mb-4">Insurance Covered</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-olive-900">₹{data.stats.insuranceCovered.toLocaleString()}</span>
                            <span className="text-olive-600/50 font-bold">INR</span>
                        </div>
                        <p className="mt-6 text-olive-700/60 text-xs font-medium italic">Estimated based on current policy (approx. 60%)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Category Breakdown */}
                    <div className="lg:col-span-1 bg-white rounded-[50px] p-10 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <PieChart size={24} className="text-olive-600" /> Breakdown
                            </h3>
                        </div>
                        <div className="space-y-6">
                            {data.breakdown.length === 0 ? (
                                <p className="text-slate-400 text-sm font-medium italic">No charges recorded yet</p>
                            ) : data.breakdown.map((item, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="text-slate-900">₹{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-3 bg-slate-50 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color.replace('bg-', 'bg-')} transition-all duration-1000`}
                                            style={{ width: `${(item.value / data.stats.totalSpent) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoice History */}
                    <div className="lg:col-span-2 bg-white rounded-[50px] p-10 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <Receipt size={24} className="text-olive-600" /> Invoice History
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-50 text-left">
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                                        <th className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="pb-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.invoices.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <Receipt size={48} className="mx-auto text-slate-100 mb-4" />
                                                <p className="text-slate-400 font-bold">No invoices found</p>
                                            </td>
                                        </tr>
                                    ) : data.invoices.map((inv) => (
                                        <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                                        <IndianRupee size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900">{inv.id}</p>
                                                        <p className="text-xs text-slate-400 font-medium max-w-[200px] truncate">{inv.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6">
                                                <span className="text-sm font-black text-slate-700">{inv.date}</span>
                                            </td>
                                            <td className="py-6">
                                                <span className="text-sm font-black text-slate-900">₹{inv.amount.toLocaleString()}</span>
                                            </td>
                                            <td className="py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    inv.status === 'draft' ? 'bg-slate-100 text-slate-600' :
                                                        'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 hover:shadow-sm">
                                                        <Download size={18} />
                                                    </button>
                                                    <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-olive-600 hover:shadow-sm">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
