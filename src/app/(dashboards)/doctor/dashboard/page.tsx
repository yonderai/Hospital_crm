"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Calendar,
    Beaker,
    AlertTriangle,
    Plus,
    FileText,
    Pill,
    ArrowUpRight,
    Activity
} from "lucide-react";

export default function DoctorDashboard() {
    const stats = [
        { title: "Today's Appointments", value: "12", icon: Calendar, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Patients Under Care", value: "45", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Lab Results", value: "08", icon: Beaker, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Critical Alerts", value: "02", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-50" },
    ];

    const patientQueue = [
        { name: "Alice Cooper", time: "09:00 AM", status: "Checked-in", reason: "Diabetes Follow-up" },
        { name: "Bob Marley", time: "09:30 AM", status: "Waiting", reason: "Chronic Pain Mgmt" },
        { name: "Charlie Brown", time: "10:15 AM", status: "Checked-in", reason: "Post-Op Review" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Physician Workstation</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. YUVRAJ SINGH • ONCOLOGY UNIT</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Consultation
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

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Box: Patient Queue */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">In-Clinic Queue</h3>
                            <span className="text-[10px] font-black text-olive-600 bg-olive-50 px-3 py-1 rounded-full uppercase tracking-widest border border-olive-100">Live Status</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Patient</th>
                                        <th className="px-8 py-4">Appt. Time</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Reason</th>
                                        <th className="px-8 py-4 text-right pr-12">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {patientQueue.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-black text-[10px]">
                                                        {p.name[0]}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-900">{p.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{p.time}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${p.status === 'Checked-in' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-600 font-medium">{p.reason}</td>
                                            <td className="px-8 py-5 text-right pr-6">
                                                <button className="p-2 text-slate-400 hover:text-olive-700 bg-slate-50 rounded-lg border border-slate-200 group-hover:bg-white transition-all">
                                                    <ArrowUpRight size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Box: Quick Actions & Alerts */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight leading-tight">Clinical Decision Support</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <FileText className="text-olive-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-white">Review Protocols</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Updated oncology protocols available for V-03.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <AlertTriangle className="text-red-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-red-100 underline decoration-red-500/30">Action Required</p>
                                            <p className="text-[10px] text-red-300 mt-0.5">Critical Lab: Jane Doe (Potassium 6.2 mmol/L)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Directives</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <QuickAction icon={Pill} label="Prescribe" color="bg-orange-50 text-orange-600" />
                                <QuickAction icon={Beaker} label="Order Lab" color="bg-olive-100 text-olive-700" />
                                <QuickAction icon={Users} label="Referral" color="bg-olive-50 text-olive-600" />
                                <QuickAction icon={Calendar} label="Follow-up" color="bg-olive-50 text-olive-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuickAction({ icon: Icon, label, color }: any) {
    return (
        <button className="flex flex-col items-center gap-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-olive-200 transition-all font-sans group">
            <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
        </button>
    );
}
