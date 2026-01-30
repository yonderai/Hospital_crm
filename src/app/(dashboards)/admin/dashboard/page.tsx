"use client";
import { useState, useEffect } from "react";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    TrendingUp,
    DollarSign,
    AlertCircle,
    Settings,
    Plus,
    BarChart3,
    PieChart as PieChartIcon,
    ArrowUpRight
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

const revenueData = [
    { name: "Jan", revenue: 4200, expenses: 2400 },
    { name: "Feb", revenue: 4800, expenses: 2800 },
    { name: "Mar", revenue: 6200, expenses: 3200 },
    { name: "Apr", revenue: 5800, expenses: 3000 },
    { name: "May", revenue: 7500, expenses: 3800 },
    { name: "Jun", revenue: 8200, expenses: 4200 },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState([
        { title: "Monthly Revenue", value: "---", icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
        { title: "Total Staff", value: "---", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Dept. Occupancy", value: "---", icon: TrendingUp, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Approvals", value: "---", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    ]);

    useEffect(() => {
        fetch('/api/admin/dashboard')
            .then(res => res.json())
            .then(data => {
                if (data.stats) {
                    // Map string icons back to components if needed, or just keep structure if API returns matching keys
                    // The API returns "icon": "Users", we need to map it.
                    const iconMap: any = { Users, TrendingUp, DollarSign, AlertCircle };
                    const mappedStats = data.stats.map((s: any) => ({
                        ...s,
                        icon: iconMap[s.icon] || Users
                    }));
                    setStats(mappedStats);
                }
            })
            .catch(err => console.error("Failed to fetch dashboard stats", err));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Ops Console</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">ADMINISTRATOR • MEDICORE GLOBAL HUB</p>
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
                    {/* Revenue Chart */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Analytics (Fiscal Year)</h3>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-black text-olive-600 bg-olive-50 px-3 py-1 rounded-full uppercase tracking-widest border border-olive-100">Live Forecast</span>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6B8E23" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#6B8E23" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
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
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#6B8E23" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Department Status */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Dept Status (Real-time)</h4>
                            <div className="space-y-6">
                                <DeptScore name="Emergency Room" score={94} color="bg-red-500" />
                                <DeptScore name="Oncology Unit" score={82} color="bg-olive-600" />
                                <DeptScore name="Radiology" score={67} color="bg-purple-500" />
                                <DeptScore name="Outpatient Clinic" score={45} color="bg-blue-500" />
                            </div>
                        </div>

                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-3">
                                    <Settings className="text-teal-400" size={20} />
                                    <h4 className="text-lg font-black tracking-tight leading-none italic uppercase">Sentinel Guard</h4>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-70">Security Protocol Alpha</p>
                                <div className="space-y-3">
                                    <p className="text-sm font-bold">Network Nodes Secure</p>
                                    <div className="flex gap-2">
                                        {/* Fixed heights for hydration stability */}
                                        {[40, 70, 30, 85, 55, 90, 25, 60, 45, 80, 50, 75].map((h, i) => (
                                            <div key={i} className="w-1.5 h-6 bg-teal-500/20 rounded-full flex items-end">
                                                <div className="w-full bg-teal-400 rounded-full" style={{ height: `${h}%` }}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function DeptScore({ name, score, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-700">{name}</p>
                <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">{score}%</p>
            </div>
            <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}
