
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Activity, Users, Ambulance, Bed, Clock, AlertCircle, Plus, Siren } from "lucide-react";

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
        { label: "Active ER Cases", value: stats.activeCases, icon: <Activity />, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Waiting Triage", value: stats.waitingTriage, icon: <Clock />, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
        { label: "Critical (P1)", value: stats.criticalP1, icon: <AlertCircle />, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
        { label: "Incoming Ambulances", value: stats.ambulances.length, icon: <Ambulance />, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Emergency Command Center</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Real-time Status & Operations</p>
                </div>
                <Link href="/emergency/registration" className="flex items-center gap-2 px-6 py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-105 active:scale-95">
                    <Plus size={16} /> Register Patient
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {kpiCards.map((kpi, index) => (
                    <div key={index} className={`p-6 rounded-[24px] border ${kpi.border} ${kpi.bg} shadow-sm`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-white border border-[rgba(0,0,0,0.05)] ${kpi.color} shadow-sm`}>
                                {kpi.icon}
                            </div>
                            <span className={`text-4xl font-black tracking-tighter ${kpi.color}`}>{loading ? "-" : kpi.value}</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Priority Cases</h3>
                        <div className="flex items-center gap-2 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Live Feed</span>
                        </div>
                    </div>
                    <div className="p-8">
                        {/* Placeholder for Active Cases View */}
                        <div className="h-64 flex items-center justify-center text-slate-400 font-bold text-sm border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                            No critical priority cases currently being tracked.
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Ambulance Feed</h3>
                        {loading ? (
                            <p className="text-slate-400 text-sm italic">Loading fleet status...</p>
                        ) : stats.ambulances.length === 0 ? (
                            <div className="p-6 bg-slate-50 rounded-2xl text-center">
                                <Ambulance className="mx-auto text-slate-300 mb-2" size={24} />
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">No inbound traffic</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.ambulances.map((amb: any) => (
                                    <div key={amb._id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                <Siren size={16} />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-bold text-sm">{amb.plateNumber}</p>
                                                <p className="text-xs text-slate-400 font-medium">Driver: {amb.driverName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-emerald-600 text-xs font-black uppercase tracking-wider">{amb.eta || "Unknown"}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">ETA</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-red-100 rounded-[32px] p-8 shadow-xl shadow-red-600/5 relative overflow-hidden group hover:border-red-200 transition-all cursor-pointer">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black uppercase tracking-wider mb-2 text-red-600">Code Blue</h3>
                            <p className="text-sm text-slate-500 mb-6 font-medium">Trigger immediate resuscitation team response for cardiac arrest.</p>
                            <button className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">
                                Broadcast Alert
                            </button>
                        </div>
                        <Siren className="absolute -bottom-4 -right-4 text-red-50 rotate-12 group-hover:rotate-0 transition-transform" size={140} />
                    </div>
                </div>
            </div>
        </div>
    );
}
