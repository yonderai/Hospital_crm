"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    Zap, // For utilities
    TrendingUp,
    ShieldCheck,
    Plus,
    Activity,
    ArrowUpRight,
    Search,
    Filter,
    FileText
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
import { useEffect, useState } from "react";
import Link from "next/link";

interface FinanceStats {
    currentMonth: {
        totalCost: number;
        expenses: number;
        utilities: number;
    };
    pendingActions: {
        utilities: number;
        expenses: number;
    };
    assetCount: number;
}

export default function FinanceDashboard() {
    const [data, setData] = useState<FinanceStats | null>(null);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        category: "other",
        description: "",
        amount: 0,
        expenseDate: new Date().toISOString().split('T')[0],
        status: "pending"
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch("/api/finance/overview");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (error) {
            console.error("Failed to fetch finance stats", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/finance/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({ category: "other", description: "", amount: 0, expenseDate: new Date().toISOString().split('T')[0], status: "pending" });
                fetchData(); // Refresh stats
            }
        } catch (error) {
            console.error(error);
        }
    };

    const trajectoryData = [
        { name: "Week 1", revenue: 4500 },
        { name: "Week 2", revenue: 5200 },
        { name: "Week 3", revenue: 4800 },
        { name: "Week 4", revenue: 6100 },
        { name: "Week 5", revenue: 7500 },
        { name: "Week 6", revenue: 5800 },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex h-full items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    const stats = [
        {
            title: "Total Ops Cost (Month)",
            value: data ? `₹${data.currentMonth.totalCost.toLocaleString()}` : "₹0",
            change: "+2.5%",
            icon: DollarSign,
            color: "text-olive-700",
            bg: "bg-olive-50"
        },
        {
            title: "Utility Bills (Pending)",
            value: data ? data.pendingActions.utilities.toString() : "0",
            change: "Action Req",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Pending Expenses",
            value: data ? data.pendingActions.expenses.toString() : "0",
            change: "Needs Approval",
            icon: FileText,
            color: "text-red-500",
            bg: "bg-red-50"
        },
        {
            title: "Total Assets",
            value: data ? data.assetCount.toString() : "0",
            change: "Active",
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50"
        },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10 relative">
                {/* Modal Overlay */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-8 w-[500px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">New Expense</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.category}
                                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                    >
                                        {["rent", "internet", "housekeeping", "security", "waste-disposal", "laundry", "cafeteria", "other"].map(opt => (
                                            <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        placeholder="E.g. Monthly Internet Bill"
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.amount}
                                            onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.expenseDate}
                                            onChange={(e) => setNewItem({ ...newItem, expenseDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-4 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                                    >
                                        Create Expense
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Finance Protocol</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Back Office & Operations</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                        >
                            <Plus size={16} /> Record Expense
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
                                    <span className={`text-[8px] font-bold ${s.change === 'Action Req' || s.change === 'Needs Approval' ? 'text-red-500' : 'text-olive-600'}`}>{s.change}</span>
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
                    {/* Simplified Chart for now */}
                    <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col h-[450px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic">Expense Trajectory</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Weekly Performance Analysis</p>
                            </div>
                        </div>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trajectoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} />
                                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tick={{ fontWeight: 800 }} tickFormatter={(v) => `₹${v}`} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                                        {trajectoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 4 ? '#6B8E23' : '#A3B18A'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
