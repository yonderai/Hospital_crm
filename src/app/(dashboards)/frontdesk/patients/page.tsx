"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    UserPlus,
    CheckCircle2,
    Clock,
    ShieldCheck,
    MoreVertical,
    Calendar,
    ChevronRight,
    SearchCheck
} from "lucide-react";

export default function FrontDeskPatientsPage() {
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setQueue([
                { name: "Johnathan Doe", mrn: "88234-A", arriving: "09:00 AM", provider: "Dr. Singh", status: "Arrived", insurance: "Verified" },
                { name: "Alice Cooper", mrn: "11202-K", arriving: "09:15 AM", provider: "Dr. Smith", status: "Delayed", insurance: "Pending" },
                { name: "Bob Marley", mrn: "99824-X", arriving: "09:30 AM", provider: "Dr. Singh", status: "Scheduled", insurance: "Verified" },
                { name: "Charlie Brown", mrn: "77231-M", arriving: "10:00 AM", provider: "Dr. Adams", status: "Scheduled", insurance: "Expired" },
                { name: "Diana Ross", mrn: "55610-P", arriving: "10:30 AM", provider: "Dr. Gupta", status: "Scheduled", insurance: "Verified" },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Concierge & Intake</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">FRONT DESK NODE • MAIN LOBBY</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                            Insurance Portal
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <UserPlus size={16} /> New Registration
                        </button>
                    </div>
                </div>

                {/* Queue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <QueueWidget label="Expected Today" value="48" icon={Calendar} color="text-olive-600" bg="bg-olive-50" />
                    <QueueWidget label="Currently Waiting" value="12" icon={Clock} color="text-blue-500" bg="bg-blue-50" />
                    <QueueWidget label="Verified Insurance" value="92%" icon={ShieldCheck} color="text-teal-500" bg="bg-teal-50" />
                </div>

                {/* Intake Registry */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div className="flex items-center gap-4">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Main Arrivals Queue</h3>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Live Feed</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2 rounded-xl w-64 shadow-sm">
                            <Search size={14} className="text-slate-400" />
                            <input placeholder="Quick Search..." className="bg-transparent border-none outline-none text-[10px] font-bold text-slate-900 w-full" />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-8 py-6">Patient Identifier</th>
                                <th className="px-8 py-6">Appt. Time</th>
                                <th className="px-8 py-6">Provider</th>
                                <th className="px-8 py-6">Insurance Status</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                            ) : (
                                queue.map((p, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-olive-50 group-hover:text-olive-700 transition-colors">
                                                    <Users size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ID: {p.mrn}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-black ${p.status === 'Arrived' ? 'text-green-600' : p.status === 'Delayed' ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {p.arriving}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase">({p.status})</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-700 underline decoration-slate-200">
                                            {p.provider}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-1.5 h-1.5 rounded-full ${p.insurance === 'Verified' ? 'bg-green-500' : p.insurance === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'}`} />
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{p.insurance}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="px-4 py-2 bg-olive-50 text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                                    Check-In
                                                </button>
                                                <button className="p-2 text-slate-300 hover:text-slate-600 transition-all">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QueueWidget({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div className={`p-5 ${bg} ${color} rounded-[24px] shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
        </div>
    );
}
