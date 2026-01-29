"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    Clock,
    User,
    MapPin,
    ArrowLeft,
    ArrowRight,
    Users,
    Sun,
    Moon,
    Coffee
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function NurseRoster() {
    const { data: session } = useSession();
    const [roster, setRoster] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mocking a duty roster for the week
        setTimeout(() => {
            setRoster([
                { day: "Monday", date: "Jan 19", shift: "Morning", hours: "07:00 - 15:00", unit: "Unit 7G (Ward)", status: "Completed" },
                { day: "Tuesday", date: "Jan 20", shift: "Morning", hours: "07:00 - 15:00", unit: "Unit 7G (Ward)", status: "Completed" },
                { day: "Wednesday", date: "Jan 21", shift: "Night", hours: "23:00 - 07:00", unit: "ICU Node B", status: "Completed" },
                { day: "Thursday", date: "Jan 22", shift: "Morning", hours: "07:00 - 15:00", unit: "Unit 7G (Ward)", status: "Active" },
                { day: "Friday", date: "Jan 23", shift: "Morning", hours: "07:00 - 15:00", unit: "Unit 7G (Ward)", status: "Upcoming" },
                { day: "Saturday", date: "Jan 24", shift: "Off", hours: "-", unit: "-", status: "Rest" },
                { day: "Sunday", date: "Jan 25", shift: "Evening", hours: "15:00 - 23:00", unit: "Emergency Node", status: "Upcoming" },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Duty Roster Console</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            STAFFING LOGISTICS • {nurseName} • UNIT 7G
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <div className="flex items-center gap-6">
                                    <button className="p-3 bg-white border border-slate-100 rounded-xl hover:border-olive-400 transition-all shadow-sm">
                                        <ArrowLeft size={18} className="text-slate-400" />
                                    </button>
                                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Current Week Stream</h3>
                                    <button className="p-3 bg-white border border-slate-100 rounded-xl hover:border-olive-400 transition-all shadow-sm">
                                        <ArrowRight size={18} className="text-slate-400" />
                                    </button>
                                </div>
                                <span className="px-4 py-1.5 bg-olive-50 border border-olive-100 rounded-xl text-[10px] font-black text-olive-600 uppercase tracking-widest">
                                    Total Hours: 40 hrs
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                            <th className="px-10 py-6">Day / Chrono</th>
                                            <th className="px-10 py-6">Shift Matrix</th>
                                            <th className="px-10 py-6">Clinical Unit</th>
                                            <th className="px-10 py-6 text-center">Protocol Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loading ? (
                                            <tr><td colSpan={4} className="h-96 animate-pulse bg-slate-50/30" /></tr>
                                        ) : roster.map((r, i) => (
                                            <tr key={i} className={`group transition-all ${r.status === 'Active' ? 'bg-olive-50/30' : 'hover:bg-slate-50/50'}`}>
                                                <td className="px-10 py-8">
                                                    <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{r.day}</p>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{r.date}</p>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        {r.shift === 'Morning' && <Sun size={18} className="text-orange-400" />}
                                                        {r.shift === 'Night' && <Moon size={18} className="text-blue-400" />}
                                                        {r.shift === 'Evening' && <Clock size={18} className="text-teal-400" />}
                                                        {r.shift === 'Off' && <Coffee size={18} className="text-slate-300" />}
                                                        <div>
                                                            <p className="text-xs font-black text-slate-700 uppercase italic">{r.shift}</p>
                                                            <p className="text-[10px] text-slate-400 font-bold">{r.hours}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <MapPin size={14} className="text-slate-300" />
                                                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{r.unit}</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-center">
                                                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${r.status === 'Active' ? 'bg-olive-700 text-white border-olive-600' :
                                                            r.status === 'Completed' ? 'bg-slate-100 text-slate-400 border-slate-200' :
                                                                r.status === 'Rest' ? 'bg-slate-50 text-slate-300 border-slate-100' :
                                                                    'bg-white text-slate-500 border-slate-200'
                                                        }`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[48px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-2xl font-black italic uppercase italic tracking-tight">Team Sync</h4>
                                <div className="space-y-4">
                                    {[
                                        { name: "John Smith", role: "Co-Nurse", shift: "Morning" },
                                        { name: "Alice Brown", role: "Assoc. Nurse", shift: "Morning" },
                                    ].map((t, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-xs">
                                                {t.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black uppercase italic">{t.name}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase">{t.shift}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Users className="absolute bottom-[-10%] right-[-10%] text-white/5 group-hover:scale-110 transition-transform duration-700" size={180} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Leave Requests</h4>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-bold text-slate-400 uppercase text-center italic">
                                    No pending requests
                                </div>
                                <button className="w-full py-4 bg-olive-700 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all active:scale-95">
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
