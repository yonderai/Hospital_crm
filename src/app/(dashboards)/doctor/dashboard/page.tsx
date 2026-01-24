
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Calendar,
    Beaker,
    AlertTriangle,
    Plus,
    FileText,
    Pill,
    ArrowUpRight,
    Activity,
    Clock
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
    Calendar,
    Users,
    Beaker,
    AlertTriangle
};

interface Appointment {
    appointmentId: string;
    patientId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    startTime: string;
    status: string;
    reason: string;
    type: string;
}

export default function DoctorDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch stats (mock or existing API) and REAL appointments
                const [statsRes, appointmentsRes] = await Promise.all([
                    fetch('/api/doctor/stats'), // Existing mock endpoint
                    fetch('/api/appointments')  // Our new real endpoint
                ]);

                const statsData = await statsRes.ok ? await statsRes.json() : { stats: [] };

                if (appointmentsRes.ok) {
                    const aptData = await appointmentsRes.json();
                    setAppointments(aptData);
                }

                setStats(statsData.stats || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Format time helper
    const formatTime = (isoString: string) => {
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Physician Workstation</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. GREGORY HOUSE • DIAGNOSTIC MEDICINE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Consultation
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-24"></div>
                        ))
                    ) : (
                        stats.map((s, i) => {
                            const Icon = ICON_MAP[s.icon] || Activity;
                            return (
                                <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                                    </div>
                                    <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                        <Icon size={24} />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Box: Patient Queue (Now showing Real Appointments) */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Appointment Schedule</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Today's Patient List</p>
                            </div>
                            <span className="text-[10px] font-black text-olive-600 bg-olive-50 px-3 py-1 rounded-full uppercase tracking-widest border border-olive-100 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-olive-500 animate-pulse"></span>
                                Live Updates
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto min-h-[400px]">
                            {loading ? (
                                <div className="p-8 space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>
                                    ))}
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                        <Calendar size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900">No appointments today</h4>
                                    <p className="text-slate-500 text-sm mt-1">Your schedule is currently clear.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Patient</th>
                                            <th className="px-8 py-4">Time</th>
                                            <th className="px-8 py-4">Type</th>
                                            <th className="px-8 py-4">Reason</th>
                                            <th className="px-8 py-4 text-right pr-12">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointments.map((apt) => (
                                            <tr key={apt.appointmentId} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-black text-xs uppercase border-2 border-white shadow-sm">
                                                            {apt.patientId?.firstName?.[0] || "P"}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                                                {apt.patientId?.firstName} {apt.patientId?.lastName}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-medium">#{apt.appointmentId.slice(-6)}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <Clock size={14} className="text-olive-500" />
                                                        <span className="text-xs font-bold">{formatTime(apt.startTime)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[9px] font-black px-2 py-1 rounded-lg uppercase border bg-slate-50 text-slate-600 border-slate-100 tracking-wide">
                                                        {apt.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-xs text-slate-600 font-medium max-w-[200px] truncate" title={apt.reason}>
                                                    {apt.reason}
                                                </td>
                                                <td className="px-8 py-5 text-right pr-6">
                                                    <button className="p-2 text-slate-400 hover:text-olive-700 bg-slate-50 rounded-lg border border-slate-200 group-hover:bg-white group-hover:shadow-md transition-all">
                                                        <ArrowUpRight size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Right Box: Quick Actions & Alerts */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight leading-tight">Clinical Decision Support</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <FileText className="text-olive-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-white">Review Protocols</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">Updated oncology protocols available for V-03.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <AlertTriangle className="text-red-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-red-100 underline decoration-red-500/30">Action Required</p>
                                            <p className="text-[10px] text-red-300 mt-0.5">Critical Lab: Jane Doe (Potassium 6.2 mmol/L)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Quick Directives</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <QuickAction icon={Pill} label="Prescribe" color="bg-orange-50 text-orange-600" />
                                <QuickAction icon={Beaker} label="Order Lab" color="bg-olive-100 text-olive-700" />
                                <QuickAction icon={Users} label="Referral" color="bg-olive-50 text-olive-600" />
                                <QuickAction icon={Calendar} label="Follow-up" color="bg-olive-50 text-olive-500" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function QuickAction({ icon: Icon, label, color }: any) {
    return (
        <button className="flex flex-col items-center gap-3 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:shadow-lg hover:border-olive-200 transition-all font-sans group">
            <div className={`p-4 rounded-2xl ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{label}</span>
        </button>
    );
}
