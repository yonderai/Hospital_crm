"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, Ambulance, Bed, Clock, AlertCircle, Plus } from "lucide-react";

export default function EmergencyDashboard() {
    const [stats, setStats] = useState({
        activeCases: 0,
        waitingTriage: 0,
        criticalP1: 0,
        ambulances: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/emergency/stats");
                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to load ER stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Poll every 30 seconds for real-time feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const kpiCards = [
        { label: "Active ER Cases", value: stats.activeCases, icon: <Activity />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { label: "Waiting Triage", value: stats.waitingTriage, icon: <Clock />, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
        { label: "Critical (P1)", value: stats.criticalP1, icon: <AlertCircle />, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
        { label: "Incoming Ambulances", value: stats.ambulances.length, icon: <Ambulance />, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Emergency Command Center</h2>
                    <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Real-time Status & Operations</p>
                </div>
                <Link href="/emergency/registration" className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:bg-red-700 transition-all hover:scale-105 active:scale-95">
                    <Plus size={16} /> Register Patient
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {kpiCards.map((kpi, index) => (
                    <div key={index} className={`p-6 rounded-[24px] border ${kpi.border} ${kpi.bg} backdrop-blur-sm`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${kpi.color}`}>
                                {kpi.icon}
                            </div>
                            <span className={`text-4xl font-black italic tracking-tighter ${kpi.color}`}>{loading ? "-" : kpi.value}</span>
                        </div>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-slate-950 border border-slate-800 rounded-[32px] overflow-hidden">
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h3 className="text-lg font-black text-white uppercase tracking-wider">Active Priority Cases</h3>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-500 uppercase">Live Feed</span>
                        </div>
                    </div>
                    <div className="p-6">
                        {/* Placeholder for Active Cases Table */}
                        <div className="h-64 flex items-center justify-center text-slate-600 font-bold text-sm border-2 border-dashed border-slate-800 rounded-2xl">
                            No critical cases currently being tracked.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-6">
                        <h3 className="text-lg font-black text-white uppercase tracking-wider mb-4">Ambulance Status</h3>
                        {loading ? (
                            <p className="text-slate-500 text-sm">Loading fleet status...</p>
                        ) : stats.ambulances.length === 0 ? (
                            <p className="text-slate-500 text-sm font-bold">No ambulances in transit.</p>
                        ) : (
                            <div className="space-y-4">
                                {stats.ambulances.map((amb: any) => (
                                    <div key={amb._id} className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
                                        <div>
                                            <p className="text-white font-bold text-sm">{amb.plateNumber}</p>
                                            <p className="text-emerald-500 text-xs font-bold uppercase tracking-wider">ETA: {amb.eta || "Unknown"}</p>
                                        </div>
                                        <Ambulance size={20} className="text-slate-500" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[32px] p-6 text-white shadow-2xl shadow-red-900/50">
                        <h3 className="text-lg font-black uppercase tracking-wider mb-2">Code Blue</h3>
                        <p className="text-sm opacity-90 mb-6 font-medium">Trigger immediate resuscitation team response for cardiac arrest.</p>
                        <button className="w-full py-4 bg-white text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-50 transition-all">
                            Broadcast Alert
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
