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
    Filter,
    Activity,
    RefreshCw,
    TrendingUp
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function NurseSchedule() {
    const { data: session } = useSession();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSchedule = async () => {
        try {
            const res = await fetch("/api/nurse/dashboard-data");
            const data = await res.json();

            // Map dashboard data into a shift roster
            const roster = [
                ...(data.medicationSchedule || []).map((m: any, i: number) => ({
                    time: "10:30",
                    period: "AM",
                    patient: m.patientName,
                    task: "Medication Admin: " + m.medication,
                    priority: "High",
                    status: "Pending",
                    icon: Activity
                })),
                ...(data.vitalsFlow || []).filter((v: any) => v.status === 'Due Now').map((v: any, i: number) => ({
                    time: "ASAP",
                    period: "NOW",
                    patient: v.patient,
                    task: "Stat Vitals Round",
                    priority: "Urgent",
                    status: "Due Now",
                    icon: TrendingUp
                })),
                { time: "02:00", period: "PM", patient: "Full Ward", task: "Afternoon Rounds", priority: "Routine", status: "Scheduled", icon: Clock }
            ];

            setTasks(roster.slice(0, 6));
        } catch (error) {
            console.error("Schedule Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedule();
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Shift Roster Node</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            CHRONOS STREAM • {nurseName} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-8 py-3 bg-olive-700 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95">
                            <Plus size={16} /> New Clinical Task
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <h3 className="text-xl font-black text-slate-900 uppercase italic">Execution Timeline</h3>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl">
                            <Clock size={14} className="text-olive-600" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Schedule</span>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center h-96">
                            <RefreshCw className="animate-spin text-slate-200 mb-4" size={48} />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center">Calibrating Shift Roster...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {tasks.map((item, idx) => (
                                <div key={idx} className="flex group hover:bg-slate-50/50 transition-all">
                                    <div className="w-40 p-10 border-r border-slate-50 flex flex-col items-center justify-center group-hover:bg-slate-50 transition-colors">
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">{item.time}</span>
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.period}</span>
                                    </div>
                                    <div className="flex-1 p-6 flex items-center">
                                        <div className={`w-full p-8 rounded-[40px] border transition-all hover:shadow-lg ${item.status === 'Due Now'
                                                ? 'bg-red-50/30 border-red-100 animate-pulse'
                                                : item.status === 'Pending'
                                                    ? 'bg-olive-50/30 border-olive-100 group-hover:border-olive-300'
                                                    : 'bg-white border-slate-100'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${item.status === 'Due Now' ? 'bg-red-100 text-red-600' : 'bg-white border border-slate-100 text-olive-600'
                                                        }`}>
                                                        <item.icon size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tight">{item.task}</h4>
                                                        <div className="flex items-center gap-3 mt-1">
                                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{item.patient}</p>
                                                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                                            <span className={`text-[9px] font-black uppercase tracking-widest ${item.priority === 'Urgent' ? 'text-red-500' : 'text-olive-600'
                                                                }`}>{item.priority} Priority</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] border shadow-sm ${item.status === 'Due Now'
                                                            ? 'bg-red-500 text-white border-red-500'
                                                            : 'bg-white text-slate-500 border-slate-200'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                                                        Execute
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
