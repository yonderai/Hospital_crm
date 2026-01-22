"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Droplets,
    Activity,
    CheckCircle2,
    Plus,
    Clock,
    Thermometer,
    ClipboardList,
    FileText
} from "lucide-react";

export default function NurseDashboard() {
    const stats = [
        { title: "Patients Under Care", value: "28", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Medications Due", value: "15", icon: Droplets, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Vital Signs Pending", value: "09", icon: Activity, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Tasks Completed", value: "67%", icon: CheckCircle2, color: "text-olive-600", bg: "bg-olive-50" },
    ];

    const medicationSchedule = [
        { name: "John Doe", room: "Ward 2-B", med: "Insulin Glargine", dose: "10 units", time: "10:00 AM" },
        { name: "Jane Smith", room: "ICU-4", med: "Heparin", dose: "5000 units", time: "10:30 AM" },
        { name: "Bob Marley", room: "Ward 1-A", med: "Metformin", dose: "500mg", time: "11:00 AM" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nursing Station</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">NURSE SARAH CONNOR • SECTOR 7G</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Handover Notes
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Record
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
                    {/* Med Schedule */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Medication Schedule</h3>
                                <Clock size={20} className="text-slate-400" />
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Patient / Room</th>
                                            <th className="px-8 py-4">Medication / Dose</th>
                                            <th className="px-8 py-4">Dispense Time</th>
                                            <th className="px-8 py-4 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {medicationSchedule.map((m, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-slate-900">{m.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{m.room}</p>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-bold text-olive-700">{m.med} ({m.dose})</td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[10px] font-black bg-olive-50 text-olive-600 px-3 py-1 rounded-full uppercase tracking-widest border border-olive-100">
                                                        {m.time}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right pr-8">
                                                    <button className="px-4 py-2 bg-olive-100 text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-200 transition-all">
                                                        Finalize
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6">Patient Vitals Flow</h3>
                            <div className="space-y-4">
                                <VitalsControl label="SpO2 & HR Check" patient="Alice Cooper (W2-B)" status="Due Now" color="border-red-500" />
                                <VitalsControl label="BP Monitoring" patient="Johnathan Doe (W3-A)" status="In 45m" color="border-slate-200" />
                                <VitalsControl label="Temp Round" patient="Pediatric Unit" status="Completed" color="border-olive-500" />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Tasks & Procedures */}
                    <div className="space-y-8">
                        <div className="bg-olive-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Wound Care Cycle</h4>
                                <p className="text-[10px] text-olive-400 font-bold uppercase tracking-widest leading-none">Awaiting Intervention</p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <ClipboardList className="text-olive-400" size={20} />
                                        <div className="text-sm font-bold">Dressings: Room 402, 404, 408</div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Shortcuts</h4>
                            <NurseAction icon={Activity} label="Record Vitals" />
                            <NurseAction icon={Droplets} label="Administer Med" />
                            <NurseAction icon={FileText} label="Clinical Note" />
                            <NurseAction icon={Thermometer} label="Update Chart" />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function NurseAction({ icon: Icon, label }: any) {
    return (
        <button className="w-full flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-400 hover:bg-white transition-all group">
            <div className="p-3 bg-white rounded-xl text-olive-600 shadow-sm border border-slate-100 group-hover:bg-olive-600 group-hover:text-white transition-all">
                <Icon size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">{label}</span>
        </button>
    );
}

function VitalsControl({ label, patient, status, color }: any) {
    return (
        <div className={`p-5 rounded-3xl border bg-slate-50/30 flex items-center justify-between transition-all hover:bg-white ${color}`}>
            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                    <Activity size={18} />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-900">{label}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{patient}</p>
                </div>
            </div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
        </div>
    );
}
