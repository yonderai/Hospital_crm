"use client";

import { useState, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    Filter,
    ChevronLeft,
    ChevronRight,
    Search,
    Clock,
    User,
    CheckCircle2,
    XCircle
} from "lucide-react";
import { format, addDays, subDays, startOfWeek, endOfWeek, addWeeks, subWeeks, parseISO } from "date-fns";

interface ScheduleProps {
    role: "admin" | "doctor" | "frontdesk";
}

export default function DoctorScheduleDashboard({ role }: ScheduleProps) {
    const [view, setView] = useState<"day" | "week">("day");
    const [date, setDate] = useState(new Date());
    const [department, setDepartment] = useState("All");
    const [scheduleData, setScheduleData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const departments = ["All", "Cardiology", "Orthopedics", "Neurology", "Pediatrics", "General Surgery"];

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                date: format(date, "yyyy-MM-dd"),
                view,
                department
            });
            const res = await fetch(`/api/appointments/schedule?${queryParams}`);
            const data = await res.json();
            if (data.schedule) {
                setScheduleData(data.schedule);
            }
        } catch (error) {
            console.error("Failed to fetch schedule", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, [date, view, department]);

    // Navigation Handlers
    const handlePrev = () => setDate(d => view === 'day' ? subDays(d, 1) : subWeeks(d, 1));
    const handleNext = () => setDate(d => view === 'day' ? addDays(d, 1) : addWeeks(d, 1));
    const handleToday = () => setDate(new Date());

    return (
        <div className="space-y-6 font-sans">
            {/* --- HEADER & FILTERS --- */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Doctor Schedule</h2>
                        <p className="text-slate-500 font-medium">Manage availability and bookings.</p>
                    </div>

                    {/* View Toggles & Actions */}
                    <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-xl">
                        <button
                            onClick={() => setView('day')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Day View
                        </button>
                        <button
                            onClick={() => setView('week')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${view === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Week View
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-50">
                    {/* Date Navigation */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                        <button onClick={handlePrev} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"><ChevronLeft size={18} /></button>
                        <div className="px-2 font-bold text-slate-700 min-w-[140px] text-center flex items-center justify-center gap-2">
                            <CalendarIcon size={16} className="text-slate-400" />
                            {view === 'day' ? format(date, "EEE, MMM dd, yyyy") :
                                `${format(startOfWeek(date, { weekStartsOn: 1 }), "MMM dd")} - ${format(endOfWeek(date, { weekStartsOn: 1 }), "MMM dd")}`
                            }
                        </div>
                        <button onClick={handleNext} className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all"><ChevronRight size={18} /></button>
                    </div>
                    <button onClick={handleToday} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-sm transition-colors border border-slate-200">
                        Today
                    </button>

                    {/* Department Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                            value={department}
                            onChange={e => setDepartment(e.target.value)}
                            className="pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm outline-none focus:ring-2 focus:ring-olive-500/20"
                        >
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div className="ml-auto w-full md:w-auto relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            placeholder="Search Doctor..."
                            className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600 text-sm outline-none focus:ring-2 focus:ring-olive-500/20 w-full md:w-64"
                        />
                    </div>
                </div>
            </div>

            {/* --- CONTENT GRID --- */}
            <div className="space-y-6">
                {loading ? (
                    <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading schedule data...</div>
                ) : scheduleData.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500 font-bold">No doctors found for this filter.</p>
                    </div>
                ) : (
                    scheduleData.map((doc: any) => (
                        <div key={doc.doctor.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                            {/* Doctor Header */}
                            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-olive-50 text-olive-600 rounded-2xl flex items-center justify-center font-black text-xl">
                                        {doc.doctor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{doc.doctor.name}</h3>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{doc.doctor.department}</p>
                                    </div>
                                </div>

                                {view === 'day' && doc.summary && (
                                    <div className="flex gap-4 text-sm font-medium">
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                                            <span>Available: <span className="font-bold text-slate-700">{doc.summary.available}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500">
                                            <div className="w-2 h-2 rounded-full bg-olive-500"></div>
                                            <span>Booked: <span className="font-bold text-slate-700">{doc.summary.booked}</span></span>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-xs hover:bg-slate-800 transition-colors ml-2">
                                            Book Appointment
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* View Content */}
                            <div className="p-6">
                                {view === 'day' ? (
                                    // DAY VIEW GRID
                                    <div className="space-y-2">
                                        {doc.slots.map((slot: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-4 py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors rounded-lg px-2">
                                                <div className="w-24 font-mono text-sm font-bold text-slate-500">{slot.time}</div>
                                                <div className="flex-1">
                                                    {slot.status === 'booked' ? (
                                                        <div className="h-10 bg-olive-600 rounded-xl flex items-center px-4 text-white text-sm font-bold shadow-sm shadow-olive-200 w-full md:w-3/4 relative overflow-hidden">
                                                            <div className="absolute inset-0 bg-white/10 skew-x-12 -ml-4 w-8"></div>
                                                            <span className="truncate">Booked - {slot.patient}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="h-10 bg-slate-100 rounded-xl border border-slate-200 border-dashed flex items-center px-4 text-slate-400 text-xs font-bold w-full md:w-3/4">
                                                            Available
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    // WEEK VIEW GRID
                                    <div className="grid grid-cols-7 gap-2">
                                        {doc.weekStats.map((day: any) => (
                                            <div key={day.date} className="flex flex-col gap-2">
                                                <div className={`p-3 rounded-2xl border text-center transition-all ${day.date === format(new Date(), "yyyy-MM-dd") ? 'bg-olive-50 border-olive-200' : 'bg-slate-50 border-slate-100'
                                                    }`}>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{day.dayName}</p>
                                                    <p className="text-sm font-bold text-slate-700">{format(parseISO(day.date), "dd")}</p>
                                                </div>
                                                <div className={`p-4 rounded-2xl border text-center h-24 flex flex-col items-center justify-center gap-1 ${day.status === 'Full' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'
                                                    }`}>
                                                    <p className={`text-xl font-black ${day.status === 'Full' ? 'text-red-500' : 'text-slate-800'}`}>
                                                        {day.booked}/{day.total}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Slots</p>

                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
