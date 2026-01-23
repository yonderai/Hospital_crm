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
    Activity
} from "lucide-react";

export default function NurseSchedule() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Mocking nurse schedule (Vitals, Meds, Rounds)
                await new Promise(resolve => setTimeout(resolve, 600));
                setTasks([
                    { time: "09:00", period: "AM", patient: "Alice Cooper (W2-B)", task: "Vitals Check", priority: "Urgent", status: "Done" },
                    { time: "10:15", period: "AM", patient: "Bob Marley (W1-A)", task: "Medication Admin", priority: "High", status: "Pending" },
                    { time: "11:00", period: "AM", patient: "Charlie Brown (W3-C)", task: "Wound Dressing", priority: "Normal", status: "Scheduled" },
                    { time: "02:30", period: "PM", patient: "Elvis Presley (W4-A)", task: "Vitals Check", priority: "Normal", status: "Scheduled" },
                    { time: "04:00", period: "PM", patient: "Ward 2 Round", task: "Shift Summary", priority: "Administrative", status: "Scheduled" },
                ]);
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Shift Roster</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">NURSE SARAH CONNOR • THURSDAY, JAN 22 2026</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Task
                        </button>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-12 animate-pulse space-y-4">
                            {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-2xl" />)}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {tasks.map((item, idx) => (
                                <div key={idx} className="flex group hover:bg-slate-50/50 transition-colors">
                                    <div className="w-32 p-8 border-r border-slate-50 flex flex-col items-center justify-center">
                                        <span className="text-lg font-black text-slate-900">{item.time}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{item.period}</span>
                                    </div>
                                    <div className="flex-1 p-6">
                                        <div className={`p-6 rounded-[32px] border transition-all ${item.status === 'Done' ? 'bg-slate-50/50 border-slate-100 opacity-60' : 'bg-olive-50/30 border-olive-100'
                                            }`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.status === 'Done' ? 'bg-slate-100 text-slate-400' : 'bg-olive-100 text-olive-700'
                                                        }`}>
                                                        <Activity size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900">{item.task}</h4>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{item.patient}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'Done' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-olive-100 text-olive-700 border-olive-200'
                                                    }`}>
                                                    {item.status}
                                                </span>
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
