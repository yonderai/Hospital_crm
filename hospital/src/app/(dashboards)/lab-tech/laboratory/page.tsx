"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    FlaskConical,
    Microscope,
    History,
    ChevronRight,
    Play,
    Timer
} from "lucide-react";

export default function LabTechLaboratoryPage() {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQueue = async () => {
        try {
            const res = await fetch("/api/lab/orders?status=ordered"); // Fetch ordered and in-progress preferably
            // Actually let's fetch all active
            if (res.ok) {
                const data = await res.json();
                setQueue(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
    }, []);

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch(`/api/lab/orders/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status, sampleCollectedAt: status === 'collected' ? new Date() : undefined }),
                headers: { "Content-Type": "application/json" }
            });
            fetchQueue();
        } catch (e) {
            alert("Failed to update status");
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Technical Workbench</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DIAGNOSTICS α-STATION • PATHOLOGY CORE</p>
                    </div>
                    <button onClick={fetchQueue} className="text-xs font-bold text-olive-600 hover:underline">Refresh Queue</button>
                </div>

                {/* Queue Stats (Static for now) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <WorkbenchKPI label="Daily Queue" value={queue.length} icon={History} />
                    <WorkbenchKPI label="Needs Validation" value="0" icon={CheckCircle2} color="text-teal-600" />
                    <WorkbenchKPI label="Critical Alerts" value="0" icon={AlertTriangle} color="text-red-500" />
                    <WorkbenchKPI label="Avg. Pull Time" value="12m" icon={Timer} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Active Worklist */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Specimen Pipeline</h3>
                        </div>

                        <div className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-50/10 animate-pulse" />)
                            ) : queue.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-bold">No pending orders found.</div>
                            ) : (
                                queue.map((s, idx) => (
                                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300">
                                                <FlaskConical size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{s.tests?.join(", ") || "Lab Test"}</p>
                                                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span>{s.patientId?.firstName} {s.patientId?.lastName}</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span>ID: {s.orderId}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-10 items-center">
                                            <div className="text-right">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${s.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                    {s.status}
                                                </span>
                                                <p className={`text-[8px] font-black uppercase mt-1 ${s.priority === 'stat' ? 'text-red-500' : 'text-slate-400'}`}>{s.priority || 'Routine'}</p>
                                            </div>
                                            {s.status === 'ordered' && (
                                                <button
                                                    onClick={() => updateStatus(s._id, 'collected')}
                                                    className="px-4 py-2 bg-slate-900 text-teal-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all"
                                                >
                                                    Collect Sample
                                                </button>
                                            )}
                                            {s.status === 'collected' && (
                                                <button
                                                    onClick={() => updateStatus(s._id, 'in-progress')}
                                                    className="px-4 py-2 bg-olive-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-800 transition-all"
                                                >
                                                    Process
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Analyzer Status Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                            <div className="relative z-10 space-y-8">
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Analyzer Feed</h4>
                                <div className="space-y-6">
                                    <AnalyzerRow name="Roche Cobas 8000" status="Running" load="85%" />
                                    <AnalyzerRow name="Sysmex XN-3100" status="Running" load="42%" />
                                    <AnalyzerRow name="Beckman DXI" status="Idle" load="0%" />
                                </div>
                                <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all">
                                    Calibrate Instruments
                                </button>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function WorkbenchKPI({ label, value, icon: Icon, color = "text-slate-400" }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <Icon size={20} className={color} />
        </div>
    );
}

function AnalyzerRow({ name, status, load }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
            <div>
                <p className="text-xs font-bold text-white">{name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'Running' ? 'bg-teal-400 animate-pulse' : 'bg-slate-700'}`} />
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{status} ({load})</span>
                </div>
            </div>
            <Microscope size={14} className="text-slate-500" />
        </div>
    );
}
