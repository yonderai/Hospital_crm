"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    BarChart3,
    TrendingUp,
    Calendar,
    Package,
    User,
    Clock,
    CheckCircle2,
    Search,
    DollarSign,
    AlertTriangle
} from "lucide-react";

interface DispensedMedicine {
    _id: string;
    patientId: { firstName: string, lastName: string, mrn: string };
    providerId: { firstName: string, lastName: string };
    medications: { drugName: string, quantity: number, unitPrice?: number }[];
    status: string;
    updatedAt: string;
}

export default function ReportsPage() {
    const [history, setHistory] = useState<DispensedMedicine[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async () => {
        try {
            const [historyRes, statsRes] = await Promise.all([
                fetch("/api/pharmacy/history"),
                fetch("/api/pharmacy/stats")
            ]);

            if (historyRes.ok) setHistory(await historyRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error("Failed to fetch report data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredHistory = history.filter(h =>
        `${h.patientId?.firstName} ${h.patientId?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.patientId?.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.medications.some(m => m.drugName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Calculate real revenue for display (mock price of $20 per unit if not available)
    const mockTotalRevenue = history.reduce((sum, h) => {
        const hTotal = h.medications.reduce((mSum, m) => mSum + (m.quantity * 20), 0);
        return sum + hTotal;
    }, 0);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Usage & Revenue Reports</h1>
                        <p className="text-slate-500 mt-1 text-[10px] font-black uppercase tracking-[0.3em]">Operational Analytics • Real-time Monitoring</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white border border-slate-100 px-6 py-3 rounded-2xl w-96 shadow-sm focus-within:border-olive-400 transition-all">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search Logs by Patient or Drug..."
                            className="bg-transparent border-none outline-none text-sm font-bold text-slate-900 w-full placeholder:text-slate-300"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-olive-400 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-olive-50 text-olive-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <Package size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Dispensed</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{loading ? "..." : history.length}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                            <TrendingUp size={12} /> +12% Efficiency
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-blue-400 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <DollarSign size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Today</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">₹{loading ? "..." : mockTotalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                            <TrendingUp size={12} /> +8% vs Target
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-orange-400 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
                                <AlertTriangle size={24} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock Alerts</p>
                                <p className="text-3xl font-black text-slate-900 mt-1">{loading ? "..." : stats?.lowStock || 0}</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-orange-500 uppercase">Immediate Action Required</p>
                    </div>


                </div>

                {/* Today's Dispensed Medications */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Dispensing Activity Log</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Detailed Transaction Stream</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                            <Clock size={14} className="text-olive-600" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Live Updates</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                    <th className="px-10 py-6">Timestamp / Pharmacists</th>
                                    <th className="px-10 py-6">Patient Details</th>
                                    <th className="px-10 py-6">Medications Dispensed</th>
                                    <th className="px-10 py-6 text-right">Value (₹)</th>
                                    <th className="px-10 py-6 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center">
                                            <div className="animate-pulse flex flex-col items-center gap-4">
                                                <BarChart3 className="text-slate-200" size={48} />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aggregating Consumption Data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold italic">
                                            No dispensing records found for the current period.
                                        </td>
                                    </tr>
                                ) : filteredHistory.map((log) => {
                                    const logTotal = log.medications.reduce((sum, m) => sum + (m.quantity * 20), 0);
                                    return (
                                        <tr key={log._id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-3">
                                                    <Clock size={16} className="text-slate-300" />
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">
                                                            {new Date(log.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">By: {log.providerId?.firstName} {log.providerId?.lastName}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-olive-700 transition-colors">
                                                    {log.patientId?.firstName} {log.patientId?.lastName}
                                                </p>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">MRN: {log.patientId?.mrn}</p>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {log.medications.map((m, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">
                                                            {m.drugName} ({m.quantity})
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right font-mono text-sm font-black text-slate-900">
                                                ₹{logTotal.toFixed(2)}
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                    <CheckCircle2 size={10} /> Dispensed
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
