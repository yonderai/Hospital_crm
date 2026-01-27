"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { DollarSign, FileText, Download, PieChart, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PatientBillingHistoryPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [viewingInvoice, setViewingInvoice] = useState<any>(null);

    useEffect(() => {
        fetchBilling();
    }, []);

    const fetchBilling = () => {
        fetch('/api/patient/billing')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleDownload = (inv: any) => {
        setViewingInvoice(inv);
    };

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-12 pb-20">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">BILLING & INVOICES</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">FINANCIAL HISTORY & INSURANCE CREDITS</p>
                    </div>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[40px]"></div>)}
                        </div>
                        <div className="h-96 bg-slate-50 rounded-[40px]"></div>
                    </div>
                ) : (
                    <>
                        {/* High-level Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <StatCard
                                label="Total Billing"
                                value={`$${data.stats.totalSpent.toLocaleString()}`}
                                icon={DollarSign}
                                bg="bg-slate-900"
                                color="text-white"
                                trend="Gross Amount"
                            />
                            <StatCard
                                label="Insurance Credits"
                                value={`$${data.stats.insuranceCovered.toLocaleString()}`}
                                icon={ShieldCheck}
                                bg="bg-olive-500"
                                color="text-white"
                                trend="Deducted Savings"
                            />
                            <StatCard
                                label="Patient Payable"
                                value={`$${data.stats.balanceDue.toLocaleString()}`}
                                icon={FileText}
                                bg="bg-red-50"
                                color="text-red-600"
                                trend="Remaining Balance"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Expense Breakdown */}
                            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-olive-50 rounded-xl flex items-center justify-center text-olive-600">
                                            <PieChart size={20} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Spending Analysis</h3>
                                    </div>
                                    <div className="space-y-8">
                                        {data.breakdown.map((item: any, idx: number) => (
                                            <div key={idx}>
                                                <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                                                    <span>{item.label}</span>
                                                    <span className="text-slate-900">${item.value.toLocaleString()}</span>
                                                </div>
                                                <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                                                        style={{ width: `${(item.value / data.stats.totalSpent) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-12 p-6 bg-olive-50 rounded-3xl border border-olive-100">
                                    <p className="text-[10px] font-black text-olive-700 uppercase tracking-widest leading-relaxed">
                                        Note: Insurance credits are automatically applied upon successful claim verification.
                                    </p>
                                </div>
                            </div>

                            {/* Invoice List */}
                            <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Invoice History</h3>
                                    <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                                        <Activity size={14} className="text-slate-400" />
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Sync</span>
                                    </div>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <tr>
                                                <th className="px-10 py-6">Reference</th>
                                                <th className="px-6 py-6 text-right">Gross</th>
                                                <th className="px-6 py-6 text-right">Insurance</th>
                                                <th className="px-6 py-6 text-right">Patient Owed</th>
                                                <th className="px-10 py-6 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {data.invoices.map((inv: any, idx: number) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-10 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-900">{inv.id}</span>
                                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{inv.date}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <span className="text-sm font-bold text-slate-600">${inv.totalAmount.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <span className="text-sm font-black text-olive-600">-${inv.insuranceCoverage.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-6 py-6 text-right">
                                                        <span className="text-sm font-black text-slate-900">${inv.patientPayable.toLocaleString()}</span>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <button
                                                            onClick={() => handleDownload(inv)}
                                                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:text-white hover:bg-slate-900 hover:border-slate-900 transition-all text-xs font-black uppercase tracking-wider"
                                                        >
                                                            <Download size={14} /> Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Mock Invoice Modal */}
                {viewingInvoice && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                            <div className="p-10 bg-slate-900 text-white flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <ShieldCheck className="text-olive-400" size={32} />
                                        <h3 className="text-3xl font-black tracking-tighter uppercase">Medicore Invoice</h3>
                                    </div>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Official Financial Document</p>
                                </div>
                                <button onClick={() => setViewingInvoice(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-12 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice Number</p>
                                        <p className="text-lg font-bold text-slate-900">{viewingInvoice.id}</p>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date Issued</p>
                                        <p className="text-lg font-bold text-slate-900">{viewingInvoice.date}</p>
                                    </div>
                                </div>

                                <div className="border border-slate-100 rounded-3xl overflow-hidden">
                                    <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        <span>Item Description</span>
                                        <span>Amount</span>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                                            <span>{viewingInvoice.description || "Clinical Services"}</span>
                                            <span>${viewingInvoice.totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-500">
                                        <span>Gross Subtotal</span>
                                        <span>${viewingInvoice.totalAmount.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-black text-olive-600">
                                        <span className="flex items-center gap-2">
                                            <ShieldCheck size={14} />
                                            Insurance Paid
                                        </span>
                                        <span>-${viewingInvoice.insuranceCoverage.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                                        <span className="text-lg font-black text-slate-900 uppercase tracking-tight">Net Payable</span>
                                        <span className="text-2xl font-black text-slate-900">${viewingInvoice.patientPayable.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="pt-8 flex gap-4">
                                    <button
                                        onClick={() => window.print()}
                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/10"
                                    >
                                        <Download size={16} />
                                        Download PDF Invoice
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

function StatCard({ label, value, icon: Icon, bg, color, trend }: any) {
    return (
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10 transition-transform group-hover:translate-x-1 duration-500">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{value}</p>
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-olive-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trend}</span>
                </div>
            </div>
            <div className={`w-16 h-16 ${bg} ${color} rounded-3xl relative z-10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500 rotate-3 group-hover:rotate-0`}>
                <Icon size={32} />
            </div>
        </div>
    );
}

function X({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
    );
}
