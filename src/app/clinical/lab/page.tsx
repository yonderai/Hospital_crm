"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    FlaskConical,
    Clock,
    CheckCircle2,
    AlertCircle,
    History,
    Plus,
    Download,
    Filter,
    Search
} from "lucide-react";

export default function LabWorkflow() {
    const [activeTab, setActiveTab] = useState("pending");

    const orders = [
        { id: "LAB-2201", patient: "Johnathan Doe", tests: ["CBC", "Lipid Panel"], priority: "Routine", status: "ordered", date: "Jan 22" },
        { id: "LAB-2202", patient: "Alice Cooper", tests: ["HbA1c"], priority: "Urgent", status: "collected", date: "Jan 22" },
        { id: "LAB-2198", patient: "Jane Smith", tests: ["Potassium", "Creatinine"], priority: "STAT", status: "completed", date: "Jan 21" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10 font-sans">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Diagnostics & Labs</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">CENTRAL PATHOLOGY WING • MEDICORE-01</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Generate Collective Report
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Lab Order
                        </button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <LabStat icon={Clock} label="Pending Tests" value="34" color="text-blue-500" />
                    <LabStat icon={FlaskConical} label="In-Progress" value="12" color="text-orange-500" />
                    <LabStat icon={CheckCircle2} label="Completed Today" value="67" color="text-green-500" />
                    <LabStat icon={AlertCircle} label="Critical Results" value="03" color="text-red-500" />
                </div>

                {/* Lab Order Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                        <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-xl">
                            {["Pending", "In-Progress", "Completed"].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t.toLowerCase())}
                                    className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t.toLowerCase() ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="bg-white border border-slate-200 px-8 py-2.5 rounded-xl text-[10px] font-bold outline-none w-64" placeholder="Filter by Patient or Lab ID..." />
                            </div>
                            <button className="p-2.5 bg-slate-50 border border-slate-100 text-slate-600 rounded-xl">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-8 py-5">Lab Order ID</th>
                                    <th className="px-8 py-5">Subject</th>
                                    <th className="px-8 py-5">Test Panel</th>
                                    <th className="px-8 py-5">Priority</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-slate-900">{o.id}</p>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase">{o.date}</p>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-slate-600 italic">
                                            {o.patient}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-2">
                                                {o.tests.map(t => (
                                                    <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[9px] font-black uppercase rounded border border-slate-200">{t}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${o.priority === 'STAT' ? 'text-red-500' : 'text-slate-500'}`}>
                                                {o.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${o.status === 'ordered' ? 'bg-blue-500 animation-pulse' : o.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
                                                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{o.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-10">
                                            <button className="flex items-center gap-2 text-[10px] font-black text-olive-700 bg-olive-50 px-4 py-2 rounded-xl border border-olive-100 opacity-0 group-hover:opacity-100 transition-all">
                                                {o.status === 'completed' ? <><Download size={14} /> PDF Report</> : <><Beaker size={14} /> Enter Results</>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Widgets Footer */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h4 className="text-lg font-black tracking-tight">Equipment Status</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">12 Active Analyzers</p>
                            </div>
                            <CheckCircle2 className="text-teal-400" size={24} />
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-olive-400 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-olive-50 text-olive-700 rounded-xl group-hover:bg-olive-600 group-hover:text-white transition-all">
                                <History size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Audit Log</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Chain of Custody</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
                                <Beaker size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Catalog & Vials</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Supply Threshold: Healthy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LabStat({ icon: Icon, label, value, color }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className={`p-4 bg-slate-50 ${color} rounded-2xl`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{value}</p>
            </div>
        </div>
    );
}
