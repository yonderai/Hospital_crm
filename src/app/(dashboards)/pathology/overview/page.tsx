"use client";

import { useEffect, useState } from "react";
import {
    Activity,
    TestTube2,
    Microscope,
    FileCheck,
    ArrowUpRight,
    Search
} from "lucide-react";

export default function PathologyOverview() {
    const [stats, setStats] = useState({
        pendingTests: 0,
        samplesCollectedToday: 0,
        testsProcessing: 0,
        reportsCompleted: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/pathology/stats");
                const data = await res.json();
                if (res.ok) setStats(data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: "Pending Tests", value: stats.pendingTests, icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Samples Collected", value: stats.samplesCollectedToday, icon: TestTube2, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "In Processing", value: stats.testsProcessing, icon: Microscope, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Reports Done", value: stats.reportsCompleted, icon: FileCheck, color: "text-emerald-500", bg: "bg-emerald-500/10" }
    ];

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pathology Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Real-time lab operations overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-olive-200 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                                <stat.icon size={24} className={stat.color} />
                            </div>
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                                <ArrowUpRight size={12} /> Live
                            </span>
                        </div>
                        <div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Section (Placeholder for now, or could fetch recent logs) */}
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Recent Lab Activity</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Latest updates from the floor</p>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-600 uppercase tracking-wider hover:bg-slate-100 transition-colors">
                        View All Log
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="p-12 text-center text-slate-400 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        Activity log stream requires socket integration.
                    </div>
                </div>
            </div>
        </div>
    );
}
