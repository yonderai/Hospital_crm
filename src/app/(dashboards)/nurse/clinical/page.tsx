"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Thermometer,
    Droplets,
    FileText,
    CheckCircle,
    Plus,
    Filter,
    Clipboard,
    Search,
    RefreshCw,
    Clock,
    Zap
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function NurseClinical() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/nurse/dashboard-data");
            const data = await res.json();

            // Map into clinical interventions
            const interventions = [
                ...(data.vitalsFlow || []).map((v: any, i: number) => ({
                    patient: v.patient,
                    action: "Stat Vitals Round",
                    priority: v.status === 'Due Now' ? 'Urgent' : 'Routine',
                    status: v.status,
                    room: `Room 40${i + 1}-A`,
                    icon: Activity
                })),
                ...(data.medicationSchedule || []).slice(0, 2).map((m: any, i: number) => ({
                    patient: m.patientName,
                    action: "Administer: " + m.medication,
                    priority: "High",
                    status: "10:30 AM",
                    room: m.room,
                    icon: Zap
                }))
            ];
            setTasks(interventions);
        } catch (error) {
            console.error("Clinical console fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Clinical Care Console</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            BEDSIDE OPERATIONS • {nurseName} • STATION 7G
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-8 py-3 bg-olive-700 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95">
                            <Plus size={16} /> New Clinical Entry
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main: Intervention Queue */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Bedside Interventions</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Active Precision Care</p>
                                </div>
                                <div className="text-[10px] font-black text-olive-600 uppercase tracking-[0.3em] bg-olive-50 px-4 py-2 rounded-xl">Status: Combat Mode</div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {loading ? (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <RefreshCw className="animate-spin text-slate-200" size={48} />
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Compiling Bedside Queue...</p>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className="p-20 text-center text-slate-400 font-bold italic">
                                        All bedside tasks finalized. Station is clear.
                                    </div>
                                ) : (
                                    tasks.map((item, idx) => (
                                        <div key={idx} className="p-10 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                            <div className="flex items-center gap-8">
                                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-sm transition-all border ${item.status === 'Due Now' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-white text-olive-600 border-slate-100'
                                                    }`}>
                                                    <item.icon size={28} />
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">{item.action}</h4>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{item.patient}</span>
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                                        <span className="text-[11px] font-black text-olive-600 uppercase tracking-widest">{item.room}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] border shadow-sm ${item.status === 'Due Now'
                                                        ? 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                                                        : 'bg-white text-slate-500 border-slate-200'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                                <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                                                    Initiate Care
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Protocols & Handoff */}
                    <div className="space-y-10">
                        <div className="bg-[#0F172A] rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-olive-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                                        <Clipboard size={24} className="text-olive-400" />
                                    </div>
                                    <h4 className="text-xl font-black italic uppercase tracking-tight">Handoff Vault</h4>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 bg-white/5 rounded-3xl border border-white/10 italic text-sm text-slate-300 leading-relaxed group-hover:bg-white/[0.08] transition-colors">
                                        "Dr. Singh requested hourly monitoring for the post-op in W2-A. Monitor BP closely. Patient is high fall risk."
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-olive-700 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-olive-800 transition-all shadow-xl shadow-olive-600/30 active:scale-95">
                                        Record Handoff
                                    </button>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-700" size={200} />
                        </div>

                        <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Execution Checklists</h4>
                            <div className="space-y-4">
                                {[
                                    { label: "Pre-Shift Vitals Round", done: true },
                                    { label: "Narcotics Reconciliation", done: false },
                                    { label: "Sterilization Audit", done: false },
                                ].map((step, i) => (
                                    <div key={i} className={`flex items-center gap-4 p-5 rounded-[24px] border transition-all ${step.done ? 'bg-olive-50/50 border-olive-100' : 'bg-slate-50 border-slate-100'
                                        }`}>
                                        <CheckCircle size={18} className={step.done ? 'text-olive-600' : 'text-slate-300'} />
                                        <span className={`text-[10px] font-black uppercase tracking-tight ${step.done ? 'text-olive-700' : 'text-slate-500'
                                            }`}>{step.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
