"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    Package,
    Truck,
    AlertCircle,
    Pill,
    ShoppingCart,
    Clock,
    Search,
    Filter,
    Plus,
    Activity,
    CheckCircle2,
    ArrowUpRight,
    ArrowDownRight,
    ClipboardList
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

const stockData = [
    { name: "Antibiotics", value: 450, color: "#6B8E23" },
    { name: "Painkillers", value: 300, color: "#0F172A" },
    { name: "Vaccines", value: 120, color: "#14B8A6" },
    { name: "Surgicals", value: 200, color: "#6366F1" },
];

const pendingDispenses = [
    { id: "RX-9923", patient: "Alice Cooper", med: "Insulin Glargine", dose: "10 units", priority: "high", time: "10 mins ago" },
    { id: "RX-9924", patient: "Johnathan Doe", med: "Heparin", dose: "5000 units", priority: "high", time: "15 mins ago" },
    { id: "RX-9925", patient: "Sarah Miller", med: "Amoxicillin", dose: "250mg", priority: "routine", time: "30 mins ago" },
    { id: "RX-9926", patient: "Marcus Thorne", med: "Metformin", dose: "500mg", priority: "routine", time: "45 mins ago" },
];

export default function PharmacyDashboard() {
    const stats = [
        { title: "Inventory Value", value: "₹84,200", change: "+4.2%", trendingUp: true, icon: Beaker, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Low Stock Items", value: "14", change: "+2", trendingUp: true, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        { title: "Pending Rx", value: "28", change: "-5", trendingUp: false, icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Active Suppliers", value: "12", change: "0", trendingUp: true, icon: Truck, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Pharmacy Ops</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">Inventory & Clinical Fulfillment</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Supplier Portal
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Stock Order
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm transition-all hover:border-olive-400">
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
                    {/* Dispensing Queue */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Dispense Priority Node</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Pending Clinical Fulfilment</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="text-[10px] font-black bg-red-50 text-red-600 px-3 py-1 rounded-full uppercase tracking-widest border border-red-100 animate-pulse">4 Critical</span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-10 py-6">Patient Entity</th>
                                        <th className="px-10 py-6">Medication / Dose</th>
                                        <th className="px-10 py-6">Priority</th>
                                        <th className="px-10 py-6">Queued Time</th>
                                        <th className="px-10 py-6 text-right pr-14">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {pendingDispenses.map((rx, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-6">
                                                <p className="text-sm font-bold text-slate-900">{rx.patient}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{rx.id}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-sm font-black text-olive-700">{rx.med}</span>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{rx.dose}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${rx.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'}`}>
                                                    {rx.priority}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6">
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{rx.time}</span>
                                            </td>
                                            <td className="px-10 py-6 text-right pr-10">
                                                <button className="px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-800 transition-all opacity-0 group-hover:opacity-100 shadow-lg shadow-olive-600/20">
                                                    Dispense Now
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inventory Allocation Chart */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm h-full flex flex-col min-h-[450px]">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">Stock Allocation</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10">Category Distribution</p>

                            <div className="flex-1 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height={240}>
                                    <PieChart>
                                        <Pie
                                            data={stockData}
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {stockData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute flex flex-col items-center">
                                    <p className="text-2xl font-black text-slate-900">1,070</p>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Total SKU</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {stockData.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Replenishment Queue */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-[#0F172A] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <Truck className="text-teal-400" size={24} />
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase">Supplier Conduit</h4>
                            </div>

                            <div className="space-y-6">
                                <h5 className="text-[10px] text-teal-400 font-bold uppercase tracking-[0.2em] opacity-80 border-l-2 border-teal-500 pl-4">Inbound Shipments</h5>
                                <div className="space-y-4">
                                    <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">Global Pharma Logistics</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Order #PO-8829 • 24 Items</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black bg-teal-500/20 text-teal-400 px-3 py-1 rounded-full uppercase tracking-widest border border-teal-500/30">In Transit</span>
                                            <p className="text-[9px] text-slate-500 font-bold mt-1">ETA: 2h 45m</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 p-5 rounded-3xl border border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-white">MedSupply Corp</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Order #PO-8830 • 12 Items</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/30">Scheduled</span>
                                            <p className="text-[9px] text-slate-500 font-bold mt-1">For Tomorrow</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute right-[-10%] bottom-[-10%] text-white/5 pointer-events-none">
                            <Package size={240} />
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-8">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="text-red-500" size={24} />
                            <h4 className="text-xl font-black tracking-tight leading-none uppercase text-slate-900">Critical Stock Alerts</h4>
                        </div>
                        <div className="space-y-4">
                            <StockAlert item="Epinephrine Auto-Injector" current="02 units" reorder="20 units" severity="critical" />
                            <StockAlert item="Normal Saline 1L" current="08 bags" reorder="100 bags" severity="critical" />
                            <StockAlert item="Surgical Masks (S)" current="15 boxes" reorder="50 boxes" severity="warning" />
                        </div>
                        <button className="w-full py-4 bg-slate-900 text-teal-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                            Auto-Generate Replenishment Orders
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StockAlert({ item, current, reorder, severity }: { item: string, current: string, reorder: string, severity: 'critical' | 'warning' }) {
    return (
        <div className={`p-5 rounded-3xl border flex items-center justify-between transition-all hover:shadow-md ${severity === 'critical' ? 'bg-red-50/30 border-red-100' : 'bg-yellow-50/30 border-yellow-100'}`}>
            <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-white border flex items-center justify-center ${severity === 'critical' ? 'border-red-100 text-red-500' : 'border-yellow-100 text-yellow-500'}`}>
                    <Package size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{item}</p>
                    <div className="flex gap-3 items-center mt-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current: <span className={severity === 'critical' ? 'text-red-600' : 'text-slate-900'}>{current}</span></span>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref Level: {reorder}</span>
                    </div>
                </div>
            </div>
            <button className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${severity === 'critical' ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                Reorder
            </button>
        </div>
    );
}

const FileText = ({ size, className }: { size: number, className?: string }) => (
    <ClipboardList size={size} className={className} />
);
