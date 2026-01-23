"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    FileText,
    TrendingUp,
    ShieldCheck,
    Plus,
    Activity,
    ArrowUpRight,
    Search,
    Filter
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";

const trajectoryData = [
    { name: "Week 1", revenue: 4500 },
    { name: "Week 2", revenue: 5200 },
    { name: "Week 3", revenue: 4800 },
    { name: "Week 4", revenue: 6100 },
    { name: "Week 5", revenue: 7500 },
    { name: "Week 6", revenue: 5800 },
];

export default function FinanceDashboard() {
    const stats = [
        { title: "Total Revenue", value: "$124,500", change: "+12.5%", icon: DollarSign, color: "text-olive-700", bg: "bg-olive-50" },
        { title: "Pending Claims", value: "42", change: "-3", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
        { title: "Unpaid Invoices", value: "$18,200", change: "+5.2%", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
        { title: "Collection Rate", value: "94%", change: "+1.2%", icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Finance Protocol</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Billing & Revenue Cycle Management</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Generate Report
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Create Invoice
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all cursor-default relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.title}</p>
                                    <span className={`text-[8px] font-bold ${s.change.startsWith('+') ? 'text-olive-600' : 'text-red-500'}`}>{s.change}</span>
                                    <ArrowUpRight size={10} className={s.change.startsWith('+') ? 'text-olive-600' : 'text-red-500'} />
                                </div>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl relative z-10`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Revenue Trajectory Chart */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Revenue Trajectory</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Performance Analysis</p>
                            </div>
                            <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                                <button className="px-4 py-1 text-[10px] font-black bg-white shadow-sm rounded-lg text-slate-900 uppercase tracking-widest">Week</button>
                                <button className="px-4 py-1 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Month</button>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trajectoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
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
                                        tickFormatter={(v) => `$${v}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                                        {trajectoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 4 ? '#6B8E23' : '#A3B18A'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Payment Hub Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl flex flex-col justify-between h-full min-h-[450px]">
                            <div className="relative z-10 space-y-8 flex-1">
                                <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                                    <Activity className="text-teal-400" size={24} />
                                    <h4 className="text-xl font-black tracking-tight leading-none uppercase italic">Payment Hub</h4>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-4 bg-teal-400 rounded-full" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Summary</p>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Cleared</p>
                                            <p className="text-3xl font-black">$45.2K</p>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Processing</p>
                                            <p className="text-3xl font-black">$8.9K</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative z-10 pt-8 mt-auto">
                                <button className="w-full py-5 bg-teal-500 text-slate-900 rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-all border-none">
                                    Settle Batch
                                </button>
                            </div>

                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={300} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
