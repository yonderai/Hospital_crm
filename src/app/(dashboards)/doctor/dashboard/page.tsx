
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ClinicalProfile from "@/components/doctor/ClinicalProfile";
import {
    Users,
    Calendar,
    Beaker,
    AlertTriangle,
    Plus,
    Activity,
    Search,
    Stethoscope,
    Pill,
    FileText,
    Clock
} from "lucide-react";

interface Appointment {
    _id: string;
    appointmentId: string;
    patientId: {
        _id: string;
        firstName: string;
        lastName: string;
        mrn: string;
        contact: { phone: string };
    };
    startTime: string;
    endTime: string;
    status: string;
    type: string;
    reason: string;
}

export default function DoctorDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];
            const [statsRes, appointmentsRes] = await Promise.all([
                fetch('/api/doctor/stats'),
                fetch(`/api/appointments?date=${today}`)
            ]);

            const statsData = await statsRes.ok ? await statsRes.json() : { stats: [] };

            if (appointmentsRes.ok) {
                const apptData = await appointmentsRes.json();
                setAppointments(apptData);
            }

            setStats(statsData.stats || []);
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getDueSoonText = (appt: Appointment) => {
        if (appt.status === "completed") return <span className="text-green-600 font-bold uppercase">Completed</span>;
        if (appt.status === "cancelled") return <span className="text-red-400 font-bold uppercase">Cancelled</span>;

        const startTime = appt.startTime;
        const now = new Date();
        const start = new Date(startTime);
        const diffMs = start.getTime() - now.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 0) {
            if (diffMins > -30) return <span className="text-orange-600 font-bold">In Progress</span>;
            return <span className="text-slate-400">Past</span>;
        }
        if (diffMins < 60) {
            return <span className="text-red-600 font-bold animate-pulse">Starts in {diffMins}m</span>;
        }
        if (diffMins < 1440) {
            return <span className="text-olive-600 font-bold">In {Math.floor(diffMins / 60)}h</span>;
        }
        return <span className="text-slate-500">Scheduled</span>;
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // If a patient is selected, show Clinical Profile
    if (selectedPatient) {
        return (
            <DashboardLayout>
                <ClinicalProfile
                    patient={selectedPatient}
                    appointmentId={selectedAptId || undefined}
                    onBack={() => {
                        setSelectedPatient(null);
                        setSelectedAptId(null);
                        fetchData();
                    }}
                />
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Physician Workstation</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. HOUSE • DIAGNOSTIC MEDICINE</p>
                    </div>
                </div>

                {/* Main Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Box: Appointment List */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden min-h-[600px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Schedule</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Managed Appointments & Patient Queue</p>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input placeholder="Search Patient..." className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-olive-500" />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
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
                                    <h4 className="text-lg font-bold text-slate-900 uppercase">no appointment</h4>
                                    <p className="text-slate-500 text-sm mt-1">You have a clear schedule for today.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Timing</th>
                                            <th className="px-8 py-4">Patient</th>
                                            <th className="px-8 py-4">Type</th>
                                            <th className="px-8 py-4">Due Status</th>
                                            <th className="px-8 py-4 text-right pr-12">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {appointments.map((appt) => (
                                            <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => {
                                                setSelectedPatient(appt.patientId);
                                                setSelectedAptId(appt._id);
                                            }}>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-slate-400" />
                                                        <span className="text-sm font-bold text-slate-700">{formatTime(appt.startTime)}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-olive-100 flex items-center justify-center text-olive-700 font-black text-xs uppercase border-2 border-white shadow-sm">
                                                            {appt.patientId?.firstName?.[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                                                {appt.patientId?.firstName} {appt.patientId?.lastName}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 font-medium">MRN: {appt.patientId?.mrn}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold uppercase tracking-wide">
                                                        {appt.type}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="text-xs font-semibold">
                                                        {getDueSoonText(appt)}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right pr-6">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(appt.patientId);
                                                            setSelectedAptId(appt._id);
                                                        }}
                                                        className="text-olive-600 hover:text-olive-800 font-bold text-xs uppercase flex items-center justify-end gap-1"
                                                    >
                                                        Open <Stethoscope size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Right Box: Quick Actions */}
                    <div className="flex flex-col gap-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight leading-tight">Next Patient</h4>
                                {appointments.filter(a => !['completed', 'cancelled', 'no-show'].includes(a.status)).length > 0 ? (
                                    <>
                                        <p className="text-sm text-slate-400">
                                            Your next appointment is with <span className="text-white font-bold">
                                                {appointments.filter(a => !['completed', 'cancelled', 'no-show'].includes(a.status))[0].patientId?.firstName} {appointments.filter(a => !['completed', 'cancelled', 'no-show'].includes(a.status))[0].patientId?.lastName}
                                            </span> at {formatTime(appointments.filter(a => !['completed', 'cancelled', 'no-show'].includes(a.status))[0].startTime)}.
                                        </p>
                                        <div className="pt-4">
                                            <button
                                                onClick={() => {
                                                    const nextAppt = appointments.filter(a => !['completed', 'cancelled', 'no-show'].includes(a.status))[0];
                                                    setSelectedPatient(nextAppt.patientId);
                                                    setSelectedAptId(nextAppt._id);
                                                }}
                                                className="w-full py-4 bg-olive-500 hover:bg-olive-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-olive-500/20"
                                            >
                                                Start Session
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-sm text-slate-400 uppercase font-black">
                                        no appointment
                                    </p>
                                )}
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
