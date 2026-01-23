"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Clipboard,
    FileText,
    Beaker,
    CheckCircle,
    Clock,
    Plus,
    Filter,
    ChevronRight,
    Search
} from "lucide-react";

export default function DoctorClinical() {
    const tasks = [
        { title: "Review Lab Results: Jim Morrison", type: "Laboratory", priority: "Urgent", status: "Pending", time: "10m ago" },
        { title: "Sign Clinical Note: Alice Cooper", type: "Clinical", priority: "Routine", status: "Awaiting", time: "1h ago" },
        { title: "Prescribe Medication: Freddie Mercury", type: "Pharmacy", priority: "Routine", status: "Draft", time: "2h ago" },
    ];

    const encounters = [
        { patient: "Janis Joplin", type: "Follow-up", doctor: "Self", date: "Jan 22, 2026", time: "10:30 AM", status: "Completed" },
        { patient: "Kurt Cobain", type: "Initial Consultation", doctor: "Self", date: "Jan 22, 2026", time: "09:00 AM", status: "Signed" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Decision Hub</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. YUVRAJ SINGH • NODE α-01</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Encounter
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Task List & Orders */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Task List */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Pending Actions</h3>
                                <div className="flex bg-slate-100 p-0.5 rounded-xl">
                                    <button className="px-4 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">All</button>
                                    <button className="px-4 py-1.5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Urgent</button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {tasks.map((task, idx) => (
                                    <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${task.priority === 'Urgent' ? 'bg-red-50 text-red-600' : 'bg-olive-50 text-olive-600'
                                                }`}>
                                                {task.type === 'Laboratory' ? <Beaker size={24} /> : <FileText size={24} />}
                                            </div>
                                            <div>
                                                <h4 className="text-md font-black text-slate-900 tracking-tight">{task.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.type}</span>
                                                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                            Verify
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Encounters */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Clinical Encounters</h3>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input type="text" placeholder="Filter..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-5">Patient</th>
                                            <th className="px-8 py-5">Type</th>
                                            <th className="px-8 py-5">Time/Date</th>
                                            <th className="px-8 py-5">Status</th>
                                            <th className="px-8 py-5 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {encounters.map((e, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tight">{e.patient}</td>
                                                <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase">{e.type}</td>
                                                <td className="px-8 py-6">
                                                    <p className="text-xs font-black text-slate-700">{e.time}</p>
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase">{e.date}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${e.status === 'Signed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                                        }`}>
                                                        {e.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right pr-8">
                                                    <button className="p-2 text-slate-400 hover:text-olive-700 transition-all">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Tools & CDS */}
                    <div className="space-y-10">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight leading-none italic uppercase">Clinical Search</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <Clipboard className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">Protocols</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">ICD-10 Search Active</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <Beaker className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">Drug Database</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">Interaction Check</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Action Templates</h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle size={18} className="text-olive-600" />
                                        <span className="text-xs font-black uppercase text-slate-700">Pre-Op Clearance</span>
                                    </div>
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Clipboard size={18} className="text-olive-600" />
                                        <span className="text-xs font-black uppercase text-slate-700">Discharge Summary</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
