"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Scan,
    Aperture,
    Monitor,
    AlertCircle,
    CheckCircle2,
    Clock,
    Plus,
    Search,
    Filter,
    FileText,
    Image as ImageIcon,
    Download,
    ChevronRight,
    Activity
} from "lucide-react";

const imagingOrders = [
    { id: "IMG-5501", patient: "Emma Wilson", type: "MRI Brain w/ Contrast", priority: "Urgent", status: "needs-interpretation", date: "Jan 22, 14:30" },
    { id: "IMG-5502", patient: "Marcus Thorne", type: "Chest X-Ray (PA)", priority: "Routine", status: "awaiting-scan", date: "Jan 22, 15:00" },
    { id: "IMG-5498", patient: "Sarah Miller", type: "CT Abdomen/Pelvis", priority: "STAT", status: "critical", date: "Jan 22, 13:15" },
    { id: "IMG-5495", patient: "John Davis", type: "Ultrasound Carotid", priority: "Routine", status: "completed", date: "Jan 21, 16:45" },
];

export default function RadiologyDashboard() {
    const [activeTab, setActiveTab] = useState("all");

    const stats = [
        { title: "Pending Scans", value: "18", icon: Aperture, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Needs Reading", value: "09", icon: Monitor, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Critical Findings", value: "02", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
        { title: "Throughput (24h)", value: "45", icon: Activity, color: "text-green-500", bg: "bg-green-50" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Diagnostic Imaging</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">Radiology & Advanced Visualization</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            PACS Archive
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Imaging Order
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
                    {/* Imaging Workflow Queue */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl">
                                {["All", "Awaiting Scan", "Interpret", "Critical"].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setActiveTab(t.toLowerCase())}
                                        className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t.toLowerCase() ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input className="bg-white border border-slate-200 px-8 py-2.5 rounded-xl text-[10px] font-bold outline-none w-48" placeholder="Search orders..." />
                                </div>
                                <button className="p-2.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-10 py-6">Order Control</th>
                                        <th className="px-10 py-6">Patient Entity</th>
                                        <th className="px-10 py-6">Modality / Procedure</th>
                                        <th className="px-10 py-6">Priority</th>
                                        <th className="px-10 py-6 text-right pr-14">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {imagingOrders.map((o) => (
                                        <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-10 py-7">
                                                <p className="text-xs font-black text-slate-900 font-mono tracking-tighter">{o.id}</p>
                                                <p className="text-[9px] text-slate-400 font-bold mt-0.5">{o.date}</p>
                                            </td>
                                            <td className="px-10 py-7">
                                                <p className="text-sm font-bold text-slate-900">{o.patient}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'critical' ? 'bg-red-500 animate-pulse' : o.status === 'awaiting-scan' ? 'bg-blue-500' : 'bg-olive-500'}`} />
                                                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{o.status.replace('-', ' ')}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className="text-xs font-black text-olive-800 bg-olive-50 px-3 py-1.5 rounded-lg border border-olive-100">{o.type}</span>
                                            </td>
                                            <td className="px-10 py-7">
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${o.priority === 'STAT' ? 'text-red-600' : o.priority === 'Urgent' ? 'text-orange-600' : 'text-slate-500'}`}>
                                                    {o.priority}
                                                </span>
                                            </td>
                                            <td className="px-10 py-7 text-right pr-10">
                                                <button className="flex items-center gap-2 text-[9px] font-black text-white bg-slate-900 px-5 py-2.5 rounded-xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">
                                                    {o.status === 'needs-interpretation' || o.status === 'critical' ? <><Monitor size={14} className="text-teal-400" /> Interpret</> : <><Aperture size={14} className="text-teal-400" /> Start Scan</>}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Side Components: Interpretation Workspace & Quick Review */}
                    <div className="space-y-8">
                        {/* Interpretation Card */}
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Monitor className="text-teal-400" size={24} />
                                        <h4 className="text-lg font-black tracking-tight leading-none uppercase italic">Vantage Reader</h4>
                                    </div>
                                    <span className="text-[9px] font-black bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded border border-teal-500/30">AI-ASSIST ON</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-2">Active Interpretation</p>
                                        <p className="text-sm font-bold">CT Abdomen - Sarah Miller</p>
                                        <div className="flex items-center gap-2 mt-3">
                                            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                <div className="w-2/3 h-full bg-teal-400 rounded-full" />
                                            </div>
                                            <span className="text-[9px] font-black text-teal-400">65% Done</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all">
                                        Resume Workspace
                                    </button>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={200} />
                        </div>

                        {/* Recent Reports List */}
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm h-[320px] flex flex-col">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Finalized Reports</h4>
                                <History size={16} className="text-slate-300" />
                            </div>
                            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                                <ReportItem patient="John Davis" type="Ultrasound" date="1h ago" />
                                <ReportItem patient="Robert Chen" type="X-Ray Chest" date="3h ago" />
                                <ReportItem patient="Maria Garcia" type="MRI Lumbar" date="Yesterday" />
                                <ReportItem patient="Linda Wu" type="CT Head" date="Yesterday" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function ReportItem({ patient, type, date }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-400 transition-all group">
            <div className="flex gap-3 items-center">
                <div className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-olive-600 shadow-sm group-hover:bg-olive-600 group-hover:text-white transition-all">
                    <FileText size={18} />
                </div>
                <div>
                    <p className="text-xs font-black text-slate-900">{patient}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{type}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase">{date}</p>
                <Download size={12} className="text-slate-300 ml-auto mt-1 cursor-pointer hover:text-olive-600 transition-all" />
            </div>
        </div>
    );
}

const History = ({ size, className }: { size: number, className: string }) => (
    <Clock size={size} className={className} />
);
