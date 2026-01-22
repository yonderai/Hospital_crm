"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Wallet,
    DollarSign,
    CreditCard,
    CheckCircle2,
    Calendar,
    ArrowUpRight,
    ArrowRight,
    ShieldCheck,
    AlertCircle,
    Download
} from "lucide-react";

const bills = [
    { id: "INV-1029", title: "Comprehensive Wellness Panel", amount: 420.00, insurance: 378.00, patient: 42.00, dueDate: "Jan 30, 2026", status: "pending" },
    { id: "INV-0988", title: "Chest X-Ray Interpretation", amount: 150.00, insurance: 150.00, patient: 0.00, dueDate: "Dec 28, 2025", status: "paid" },
    { id: "INV-0952", title: "Specialist Follow-up", amount: 200.00, insurance: 160.00, patient: 40.00, dueDate: "Nov 15, 2025", status: "paid" },
];

export default function PatientBilling() {
    const totalPending = bills.filter(b => b.status === 'pending').reduce((acc, curr) => acc + curr.patient, 0);

    return (
        <DashboardLayout>
            <div className="space-y-12">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Financial Node</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">Billing & Claims Management</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Claims History
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Bill List */}
                    <div className="lg:col-span-2 space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Recent Invoices</h3>
                        <div className="space-y-4">
                            {bills.map((bill) => (
                                <div key={bill.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between hover:border-olive-400 transition-all group">
                                    <div className="flex gap-6 items-center">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${bill.status === 'paid' ? 'bg-olive-50 text-olive-600' : 'bg-blue-50 text-blue-600'}`}>
                                            <DollarSign size={24} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-bold text-slate-900">{bill.title}</h4>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">{bill.id}</span>
                                            </div>
                                            <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                <span>Due: {bill.dueDate}</span>
                                                <span className="text-olive-600">Patient Resp: ${bill.patient.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xl font-black text-slate-900">${bill.amount.toFixed(2)}</p>
                                            <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${bill.status === 'paid' ? 'text-olive-600' : 'text-blue-600'}`}>
                                                {bill.status}
                                            </p>
                                        </div>
                                        <button className={`p-4 rounded-2xl transition-all ${bill.status === 'paid' ? 'bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white' : 'bg-olive-600 text-white shadow-lg shadow-olive-600/20 hover:bg-olive-700'}`}>
                                            {bill.status === 'paid' ? <Download size={18} /> : <ArrowRight size={18} />}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Sidebar */}
                    <div className="space-y-8">
                        {/* Summary Card */}
                        <div className="bg-[#0F172A] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl min-h-[400px] flex flex-col justify-between">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <Wallet className="text-teal-400" size={24} />
                                    <h4 className="text-xl font-black tracking-tight leading-none uppercase italic underline decoration-teal-500 underline-offset-8">Wallet Alpha</h4>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.3em] opacity-80">Total Outstanding</p>
                                    <p className="text-6xl font-black tracking-tighter">${totalPending.toFixed(2)}</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                                        <CreditCard className="text-slate-400 group-hover:text-teal-400" size={20} />
                                        <div>
                                            <p className="text-xs font-bold">VISA •••• 4242</p>
                                            <p className="text-[9px] text-slate-500 font-bold uppercase">Exp: 12/28</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-5 bg-teal-500 text-slate-900 rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center justify-center gap-3 shadow-xl shadow-teal-500/10">
                                        Pay Balance <ShieldCheck size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="absolute top-[-20%] right-[-20%] text-white/5 pointer-events-none">
                                <DollarSign size={400} />
                            </div>
                        </div>

                        {/* Help / Alert */}
                        <div className="bg-olive-50 border border-olive-100 rounded-[40px] p-8">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertCircle size={18} className="text-olive-700 shrink-0 mt-0.5" />
                                <h4 className="text-xs font-black text-olive-900 uppercase tracking-widest">Insurance Assistance</h4>
                            </div>
                            <p className="text-[11px] text-olive-800 leading-relaxed font-medium mb-6">
                                Have questions about your coverage or a specific claim? Our financial counselors are available 24/7.
                            </p>
                            <button className="w-full py-3 bg-white border border-olive-200 text-olive-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-olive-100 transition-all">
                                Message Counselor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
