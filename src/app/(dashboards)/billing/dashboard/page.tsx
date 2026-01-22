"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    FileText,
    CreditCard,
    TrendingUp,
    Plus,
    Activity,
    ShieldCheck,
    BarChart,
    AlertTriangle
} from "lucide-react";

export default function BillingDashboard() {
    const stats = [
        { title: "Today's Collections", value: "$12,450", icon: DollarSign, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Claims", value: "84", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Outstanding Invoices", value: "32", icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
        { title: "Revenue Growth", value: "+12.5%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    ];

    const invoiceQueue = [
        { patient: "Jim Morrison", amount: "$1,200", insurance: "Blue Cross", status: "Paid", date: "Jan 21, 2026", id: "#INV-901" },
        { patient: "Janis Joplin", amount: "$850", insurance: "Medicare", status: "Pending", date: "Jan 22, 2026", id: "#INV-902" },
        { patient: "Kurt Cobain", amount: "$2,400", insurance: "Self-Pay", status: "Overdue", date: "Jan 15, 2026", id: "#INV-899" },
        { patient: "Jimi Hendrix", amount: "$3,100", insurance: "Aetna", status: "Paid", date: "Jan 20, 2026", id: "#INV-898" },
        { patient: "Amy Winehouse", amount: "$550", insurance: "Cigna", status: "Pending", date: "Jan 22, 2026", id: "#INV-903" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Operations</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">BILLING MGR. WARREN BUFFETT • REVENUE CYCLE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Invoice
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em]">Export CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Invoice / Patient</th>
                                        <th className="px-8 py-4">Total Amount</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Due Date</th>
                                        <th className="px-8 py-4 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {invoiceQueue.map((inv, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group/row">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {inv.id.split('-')[1]}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{inv.patient}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.insurance}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-900 font-mono">{inv.amount}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${inv.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    inv.status === 'Pending' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-500 font-medium">{inv.date}</td>
                                            <td className="px-8 py-5 text-right pr-8">
                                                <button className="p-2 text-slate-400 hover:text-olive-700 bg-slate-50 rounded-lg border border-slate-200 transition-all">
                                                    <CreditCard size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Insurance Portal</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <ShieldCheck className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">12 Claims Submitted</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-black">Awaiting Response</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <AlertTriangle className="text-red-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-red-100">2 Denied Claims</p>
                                            <p className="text-[10px] text-red-300 mt-0.5 uppercase tracking-widest font-black underline">Requires Appeal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Tools</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <BarChart size={20} className="text-olive-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Reports</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <TrendingUp size={20} className="text-olive-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Ledger</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
