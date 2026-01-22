"use client";

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
    Search
} from "lucide-react";

export default function NurseClinical() {
    const activeTasks = [
        { patient: "Jim Morrison", action: "Vitals (SpO2, HR)", priority: "Urgent", status: "Due Now", room: "W2-A" },
        { patient: "Janis Joplin", action: "Medication Admin", priority: "High", status: "10:30 AM", room: "W3-C" },
        { patient: "Kurt Cobain", action: "Wound Care", priority: "Routine", status: "11:00 AM", room: "W1-B" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Care Console</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">NURSE SARAH CONNOR • STATION 7G</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Clinical Entry
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main: Intervention Queue */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Bedside Interventions</h3>
                                <div className="text-[10px] font-black text-olive-600 uppercase tracking-widest">Active Shift</div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {activeTasks.map((item, idx) => (
                                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-olive-50 flex items-center justify-center text-olive-600">
                                                <Activity size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-md font-black text-slate-900 tracking-tight">{item.action}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.patient}</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-bold text-olive-600 uppercase tracking-widest">{item.room}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">
                                                Perform
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Protocols & Handoff */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Handoff Notes</h4>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 italic text-sm text-slate-300">
                                        "Dr. Singh requested hourly monitoring for the post-op in W2-A. Monitor BP closely."
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-800 transition-all">
                                        Update Handoff
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Care Protocol Checklists</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle size={14} className="text-olive-600" />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase">Pre-Shift Vitals Round</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <CheckCircle size={14} className="text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-700 uppercase">Narcotics Reconciliation</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
