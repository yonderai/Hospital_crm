"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Users,
    Bed,
    AlertCircle,
    CheckCircle2,
    TrendingUp,
    Clock,
    UserPlus,
    Stethoscope
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function WardManagement() {
    const { data: session } = useSession();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWardData = async () => {
            try {
                const res = await fetch("/api/nurse/dashboard-data");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                }
            } catch (error) {
                console.error("Error fetching ward data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWardData();
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";
    const sector = (session?.user as any)?.department || "Sector 7G";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Ward Logistics Center</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            FLIGHT OPERATIONS • {sector} • {nurseName}
                        </p>
                    </div>
                </div>

                {/* Logistics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Capacity</p>
                            <h4 className="text-4xl font-black text-slate-900 mb-2">48 BEDS</h4>
                            <p className="text-[10px] font-bold text-olive-600 uppercase">92% Occupancy Rate</p>
                        </div>
                        <Bed className="absolute -bottom-4 -right-4 text-slate-50 group-hover:scale-110 transition-transform duration-700" size={120} />
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Pending Admissions</p>
                            <h4 className="text-4xl font-black text-slate-900 mb-2">04 NEW</h4>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">Incoming from ER</p>
                        </div>
                        <UserPlus className="absolute -bottom-4 -right-4 text-slate-50 group-hover:scale-110 transition-transform duration-700" size={120} />
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group border-l-4 border-l-red-500">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vitals Critical</p>
                            <h4 className="text-4xl font-black text-red-600 mb-2">{data?.stats?.vitalsPending || 0} DUE</h4>
                            <p className="text-[10px] font-bold text-red-400 uppercase">Immediate Nurse Check</p>
                        </div>
                        <Activity className="absolute -bottom-4 -right-4 text-slate-50 group-hover:scale-110 transition-transform duration-700" size={120} />
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Operational Status</p>
                            <h4 className="text-2xl font-black tracking-tight uppercase italic mb-1">OPT-ALPHA</h4>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Normal Workflow</p>
                        </div>
                        <TrendingUp className="absolute -bottom-4 -right-4 text-white/5 group-hover:scale-110 transition-transform duration-700" size={140} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Ward Activity Stream */}
                    <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-10 border-b border-slate-50 bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Recent Floor Activity</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Last 60 Minutes</p>
                        </div>
                        <div className="p-10 space-y-8">
                            {[
                                { time: "14:22", action: "Medication Administered", patient: "Room 402-A", status: "success" },
                                { time: "14:15", action: "Vital Signs Recorded", patient: "Room 408-B", status: "success" },
                                { time: "13:58", action: "Patient Transfer-In", patient: "Bed 412 (from ER)", status: "info" },
                                { time: "13:45", action: "Clinical Note Update", patient: "Room 401-C", status: "success" },
                            ].map((log, i) => (
                                <div key={i} className="flex gap-6 items-start group">
                                    <div className="text-[10px] font-black text-slate-300 w-12 pt-1">{log.time}</div>
                                    <div className="relative">
                                        <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 relative ${log.status === 'success' ? 'bg-olive-500' : 'bg-blue-500'
                                            }`} />
                                        {i !== 3 && <div className="absolute top-3 left-[5px] w-[2px] h-12 bg-slate-100 group-last:hidden" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 tracking-tight uppercase italic">{log.action}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.patient}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resources & Rounds */}
                    <div className="space-y-10">
                        <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm relative overflow-hidden">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase mb-8">Personnel On-Floor</h3>
                            <div className="space-y-4">
                                {[
                                    { name: "Sarah Connor", role: "Head Nurse", status: "Active" },
                                    { name: "John Smith", role: "Floor Nurse", status: "Break" },
                                    { name: "Alice Brown", role: "Nurse Asst.", status: "Active" },
                                ].map((p, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-olive-700 text-xs">
                                                {p.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 italic uppercase">{p.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{p.role}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md ${p.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Stethoscope className="absolute bottom-[-10%] right-[-5%] text-slate-50/50 rotate-12" size={200} />
                        </div>

                        <div className="bg-white rounded-[48px] border border-slate-100 p-10 shadow-sm">
                            <h3 className="text-xl font-black text-slate-900 italic uppercase mb-8">Quick Dispatch</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="p-6 bg-olive-700 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all flex flex-col items-center gap-4">
                                    <AlertCircle size={24} /> Register Emergency
                                </button>
                                <button className="p-6 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all flex flex-col items-center gap-4">
                                    <Clock size={24} /> Shift Handover
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
