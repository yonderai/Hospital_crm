"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    BarChart3,
    TrendingUp,
    ArrowDownLeft,
    ArrowUpRight,
    Clock,
    Filter,
    FileText,
    Calendar,
    ArrowRight
} from "lucide-react";

interface LedgerEntry {
    _id: string;
    itemId: {
        name: string;
        sku: string;
        unit: string;
    };
    type: "in" | "out" | "adjustment" | "transfer";
    quantity: number;
    reason: string;
    previousStock: number;
    newStock: number;
    recordedBy: {
        firstName: string;
        lastName: string;
    };
    createdAt: string;
}

export default function ReportsPage() {
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalIn: 0,
        totalOut: 0,
        adjustments: 0
    });

    useEffect(() => {
        fetch("/api/pharmacy/inventory/ledger?limit=100")
            .then(res => res.json())
            .then(data => {
                const entries = Array.isArray(data) ? data : [];
                setLedger(entries);

                // Calculate basic stats for display
                const counts = entries.reduce((acc, curr) => {
                    if (curr.type === 'in') acc.totalIn += Math.abs(curr.quantity);
                    if (curr.type === 'out') acc.totalOut += Math.abs(curr.quantity);
                    if (curr.type === 'adjustment') acc.adjustments += 1;
                    return acc;
                }, { totalIn: 0, totalOut: 0, adjustments: 0 });

                setStats(counts);
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="text-olive-600" />
                        Inventory & Usage Reports
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Detailed tracking of stock movement and pharmacy performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                        <Calendar size={14} /> Last 30 Days
                    </button>
                    <button className="px-5 py-2.5 bg-olive-600 text-white rounded-xl text-xs font-bold hover:bg-olive-700 transition-all flex items-center gap-2 shadow-lg shadow-olive-600/20">
                        <FileText size={14} /> Export Report
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-olive-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex flex-col relative z-10">
                        <div className="w-12 h-12 bg-olive-100 rounded-2xl flex items-center justify-center text-olive-600 mb-6">
                            <ArrowUpRight size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Stock Added</p>
                        <h3 className="text-4xl font-black text-slate-900">{stats.totalIn}</h3>
                        <p className="text-[10px] font-bold text-olive-500 mt-2 flex items-center gap-1 font-mono">
                            <TrendingUp size={12} /> +12.5% from last period
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex flex-col relative z-10">
                        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                            <ArrowDownLeft size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Total Dispensed</p>
                        <h3 className="text-4xl font-black text-slate-900">{stats.totalOut}</h3>
                        <p className="text-[10px] font-bold text-orange-500 mt-2 flex items-center gap-1 font-mono">
                            <TrendingUp size={12} /> +8.3% from last period
                        </p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <div className="flex flex-col relative z-10">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 mb-6">
                            <Filter size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Stock Adjustments</p>
                        <h3 className="text-4xl font-black text-slate-900">{stats.adjustments}</h3>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">Manual Audit Logs</p>
                    </div>
                </div>
            </div>

            {/* Stock Movement Ledger Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Stock Movement (Audit Trail)</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Synchronized with Pharmacy Node</p>
                    </div>
                    <button className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400">
                        <Clock size={18} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                                <th className="p-6">Time / Date</th>
                                <th className="p-6">Medicine Detail</th>
                                <th className="p-6">Type</th>
                                <th className="p-6 text-center">Change</th>
                                <th className="p-6">Reason / Source</th>
                                <th className="p-6">Recorded By</th>
                                <th className="p-6 text-right">Running Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr><td colSpan={7} className="p-10 text-center text-slate-300 font-bold uppercase tracking-widest">Hydrating Ledger Matrix...</td></tr>
                            ) : ledger.map(entry => (
                                <tr key={entry._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="p-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-900">
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                                {new Date(entry.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                {entry.itemId?.sku?.slice(0, 3)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{entry.itemId?.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono italic underline">{entry.itemId?.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${entry.type === 'in' ? 'bg-green-50 text-green-600 border-green-100' :
                                                entry.type === 'out' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {entry.type}
                                        </span>
                                    </td>
                                    <td className="p-6 text-center">
                                        <p className={`text-sm font-black ${entry.quantity > 0 ? 'text-green-600' : 'text-orange-600'}`}>
                                            {entry.quantity > 0 ? '+' : ''}{entry.quantity}
                                        </p>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-xs font-bold text-slate-600">{entry.reason}</p>
                                    </td>
                                    <td className="p-6">
                                        <p className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1 group-hover:text-olive-600 transition-colors">
                                            {entry.recordedBy?.firstName} {entry.recordedBy?.lastName}
                                            <ArrowRight size={10} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                        </p>
                                    </td>
                                    <td className="p-6 text-right font-mono">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-slate-900">{entry.newStock}</span>
                                            <span className="text-[9px] text-slate-300 line-through decoration-slate-200 decoration-1">{entry.previousStock}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
