"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    Search,
    Plus,
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Filter,
    Activity,
    MapPin
} from "lucide-react";

export default function FrontDeskSchedulePage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setAppointments([
                { time: "08:00 AM", patient: "Alice Cooper", doctor: "Dr. Singh", dept: "Cardiology", status: "Checked In" },
                { time: "08:30 AM", patient: "John Doe", doctor: "Dr. Smith", dept: "Orthopedics", status: "Waiting" },
                { time: "09:00 AM", patient: "Bob Marley", doctor: "Dr. Adams", dept: "General Med", status: "Scheduled" },
                { time: "09:30 AM", patient: "Charlie Brown", doctor: "Dr. Singh", dept: "Cardiology", status: "Scheduled" },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Central Booking</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">HOSPITAL APPOINTMENT SCHEDULER</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Calendar View
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Appointment
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Calendar Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-xs font-black uppercase tracking-widest">January 2026</h4>
                                <div className="flex gap-2">
                                    <button className="p-1 hover:bg-slate-50 rounded"><ChevronLeft size={16} /></button>
                                    <button className="p-1 hover:bg-slate-50 rounded"><ChevronRight size={16} /></button>
                                </div>
                            </div>
                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                    <span key={d} className="text-[10px] font-black text-slate-300 text-center">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {[...Array(31)].map((_, i) => (
                                    <button key={i} className={`h-8 w-8 rounded-xl text-[10px] font-bold flex items-center justify-center transition-all ${i + 1 === 22 ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20' : 'hover:bg-slate-50 text-slate-600'}`}>
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <h5 className="text-[10px] text-teal-400 font-black uppercase tracking-widest mb-4">Wait Time Alert</h5>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold">General Medicine</p>
                                    <p className="text-2xl font-black text-teal-400">12 Mins</p>
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-teal-400 w-1/4" />
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={140} />
                        </div>
                    </div>

                    {/* Main Schedule View */}
                    <div className="lg:col-span-3 space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <div className="flex items-center gap-4">
                                    <Calendar className="text-olive-600" size={20} />
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight italic lowercase font-serif">Today's Roster</h3>
                                </div>
                                <div className="flex gap-4">
                                    <div className="relative">
                                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                        <input className="bg-white border border-slate-200 px-8 py-2 rounded-xl text-[10px] font-bold outline-none w-48" placeholder="Search appointments..." />
                                    </div>
                                    <button className="p-2.5 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl"><Filter size={18} /></button>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-50">
                                {loading ? (
                                    [...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-50/10 animate-pulse" />)
                                ) : (
                                    appointments.map((appt, idx) => (
                                        <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                            <div className="flex items-center gap-8">
                                                <div className="w-20 text-center">
                                                    <p className="text-sm font-black text-slate-900">{appt.time}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Start Time</p>
                                                </div>
                                                <div className="w-px h-10 bg-slate-100" />
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 tracking-tight">{appt.patient}</p>
                                                        <div className="flex items-center gap-3 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            <span>{appt.doctor}</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                            <span className="flex items-center gap-1"><MapPin size={10} /> {appt.dept}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${appt.status === 'Checked In' ? 'bg-olive-50 text-olive-600 border-olive-100' : appt.status === 'Waiting' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                                    {appt.status}
                                                </span>
                                                <button className="p-2.5 text-slate-300 hover:text-olive-700 transition-all opacity-0 group-hover:opacity-100">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
