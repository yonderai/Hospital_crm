"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Calendar,
    Clock,
    User,
    Plus,
    Filter,
    Search,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    MousePointer2,
    Timer
} from "lucide-react";

export default function ORDashboard() {
    const [allCases, setAllCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const res = await fetch("/api/doctor/surgery");
                if (res.ok) {
                    const data = await res.json();
                    setAllCases(data);
                }
            } catch (err) {
                console.error("Failed to fetch surgeries:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCases();
    }, []);

    const activeCases = allCases.filter(c => c.status === "in-progress").length;
    const today = new Date().toISOString().split('T')[0];
    const scheduledToday = allCases.filter(c =>
        new Date(c.scheduledDate).toISOString().split('T')[0] === today && c.status === 'scheduled'
    ).length;
    const occupiedSuites = new Set(allCases.filter(c => c.status === "in-progress").map(c => c.orRoomId)).size;
    const pendingAnalytics = allCases.filter(c => c.status === "scheduled").length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "in-progress": return "text-blue-600 bg-blue-50 border-blue-100";
            case "completed": return "text-emerald-600 bg-emerald-50 border-emerald-100";
            case "cancelled": return "text-rose-600 bg-rose-50 border-rose-100";
            default: return "text-orange-600 bg-orange-50 border-orange-100";
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-olive-700 font-bold uppercase tracking-widest text-[10px]">
                            <Activity size={12} />
                            Surgical Services
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">OR Management</h1>
                        <p className="text-slate-500 text-sm font-medium">Coordinate surgical suites, anesthesia teams, and patient intake.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
                            <Filter size={14} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-olive-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-olive-600/20 hover:bg-olive-700 transition-all">
                            <Plus size={14} /> New Case
                        </button>
                    </div>
                </div>

                {/* Status Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Active Cases", val: activeCases.toString(), icon: Timer, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Scheduled Today", val: scheduledToday.toString(), icon: Calendar, color: "text-olive-600", bg: "bg-olive-50" },
                        { label: "Suites Occupied", val: `${occupiedSuites}/5`, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
                        { label: "Pending Analytics", val: pendingAnalytics.toString(), icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Surgical Schedule Monitor */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-8">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                                <Clock className="text-teal-400" size={20} />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Surgery Monitor</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Live Schedule for All OR Suites</p>
                            </div>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search Cases..."
                                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-olive-500/20 outline-none w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time / Suite</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedure</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Surgeon</th>
                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {allCases.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                                                    <Calendar size={32} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-black text-slate-900 uppercase italic tracking-widest">no pending surgery</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase">All surgical suites are currently clear</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : allCases.map((cs: any) => (
                                    <tr key={cs._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-slate-900">{cs.startTime}</span>
                                                <span className="text-[10px] font-bold text-olive-600 uppercase mt-1 px-2 py-0.5 bg-olive-50 rounded w-fit">{cs.orRoomId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{cs.patientId?.firstName} {cs.patientId?.lastName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{cs.patientId?.mrn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-semibold text-slate-700">{cs.procedureName}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="text-sm font-medium text-slate-600">
                                                {cs.surgeonId ? `${cs.surgeonId.firstName} ${cs.surgeonId.lastName}` : "TBD"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(cs.status)}`}>
                                                {cs.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors group">
                                                <ChevronRight size={18} className="text-slate-300 group-hover:text-olive-600" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Perioperative Tools */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-[#0F172A] p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <MousePointer2 size={120} />
                        </div>
                        <div className="space-y-4 relative z-10">
                            <h3 className="text-2xl font-black tracking-tight underline decoration-teal-400 underline-offset-8">Instrument Tracking</h3>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                                RFID-enabled surgical instrument inventory. Ensure complete sterile packs for every procedure.
                            </p>
                            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-400 hover:text-white transition-colors">
                                Scan Tray NFC <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-olive-600 to-olive-700 p-8 rounded-[40px] text-white shadow-2xl shadow-olive-600/30">
                        <div className="flex flex-col h-full justify-between gap-8">
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">Anesthesia Protocols</h3>
                                <p className="text-olive-100/70 text-sm mt-3 font-medium leading-relaxed">
                                    Pre-operative sedation charts and real-time intraoperative monitoring sheets.
                                </p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10">
                                <p className="text-[10px] font-black text-olive-200 uppercase tracking-[0.2em] mb-3">Live Feed</p>
                                <div className="space-y-3">
                                    {[1, 2].map((n) => (
                                        <div key={n} className="flex items-center justify-between text-xs">
                                            <span className="font-bold">OR Suite {n} Pulse Ox</span>
                                            <span className="text-teal-400 font-black">98% Normal</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
