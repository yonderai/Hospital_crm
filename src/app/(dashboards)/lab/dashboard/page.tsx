"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    FlaskConical,
    Activity,
    AlertCircle,
    Plus,
    Clock,
    TestTube,
    Database
} from "lucide-react";

export default function LabTechDashboard() {
    const stats = [
        { title: "Pending Specimens", value: "42", icon: FlaskConical, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "In-Processing", value: "18", icon: Activity, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Results Verification", value: "05", icon: Database, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Critical Findings", value: "02", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    ];

    const labQueue = [
        { patient: "Alice Cooper", test: "HBA1C / CMP", priority: "Routine", status: "Processing", arrival: "08:15 AM" },
        { patient: "Jim Morrison", test: "LIPID PANEL", priority: "Stat", status: "Awaiting", arrival: "09:45 AM" },
        { patient: "Janis Joplin", test: "CBC w/ DIFF", priority: "Urgent", status: "Analyzing", arrival: "10:10 AM" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostic Laboratory</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">TECH. ALAN TURING • LAB NODE 42</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Accession Specimen
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Specimen Queue</h3>
                            <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em]">View All</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Specimen / Patient</th>
                                        <th className="px-8 py-4">Test Profile</th>
                                        <th className="px-8 py-4">Priority</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {labQueue.map((q, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-slate-900">{q.patient}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{q.arrival}</p>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-slate-600">{q.test}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${q.priority === 'Stat' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        q.priority === 'Urgent' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {q.priority}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-500 font-medium">{q.status}</td>
                                            <td className="px-8 py-5 text-right pr-8">
                                                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                                    Process
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Equipment Maintenance</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <TestTube className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">Mass Spectrometer-A</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Calibration due in 24h</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-olive-500/10 rounded-2xl border border-olive-500/20">
                                        <Clock className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-olive-100">Centrifuge Node 4</p>
                                            <p className="text-[10px] text-olive-300 mt-0.5">Operating at Nominal levels</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
