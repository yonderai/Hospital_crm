"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import PatientRegistration from "@/components/patients/PatientRegistration";
import {
    Users,
    Calendar,
    Clock,
    DollarSign,
    UserPlus,
    Search,
    CheckCircle2,
    XCircle,
    MoreVertical,
    Plus
} from "lucide-react";

export default function FrontDeskDashboard() {
    const [showInTake, setShowInTake] = useState(false);

    const stats = [
        { title: "Today's Check-ins", value: "89", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
        { title: "Waiting Patients", value: "23", icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Appointments Booked", value: "45", icon: Calendar, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Payments", value: "12", icon: DollarSign, color: "text-purple-500", bg: "bg-purple-50" },
    ];

    const checkInQueue = [
        { name: "Johnathan Doe", mrn: "88234-A", arriving: "09:00 AM", provider: "Dr. Singh", status: "Arrived" },
        { name: "Alice Cooper", mrn: "11202-K", arriving: "09:15 AM", provider: "Dr. Smith", status: "Delayed" },
        { name: "Bob Marley", mrn: "99824-X", arriving: "09:30 AM", provider: "Dr. Singh", status: "Scheduled" },
        { name: "Charlie Brown", mrn: "77231-M", arriving: "10:00 AM", provider: "Dr. Adams", status: "Scheduled" },
    ];

    return (
        <DashboardLayout>
            {showInTake ? (
                <div className="space-y-6">
                    <button
                        onClick={() => setShowInTake(false)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        ← Return to Dispatch
                    </button>
                    <PatientRegistration />
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Concierge & Intake</h2>
                            <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">FRONT DESK NODE • MAIN LOBBY</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowInTake(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                            >
                                <UserPlus size={16} /> New Registration
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
                        {/* Check-in Queue */}
                        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Main Arrivals Queue</h3>
                                    <div className="flex gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Processing</span>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                        <input placeholder="Search Queue..." className="bg-slate-50 border border-slate-100 px-8 py-2 rounded-xl text-[10px] font-bold outline-none focus:border-olive-400 w-48" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Patient Profile</th>
                                            <th className="px-8 py-4">Est. Time</th>
                                            <th className="px-8 py-4">Provider</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {checkInQueue.map((p, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-olive-50 group-hover:text-olive-700 transition-colors">
                                                            <Users size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {p.mrn}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-500">{p.arriving}</td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-700 underline decoration-slate-200">{p.provider}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${p.status === 'Arrived' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            p.status === 'Delayed' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                'bg-slate-50 text-slate-400 border-slate-100'
                                                        }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right pr-8">
                                                    <button className="p-2 text-slate-400 hover:text-olive-700 rounded-xl hover:bg-olive-50 transition-all">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Sidebar: Scheduler Quick View */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-lg font-black text-slate-900 tracking-tight">Main Calendar</h4>
                                    <Calendar size={18} className="text-olive-600" />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100/50">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Jan 2026</p>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({ length: 31 }).map((_, i) => (
                                            <div key={i} className={`h-8 flex items-center justify-center text-[10px] font-bold rounded-lg ${i === 21 ? 'bg-olive-700 text-white' : 'text-slate-400'}`}>
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-slate-900 text-teal-400 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-black transition-all">
                                    Open Full Scheduler
                                </button>
                            </div>

                            <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                <div className="relative z-10">
                                    <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-6">
                                        <Plus size={24} className="text-teal-400" />
                                    </div>
                                    <h4 className="text-xl font-black mb-2">Book Expedited</h4>
                                    <p className="text-xs text-slate-400 leading-relaxed opacity-70 mb-6">Fast-track appointments for urgent referrals and post-op clinic cycles.</p>
                                    <button className="flex items-center gap-2 text-[10px] font-black text-teal-400 uppercase tracking-widest hover:pl-2 transition-all">
                                        Initialize Protocol →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
