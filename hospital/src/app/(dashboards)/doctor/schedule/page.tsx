"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar as CalendarIcon,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter
} from "lucide-react";

export default function DoctorSchedule() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await fetch('/api/schedule?role=doctor');
                const data = await res.json();
                setAppointments(data.schedule);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Schedule</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. YUVRAJ SINGH • THURSDAY, JAN 22 2026</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
                            <Filter size={20} />
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Add Block
                        </button>
                    </div>
                </div>

                {/* Calendar Navigation Mock */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button className="px-6 py-2 bg-white text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">Day</button>
                            <button className="px-6 py-2 text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest">Week</button>
                            <button className="px-6 py-2 text-slate-400 rounded-lg text-xs font-black uppercase tracking-widest">Month</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-black text-slate-900">January 22, 2026</span>
                            <button className="p-2 hover:bg-slate-50 rounded-lg"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-olive-50 rounded-full border border-olive-100">
                        <div className="w-2 h-2 rounded-full bg-olive-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-olive-700 uppercase tracking-widest">Next Appt in 15m</span>
                    </div>
                </div>

                {/* Timeline View */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                    {loading ? (
                        <div className="p-12 space-y-8">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex gap-8">
                                    <div className="w-20 h-4 bg-slate-50 rounded animate-pulse" />
                                    <div className="flex-1 h-24 bg-slate-50 rounded-3xl animate-pulse" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {appointments.map((item, idx) => (
                                <div key={idx} className="flex group hover:bg-slate-50/30 transition-colors">
                                    <div className="w-32 p-8 border-r border-slate-50 flex flex-col items-center justify-center">
                                        <span className="text-lg font-black text-slate-900 tracking-tighter">{item.time}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.period}</span>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className={`p-6 rounded-[32px] border transition-all ${item.type === 'consultation'
                                                ? 'bg-olive-50/50 border-olive-100 group-hover:border-olive-300'
                                                : 'bg-orange-50/50 border-orange-100 group-hover:border-orange-300'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.type === 'consultation' ? 'bg-olive-100 text-olive-700' : 'bg-orange-100 text-orange-700'
                                                        }`}>
                                                        <User size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 tracking-tight">{item.patientName}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                <Clock size={12} /> {item.duration}
                                                            </div>
                                                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                {item.reason}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'confirmed' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-all">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
