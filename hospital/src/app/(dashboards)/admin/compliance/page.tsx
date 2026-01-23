"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ShieldCheck,
    AlertTriangle,
    Microscope,
    FileWarning,
    CheckCircle2,
    ArrowRight,
    Search,
    Filter,
    Activity,
    Lock
} from "lucide-react";

export default function ComplianceDashboard() {
    const [incidents, setIncidents] = useState([
        {
            _id: "INC-901",
            type: "medication-error",
            severity: "moderate",
            status: "under-investigation",
            date: "2026-01-20",
            title: "Near miss: Wrong dosage of Heparin in Ward 4",
            reporter: "Nurse Sarah Jenkins"
        },
        {
            _id: "INC-902",
            type: "fall",
            severity: "minor",
            status: "resolved",
            date: "2026-01-19",
            title: "Patient slipped while visiting restroom",
            reporter: "Staff Michael Ross"
        }
    ]);

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen font-sans">
                {/* Global Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-rose-700 font-bold uppercase tracking-widest text-[10px]">
                            <ShieldCheck size={12} />
                            Quality, Audit & Compliance
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Compliance Center</h1>
                        <p className="text-slate-500 text-sm font-medium">Surveillance, Incident Reporting, and HIPAA Sentinel nodes.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all">
                            <FileWarning size={14} /> Report Incident
                        </button>
                    </div>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        {/* Incident Queue */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center">
                                        <AlertTriangle className="text-rose-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Safety Incidents</h3>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-50 rounded-full italic">2 Action Required</span>
                            </div>
                            <div className="p-4 space-y-4">
                                {incidents.map((inc) => (
                                    <div key={inc._id} className="p-6 bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 rounded-[32px] transition-all flex items-center justify-between group">
                                        <div className="flex items-start gap-5">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">{inc.type}</span>
                                                    <span className="text-slate-300 mx-1">/</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inc._id}</span>
                                                </div>
                                                <p className="text-sm font-black text-slate-900 mb-1">{inc.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase">Reported by {inc.reporter} on {inc.date}</p>
                                            </div>
                                        </div>
                                        <button className="opacity-0 group-hover:opacity-100 p-3 bg-white shadow-md rounded-xl text-slate-400 hover:text-olive-600 transition-all">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Infection Control Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-[#0F172A] p-8 rounded-[40px] text-white space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Microscope size={120} />
                                </div>
                                <h3 className="text-xl font-black tracking-tight underline decoration-teal-400 underline-offset-8">Infection Control</h3>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-xs">
                                    Real-time surveillance for MRSA, C.Diff, and other hospital-acquired infections.
                                </p>
                                <div className="flex items-center gap-6 pt-4">
                                    <div>
                                        <p className="text-2xl font-black text-white">4</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Isolations</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-teal-400">0</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Outbreaks</p>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-teal-400 hover:text-white transition-colors">View Surveillance Map <ArrowRight size={14} className="inline ml-1" /></button>
                            </div>

                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-olive-50 text-olive-600 rounded-xl flex items-center justify-center">
                                        <Activity size={20} />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest">Quality Metrics</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: "Mediation Compliance", val: "99.2%" },
                                        { label: "Hand Hygiene Audits", val: "94.5%" },
                                        { label: "Patient Satisfaction", val: "4.8/5" },
                                    ].map((m, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs">
                                            <span className="font-bold text-slate-500">{m.label}</span>
                                            <span className="font-black text-slate-900">{m.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar components */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] text-white shadow-xl shadow-slate-900/20">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gradient-to-tr from-teal-500 to-cyan-400 rounded-2xl flex items-center justify-center">
                                    <Lock size={24} className="text-white" />
                                </div>
                                <h3 className="text-lg font-black tracking-tight">Sentinel Audit</h3>
                            </div>
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
                                HIPAA-compliant logging of all clinical data interactions.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { msg: "Dr. Smith accessed MRN-001", time: "2 min ago" },
                                    { msg: "ER Discharge authorized", time: "15 min ago" },
                                    { msg: "Lab results modified (Audit ID: 88)", time: "1 hour ago" },
                                ].map((log, i) => (
                                    <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-start justify-between">
                                        <span className="text-[10px] font-medium text-slate-300">{log.msg}</span>
                                        <span className="text-[10px] font-bold text-slate-600 uppercase shrink-0">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">Download Full Audit Log</button>
                        </div>

                        <div className="p-8 bg-zinc-900 rounded-[40px] text-white relative flex flex-col items-center text-center gap-4">
                            <CheckCircle2 size={48} className="text-teal-400 mb-2" />
                            <h4 className="text-sm font-black uppercase tracking-widest">System Attestation</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Validated Jan 22, 2026</p>
                            <div className="flex flex-wrap gap-2 justify-center mt-4">
                                {['HIPAA', 'GDPR', 'ISO27001', 'SOC2'].map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-teal-400">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
