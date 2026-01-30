"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    FileText,
    CreditCard,
    TrendingUp,
    AlertCircle,
    Plus,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from "recharts";

const revenueData = [
    { name: "Mon", revenue: 4200 },
    { name: "Tue", revenue: 4800 },
    { name: "Wed", revenue: 6200 },
    { name: "Thu", revenue: 5800 },
    { name: "Fri", revenue: 7500 },
    { name: "Sat", revenue: 5200 },
    { name: "Sun", revenue: 3800 },
];

const recentInvoices = [
    { id: "INV-10023", patient: "Emma Wilson", date: "2024-03-20", amount: 1250.00, status: "paid", method: "Credit Card" },
    { id: "INV-10024", patient: "Marcus Thorne", date: "2024-03-21", amount: 450.00, status: "pending", method: "Insurance" },
    { id: "INV-10025", patient: "Sarah Miller", date: "2024-03-21", amount: 890.00, status: "overdue", method: "Self-Pay" },
    { id: "INV-10026", patient: "John Davis", date: "2024-03-22", amount: 2100.00, status: "partial", method: "Cash" },
];

export default function BillingDashboard() {
    const stats = [
        { title: "Total Revenue", value: "₹124,500", change: "+12.5%", trendingUp: true, icon: DollarSign, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Claims", value: "42", change: "-3", trendingUp: false, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Unpaid Invoices", value: "₹18,200", change: "+5.2%", trendingUp: true, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        { title: "Collection Rate", value: "94%", change: "+1.2%", trendingUp: true, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Finance Protocol</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">Billing & Revenue Cycle Management</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Generate Report
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Create Invoice
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:border-olive-400 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                    <s.icon size={24} />
                                </div>
                                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${s.trendingUp ? 'text-green-600' : 'text-red-600'}`}>
                                    {s.change}
                                    {s.trendingUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Revenue Trend */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trajectory</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Weekly Performance Analysis</p>
                            </div>
                            <div className="flex gap-2 text-[10px] font-black bg-slate-50 rounded-xl p-1 border border-slate-100">
                                <button className="px-4 py-2 bg-white text-olive-700 rounded-lg shadow-sm">Week</button>
                                <button className="px-4 py-2 text-slate-500 hover:text-slate-900 transition-all">Month</button>
                            </div>
                        </div>
                        <div className="flex-1 w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 800 }}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontWeight: 800 }}
                                        tickFormatter={(value) => `₹${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="revenue" fill="#6B8E23" radius={[6, 6, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Actions & Payer Breakdown */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between min-h-[450px]">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-teal-400" size={24} />
                                    <h4 className="text-xl font-black tracking-tight leading-none uppercase">Payment Hub</h4>
                                </div>

                                <div className="space-y-6">
                                    <h5 className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em] opacity-80 border-l-2 border-teal-500 pl-4">Transaction Summary</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Cleared</p>
                                            <p className="text-xl font-black text-white">₹45.2K</p>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                                            <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Processing</p>
                                            <p className="text-xl font-black text-white text-teal-400">₹8.9K</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all">
                                            Initialize Bulk Claim
                                        </button>
                                        <button className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                            Payer EDI Settings
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none">
                                <TrendingUp size={240} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Invoices Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Financial Ledger</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Live Transaction Monitor</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 bg-white border border-slate-200 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search invoices..." className="text-xs font-bold outline-none placeholder:text-slate-300 w-40" />
                            </div>
                            <button className="p-2.5 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-xl transition-all">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>
                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-10 py-6">Invoice ID</th>
                                    <th className="px-10 py-6">Patient Entity</th>
                                    <th className="px-10 py-6">Generation Date</th>
                                    <th className="px-10 py-6">Total Amount</th>
                                    <th className="px-10 py-6">Methodology</th>
                                    <th className="px-10 py-6">Status Node</th>
                                    <th className="px-10 py-6 text-right pr-14">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentInvoices.map((inv, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <span className="text-xs font-black text-slate-900 font-mono">{inv.id}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-bold text-slate-900">{inv.patient}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{inv.date}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm font-black text-slate-900">₹{inv.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-100">
                                                {inv.method}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <InvoiceStatus status={inv.status} />
                                        </td>
                                        <td className="px-10 py-6 text-right pr-10">
                                            <button className="px-6 py-2.5 bg-slate-900 text-teal-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-slate-900/20">
                                                View Source
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function InvoiceStatus({ status }: { status: string }) {
    const styles: any = {
        paid: "bg-olive-50 text-olive-700 border-olive-100",
        pending: "bg-blue-50 text-blue-700 border-blue-100",
        overdue: "bg-red-50 text-red-700 border-red-100",
        partial: "bg-purple-50 text-purple-700 border-purple-100",
    };

    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${styles[status] || styles.pending}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'paid' ? 'bg-olive-600' : status === 'overdue' ? 'bg-red-600' : 'bg-blue-600'}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
        </div>
    );
}
