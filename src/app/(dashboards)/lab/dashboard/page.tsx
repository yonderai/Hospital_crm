"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    FlaskConical,
    Activity,
    AlertCircle,
    Plus,
    Clock,
    Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function LabTechDashboard() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        try {
            const res = await fetch("/api/lab/dashboard-data");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const techName = session?.user?.name || "LAB TECH";

    const stats = [
        { title: "Pending Specimens", value: data?.stats?.pending || "0", icon: FlaskConical, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "In-Processing", value: data?.stats?.inProcessing || "0", icon: Activity, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Results Verification", value: data?.stats?.resultsVerification || "0", icon: Database, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Critical Findings", value: data?.stats?.criticalFindings || "0", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    ];

    const labQueue = data?.queue || [];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Diagnostic Laboratory</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">TECH. {techName} • LAB NODE 42</p>
                    </div>

                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <s.icon size={100} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-4xl font-black text-slate-900 tracking-tighter">{loading ? "..." : s.value}</p>
                            </div>
                            <div className={`p-5 ${s.bg} ${s.color} rounded-2xl relative z-10 group-hover:scale-110 transition-transform`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Expanded Specimen Queue */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Specimen Queue</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Live Clinical Stream • Real-time Monitoring</p>
                        </div>
                        <Link href="/lab/pending-orders" className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em] hover:underline">View All Archive →</Link>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                    <th className="px-10 py-6">Specimen / Patient</th>
                                    <th className="px-10 py-6">Test Profile</th>
                                    <th className="px-10 py-6">Priority</th>
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center">
                                            <div className="animate-pulse flex flex-col items-center gap-4">
                                                <Beaker className="text-slate-200" size={48} />
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Synchronizing Clinical Data...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : labQueue.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-20 text-center">
                                            <p className="text-slate-400 font-bold italic tracking-tighter">No active specimens in the queue.</p>
                                        </td>
                                    </tr>
                                ) : labQueue.map((q: any, idx: number) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-olive-700 transition-colors">{q.patient}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock size={10} className="text-slate-300" />
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{q.arrival}</p>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{q.test}</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-sm ${q.priority === 'Stat' ? 'bg-red-500 text-white shadow-red-200' :
                                                q.priority === 'Urgent' ? 'bg-orange-400 text-white shadow-orange-200' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {q.priority}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${q.status === 'Processing' ? 'bg-olive-500' : 'bg-slate-300'}`} />
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{q.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <Link href="/lab/pending-orders">
                                                <button className="px-6 py-2.5 bg-slate-900 text-teal-300 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-olive-700 hover:text-white transition-all transform hover:scale-110">
                                                    Process
                                                </button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
