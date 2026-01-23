"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { DollarSign, FileText, Download, PieChart, Activity } from "lucide-react";

export default function PatientBillingHistoryPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch('/api/patient/billing')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const handleDownload = (id: string) => {
        alert(`Downloading Invoice ${id}... (This is a demo feature)`);
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">BILLING & INVOICES</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">FINANCIAL OVERVIEW</p>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-8">
                        <div className="grid grid-cols-3 gap-6 h-32">
                            {[1, 2, 3].map(i => <div key={i} className="bg-slate-100 rounded-[32px]"></div>)}
                        </div>
                        <div className="h-64 bg-slate-100 rounded-[32px]"></div>
                    </div>
                ) : (
                    <>
                        {/* High-level Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                label="Total Spent"
                                value={`$${data.stats.totalSpent.toLocaleString()}`}
                                icon={DollarSign}
                                bg="bg-olive-50"
                                color="text-olive-600"
                            />
                            <StatCard
                                label="Covered by Insurance"
                                value={`$${data.stats.insuranceCovered.toLocaleString()}`}
                                icon={Activity}
                                bg="bg-blue-50"
                                color="text-blue-600"
                            />
                            <StatCard
                                label="Balance Due"
                                value={`$${data.stats.balanceDue.toLocaleString()}`}
                                icon={FileText}
                                bg="bg-red-50"
                                color="text-red-600"
                            />
                        </div>

                        {/* Expense Breakdown */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-black text-slate-900 mb-6">Expense Breakdown</h3>
                            <div className="space-y-6">
                                {data.breakdown.map((item: any, idx: number) => (
                                    <div key={idx}>
                                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                                            <span>{item.label}</span>
                                            <span>${item.value.toLocaleString()}</span>
                                        </div>
                                        <div className="h-4 bg-slate-50 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                                style={{ width: `${(item.value / data.stats.totalSpent) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Invoice List */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50">
                                <h3 className="text-lg font-black text-slate-900">Invoice History</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <tr>
                                            <th className="px-8 py-6">Invoice #</th>
                                            <th className="px-8 py-6">Date</th>
                                            <th className="px-8 py-6">Description</th>
                                            <th className="px-8 py-6">Amount</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {data.invoices.map((inv: any, idx: number) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 font-bold text-slate-700">{inv.id}</td>
                                                <td className="px-8 py-6 text-sm text-slate-500">{inv.date}</td>
                                                <td className="px-8 py-6 text-sm text-slate-900 font-medium">{inv.description}</td>
                                                <td className="px-8 py-6 font-black text-slate-900">${inv.amount}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${inv.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                                        }`}>
                                                        {inv.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button
                                                        onClick={() => handleDownload(inv.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-olive-700 hover:border-olive-200 transition-all text-xs font-bold uppercase tracking-wider"
                                                    >
                                                        <Download size={14} /> Invoice
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value, icon: Icon, bg, color }: any) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className={`p-4 ${bg} ${color} rounded-2xl relative z-10`}>
                <Icon size={24} />
            </div>
        </div>
    );
}
