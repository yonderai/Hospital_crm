"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    Search,
    FlaskConical,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Plus,
    ChevronRight,
    Microscope,
    History,
    FileText
} from "lucide-react";

export default function AdminLaboratoryPage() {
    const [labStats, setLabStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLabStats([
                { test: "Complete Blood Count", volume: 142, tat: "45m", status: "Nominal" },
                { test: "Metabolic Panel", volume: 88, tat: "1.2h", status: "Nominal" },
                { test: "COVID-19 / Flu", volume: 65, tat: "2h", status: "Delayed" },
                { test: "Urinalysis", volume: 54, tat: "30m", status: "Nominal" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Diagnostic Lab</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">HOSPITAL DIAGNOSTICS & PATHOLOGY</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            LIS Sync
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Requisition
                        </button>
                    </div>
                </div>

                {/* Lab Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <LabKPI label="Pending Tests" value="28" icon={FlaskConical} color="text-olive-600" bg="bg-olive-50" />
                    <LabKPI label="Critical Results" value="03" icon={AlertTriangle} color="text-red-500" bg="bg-red-50" />
                    <LabKPI label="Avg. TAT" value="54m" icon={Clock} color="text-teal-600" bg="bg-teal-50" />
                    <LabKPI label="Lab Staff" value="18" icon={Activity} color="text-blue-600" bg="bg-blue-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Throughput Analytics */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Test Volume & TAT</h3>
                            <button className="text-[10px] font-black text-olive-700 uppercase tracking-widest hover:underline">View All Assays →</button>
                        </div>
                        <div className="p-8 space-y-8">
                            {loading ? (
                                [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)
                            ) : (
                                labStats.map((stat, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-olive-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-olive-600 group-hover:text-white transition-all">
                                                <Microscope size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{stat.test}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{stat.volume} Samples Processed</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-12 text-right">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Avg. TAT</p>
                                                <p className="text-sm font-black text-slate-900">{stat.tat}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${stat.status === 'Nominal' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                                    {stat.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Lab Actions & Equipment */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Activity className="text-teal-400" size={24} />
                                        <h4 className="text-lg font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Equipment Node</h4>
                                    </div>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-teal-400 animate-pulse" />
                                        <div className="w-1 h-1 rounded-full bg-teal-400 animate-pulse delay-75" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <EquipmentRow name="Roche Cobas 8000" status="Online" load="High" />
                                    <EquipmentRow name="Sysmex XN-3100" status="Online" load="Stable" />
                                    <EquipmentRow name="BD BACTEC FX" status="Maint." load="Idle" />
                                </div>

                                <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20">
                                    LIS Control Center
                                </button>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Lab Directives</h4>
                            <div className="space-y-3">
                                <LabDirective label="Quality Control Log" icon={CheckCircle2} />
                                <LabDirective label="Specimen Archive" icon={History} />
                                <LabDirective label="Ref Range Update" icon={FileText} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LabKPI({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className={`p-5 ${bg} ${color} rounded-[24px] shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
    );
}

function EquipmentRow({ name, status, load }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div>
                <p className="text-xs font-bold text-white">{name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Load Factor: {load}</p>
            </div>
            <span className={`text-[8px] font-black uppercase tracking-widest ${status === 'Online' ? 'text-teal-400' : 'text-yellow-400'}`}>{status}</span>
        </div>
    );
}

function LabDirective({ label, icon: Icon }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all group">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400 group-hover:text-olive-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{label}</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
        </button>
    );
}
