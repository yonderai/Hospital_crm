"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    FlaskConical,
    Users,
    FileText,
    Search,
    Plus,
    MoreVertical,
    CheckCircle2,
    Calendar,
    ChevronRight,
    PieChart
} from "lucide-react";

export default function ResearchDashboard() {
    const [studies, setStudies] = useState([
        {
            _id: "S-001",
            title: "Efficacy of Novel GLP-1 Agonist in Type 2 Diabetes",
            pi: "Dr. Elena Vance",
            phase: "III",
            status: "recruiting",
            subjects: 145,
            target: 200,
            completion: 72
        },
        {
            _id: "S-002",
            title: "Long-term Outcomes of Robotic Mitral Valve Repair",
            pi: "Dr. Marcus Thorne",
            phase: "N/A",
            status: "active",
            subjects: 88,
            target: 100,
            completion: 88
        },
        {
            _id: "S-003",
            title: "Early Detection of Sepsis using Ambient Bio-sensors",
            pi: "Dr. Sarah Chen",
            phase: "II",
            status: "recruiting",
            subjects: 42,
            target: 150,
            completion: 28
        }
    ]);

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-purple-700 font-bold uppercase tracking-widest text-[10px]">
                            <FlaskConical size={12} />
                            Clinical Research & Trials
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Research Hub</h1>
                        <p className="text-slate-500 text-sm font-medium">Manage clinical studies, patient enrollment, and IRB compliance.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 hover:bg-purple-700 transition-all">
                            <Plus size={14} /> New Study
                        </button>
                    </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Studies</p>
                        <div className="flex items-end gap-3">
                            <p className="text-4xl font-black text-slate-900">12</p>
                            <span className="text-emerald-500 text-xs font-bold mb-1">+2 this month</span>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Subject Enrollment</p>
                        <div className="flex items-end gap-3">
                            <p className="text-4xl font-black text-slate-900">1,248</p>
                            <span className="text-slate-400 text-xs font-bold mb-1">Across 4 wings</span>
                        </div>
                    </div>
                    <div className="bg-[#0F172A] p-8 rounded-[40px] text-white">
                        <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2 underline underline-offset-4 decoration-teal-500">Research Compliance</p>
                        <div className="flex items-center justify-between mt-4">
                            <div>
                                <p className="text-2xl font-black">98.4%</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">IRB Audit Score</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 className="text-teal-400" size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Studies Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Ongoing Clinical Trials</h3>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input type="text" placeholder="Search trials..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-purple-500/20" />
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left border-b border-slate-50">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Study Title / ID</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">PI</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phase</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {studies.map((s) => (
                                    <tr key={s._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="max-w-xs">
                                                <p className="text-sm font-bold text-slate-900 leading-tight">{s.title}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">ID: {s._id}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-medium text-slate-600">{s.pi}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">{s.phase}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5 w-32">
                                                <div className="flex justify-between text-[10px] font-black">
                                                    <span>{s.subjects} / {s.target}</span>
                                                    <span>{s.completion}%</span>
                                                </div>
                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-purple-500" style={{ width: `${s.completion}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${s.status === 'recruiting' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                                <MoreVertical size={16} className="text-slate-300" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Lower sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                    <div className="bg-[#1E1B4B] p-8 rounded-[40px] text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Users className="text-indigo-400" size={24} />
                            </div>
                            <h3 className="text-xl font-black tracking-tight">Population Health Registry</h3>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Monitor chronic disease trends (Diabetes, Hypertension) across patient cohorts. Identifies high-risk groups for early intervention.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">High Risk Score</p>
                                <p className="text-xl font-black text-rose-400">248 <span className="text-[10px] text-slate-400 ml-1">PATIENTS</span></p>
                            </div>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                                <button className="text-xs font-black uppercase tracking-widest text-teal-400 hover:scale-105 transition-transform">Launch Registry <ChevronRight size={14} className="inline ml-1" /></button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">Grant & Funding Status</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">FY2026 Research Budget</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <PieChart size={24} />
                            </div>
                        </div>
                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-bold text-slate-600">NIH Grant R01</span>
                                <span className="font-black text-slate-900">₹2.4M</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-4">
                                <span className="font-bold text-slate-600">Pharma Sponsored</span>
                                <span className="font-black text-slate-900">₹1.8M</span>
                            </div>
                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Active Grants</span>
                                <span className="text-lg font-black text-slate-900">₹4.2M</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
