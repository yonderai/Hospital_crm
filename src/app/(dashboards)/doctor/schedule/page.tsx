"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Clock,
    User,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    CheckCircle,
    Pill,
    Calendar as CalendarIcon
} from "lucide-react";
import Link from "next/link";

export default function DoctorSchedule() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Helper to format date for API (YYYY-MM-DD)
    const formatDateForApi = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    // Helper for display date
    const formatDateDisplay = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    useEffect(() => {
        const fetchSchedule = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch filtered by date
                const dateStr = formatDateForApi(selectedDate);
                const url = `/api/appointments?date=${dateStr}`;
                console.log("Fetching schedule from:", url);

                const res = await fetch(url);
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to fetch: ${res.status} ${res.statusText} - ${text}`);
                }

                const data = await res.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid response format: expected array");
                }

                const mapped = data.map((apt: any) => {
                    const start = new Date(apt.startTime);
                    const end = new Date(apt.endTime);
                    const durationMins = Math.round((end.getTime() - start.getTime()) / 60000);

                    return {
                        id: apt._id,
                        patientId: apt.patientId?._id,
                        time: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        period: start.getHours() < 12 ? 'AM' : 'PM',
                        type: apt.type,
                        patientName: `${apt.patientId?.firstName} ${apt.patientId?.lastName}`,
                        duration: `${durationMins} min`,
                        reason: apt.reason,
                        status: apt.status
                    };
                });

                setAppointments(mapped);
            } catch (error: any) {
                console.error("Failed to fetch schedule:", error);
                setError(error.message || "An unknown error occurred");
                setAppointments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [selectedDate]);

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Schedule</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">
                            DR. GREGORY HOUSE • {formatDateDisplay(selectedDate).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all">
                            <Filter size={20} />
                        </button>
                        {/* <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Add Block
                        </button> */}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {/* Calendar Navigation */}
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex bg-slate-50 p-1 rounded-xl">
                            <button
                                onClick={handleToday}
                                className="px-6 py-2 bg-white text-slate-900 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-colors"
                            >
                                Today
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={handlePrevDay} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronLeft size={16} /></button>
                            <span className="text-sm font-black text-slate-900 w-48 text-center">{formatDateDisplay(selectedDate)}</span>
                            <button onClick={handleNextDay} className="p-2 hover:bg-slate-50 rounded-lg transition-colors"><ChevronRight size={16} /></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-olive-50 rounded-full border border-olive-100">
                        <div className="w-2 h-2 rounded-full bg-olive-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold text-olive-700 uppercase tracking-widest">Live Schedule</span>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Scheduled', value: appointments.length, icon: CalendarIcon, color: 'slate' },
                        { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, icon: CheckCircle, color: 'green' },
                        { label: 'Prescribed', value: appointments.filter(a => a.status === 'completed' && a.type === 'consultation').length, icon: Pill, color: 'olive' },
                        { label: 'Remaining', value: appointments.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length, icon: Clock, color: 'orange' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
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
                    ) : appointments.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
                                <CalendarIcon size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">No Appointments</h3>
                            <p className="text-slate-500 text-sm mt-1">No appointments scheduled for {formatDateDisplay(selectedDate)}.</p>
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
                                                        <Link href={`/doctor/clinical?patientId=${item.patientId}&tab=prescription&aptId=${item.id}`} className="group/name">
                                                            <h4 className="text-sm font-black text-slate-900 tracking-tight group-hover/name:text-olive-700 transition-colors underline decoration-slate-200 underline-offset-4">{item.patientName}</h4>
                                                        </Link>
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
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        item.status === 'confirmed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                    <Link
                                                        href={`/doctor/clinical?patientId=${item.patientId}&tab=consultation&aptId=${item.id}`}
                                                        className="p-2 text-slate-400 hover:text-slate-900 transition-all"
                                                    >
                                                        <ChevronRight size={20} />
                                                    </Link>
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
