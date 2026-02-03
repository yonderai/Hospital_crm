
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

import { useRouter } from "next/navigation";

// ... imports

export default function DoctorDashboard() {
    const router = useRouter(); // Hook for navigation
    const [stats, setStats] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('all'); // State for filtering
    const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
    const [selectedAptId, setSelectedAptId] = useState<string | null>(null);
    const [availability, setAvailability] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [surgeries, setSurgeries] = useState<any[]>([]); // New State

    const fetchData = async () => {
        try {
            const d = new Date();
            const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

            const [statsRes, appointmentsRes, availabilityRes, surgeryRes] = await Promise.all([
                fetch(`/api/doctor/stats?date=${today}`),
                fetch(`/api/appointments?date=${today}`),
                fetch(`/api/doctor/availability?date=${today}`),
                fetch(`/api/doctor/surgery`)
            ]);

            const statsData = await statsRes.ok ? await statsRes.json() : { stats: [] };

            if (availabilityRes.ok) {
                const availData = await availabilityRes.json();
                setAvailability(availData);
            }

            if (appointmentsRes.ok) {
                const apptData = await appointmentsRes.json();
                setAppointments(apptData);
            }

            if (surgeryRes.ok) {
                setSurgeries(await surgeryRes.json());
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

        // Auto-refresh every 30 seconds for real-time stats
        const interval = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    // Filter appointments based on active filter
    const filteredAppointments = appointments.filter(apt => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'completed') return apt.status === 'completed';
        return true;
    });

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

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header ... */}

                {/* GLOBAL SURGERY ALERT */}
                {(() => {
                    const now = new Date();
                    const upcomingSurgeries = surgeries?.filter((surgery: any) => {
                        if (surgery.status === 'cancelled' || surgery.status === 'completed') return false;

                        const surgeryDate = new Date(surgery.scheduledDate);
                        const [hours, minutes] = (surgery.startTime || '00:00').split(':');
                        surgeryDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

                        const timeDiff = surgeryDate.getTime() - now.getTime();
                        const hoursDiff = timeDiff / (1000 * 60 * 60);

                        // Show alert if surgery is within next 1 hour and hasn't started yet
                        return hoursDiff > 0 && hoursDiff <= 1;
                    }) || [];

                    if (upcomingSurgeries.length === 0) return null;

                    return (
                        <div className="bg-gradient-to-br from-red-600 via-red-500 to-orange-500 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden animate-pulse mb-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <AlertTriangle size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">⚠️ URGENT SURGERY ALERT</p>
                                        <h3 className="text-2xl font-black italic tracking-tight mt-1">Surgery Scheduled Within 1 Hour</h3>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {upcomingSurgeries.map((surgery: any, idx: number) => {
                                        const surgeryDate = new Date(surgery.scheduledDate);
                                        const [hours, minutes] = (surgery.startTime || '00:00').split(':');
                                        surgeryDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                                        const minutesUntil = Math.floor((surgeryDate.getTime() - now.getTime()) / (1000 * 60));

                                        return (
                                            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <p className="text-lg font-black uppercase italic">{surgery.procedureName}</p>
                                                        <p className="text-xs text-white/80 mt-1">OR Room: {surgery.orRoomId} • Patient: {surgery.patientId?.firstName} {surgery.patientId?.lastName}</p>
                                                    </div>
                                                    <div className="bg-white/20 px-4 py-2 rounded-2xl text-center">
                                                        <p className="text-2xl font-black">{minutesUntil}</p>
                                                        <p className="text-[9px] font-bold uppercase tracking-widest">Minutes</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-xs">
                                                    <div>
                                                        <p className="text-white/60 uppercase font-bold text-[9px] tracking-widest">Scheduled Time</p>
                                                        <p className="font-black mt-1">{surgery.startTime}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-white/60 uppercase font-bold text-[9px] tracking-widest">Status</p>
                                                        <p className="font-black mt-1 uppercase">{surgery.status}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, i) => {
                        const IconComponent = {
                            "Users": Users,
                            "Calendar": Calendar,
                            "Stethoscope": Stethoscope,
                            "Beaker": Beaker,
                            "AlertTriangle": AlertTriangle
                        }[stat.icon as string] || Activity;

                        // Determing active state for UI feedback
                        const isActive = (stat.title === "Today's Patients" && filterStatus === 'all') ||
                            (stat.title === "Patients Consulted" && filterStatus === 'completed');

                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (stat.title === "Today's Patients") setFilterStatus('all');
                                    if (stat.title === "Patients Consulted") setFilterStatus('completed');
                                    if (stat.title === "Patients Under Care") router.push('/doctor/patients');
                                }}
                                className={`bg-white p-6 rounded-[32px] border shadow-sm hover:shadow-md transition-all flex items-center gap-4 group cursor-pointer
                                    ${isActive ? 'border-olive-500 ring-2 ring-olive-100' : 'border-slate-100'}
                                `}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <IconComponent size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">{stat.title}</p>
                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Main Content Split */}
                {selectedPatient ? (
                    <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <ClinicalProfile
                            patient={selectedPatient}
                            appointmentId={selectedAptId || undefined}
                            onBack={() => {
                                setSelectedPatient(null);
                                setSelectedAptId(null);
                                fetchData();
                            }}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Left Box: Appointment List */}
                        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden min-h-[600px]">
                            {/* ... Existing Appointment List Code ... */}
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Today's Schedule</h3>
                                    <p className="text-xs text-slate-500 font-medium mt-1">
                                        {filterStatus === 'completed' ? 'Showing Consulted Patients' : 'Managed Appointments & Patient Queue'}
                                    </p>
                                </div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (confirm('Process past appointments as No-Show?')) {
                                            await fetch('/api/appointments/auto-cancel', { method: 'POST' });
                                            window.location.reload();
                                        }
                                    }}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                                >
                                    Auto-Process
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 space-y-4">
                                        {/* Loading Skeletons */}
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="h-16 bg-slate-50 animate-pulse rounded-2xl" />
                                        ))}
                                    </div>
                                ) : filteredAppointments.length === 0 ? (
                                    <div className="p-12 text-center">
                                        <p className="text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">No appointments found for this queue</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        {/* Table Header */}
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredAppointments.map((appt) => (
                                                <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => {
                                                    setSelectedPatient(appt.patientId);
                                                    setSelectedAptId(appt._id);
                                                }}>
                                                    <td className="p-4 border-b border-slate-50">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm
                                                                ${appt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                                    appt.status === 'cancelled' || appt.status === 'no-show' ? 'bg-red-50 text-red-400 decoration-slice line-through' :
                                                                        'bg-slate-100 text-slate-600'}
                                                            `}>
                                                                {formatTime(appt.startTime)}
                                                            </div>
                                                            <div>
                                                                <p className={`font-bold text-slate-900 ${['cancelled', 'no-show'].includes(appt.status) ? 'line-through text-slate-400' : ''}`}>
                                                                    {appt.patientId?.firstName || 'Unknown'} {appt.patientId?.lastName || 'Patient'}
                                                                </p>
                                                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{appt.type}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 border-b border-slate-50 text-right">
                                                        {getDueSoonText(appt)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Right Box: Quick Actions & Availability */}
                        <div className="flex flex-col gap-8">
                            {/* Next Scheduled Patient Card */}
                            {(() => {
                                // Find next upcoming appointment
                                const now = new Date();
                                const upcomingAppointments = appointments
                                    .filter(apt =>
                                        apt.status !== 'completed' &&
                                        apt.status !== 'cancelled' &&
                                        apt.status !== 'no-show' &&
                                        new Date(apt.startTime) > new Date(now.getTime() - 30 * 60000) // Include appointments that started up to 30 min ago
                                    )
                                    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

                                const nextAppointment = upcomingAppointments[0];

                                // Check if Start Session should be enabled (within 15 minutes of start time)
                                const isSessionTime = nextAppointment ? (() => {
                                    const startTime = new Date(nextAppointment.startTime);
                                    const diffMs = startTime.getTime() - now.getTime();
                                    const diffMins = Math.floor(diffMs / 60000);
                                    return diffMins <= 15 && diffMins >= -30; // 15 min before to 30 min after
                                })() : false;

                                const handleCancelAppointment = async () => {
                                    if (!nextAppointment) return;
                                    if (confirm(`Cancel appointment with ${nextAppointment.patientId?.firstName} ${nextAppointment.patientId?.lastName}?`)) {
                                        try {
                                            const res = await fetch(`/api/appointments/${nextAppointment._id}`, {
                                                method: 'PATCH',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ status: 'cancelled' })
                                            });
                                            if (res.ok) {
                                                fetchData(); // Refresh dashboard
                                            }
                                        } catch (error) {
                                            console.error('Failed to cancel appointment:', error);
                                        }
                                    }
                                };

                                return (
                                    <div className="bg-gradient-to-br from-olive-600 to-olive-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                        <h4 className="text-xs font-black uppercase tracking-widest mb-6 relative z-10 text-olive-200">Next Scheduled Patient</h4>

                                        {nextAppointment ? (
                                            <div className="space-y-6 relative z-10">
                                                {/* Patient Info */}
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-xs font-bold text-olive-200 uppercase tracking-wider mb-1">Patient</p>
                                                        <p className="text-2xl font-black text-white">
                                                            {nextAppointment.patientId?.firstName} {nextAppointment.patientId?.lastName}
                                                        </p>
                                                        <p className="text-sm text-olive-100 font-medium mt-1">
                                                            MRN: {nextAppointment.patientId?.mrn}
                                                        </p>
                                                    </div>

                                                    <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                                                        <p className="text-xs font-bold text-olive-200 uppercase tracking-wider mb-1">Scheduled Time</p>
                                                        <p className="text-xl font-black text-white">
                                                            {formatTime(nextAppointment.startTime)}
                                                        </p>
                                                        <p className="text-xs text-olive-100 mt-1">
                                                            {nextAppointment.type} • {nextAppointment.reason}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="space-y-3">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedPatient(nextAppointment.patientId);
                                                            setSelectedAptId(nextAppointment._id);
                                                        }}
                                                        disabled={!isSessionTime}
                                                        className={`w-full py-4 rounded-2xl font-bold uppercase tracking-wider transition-all shadow-lg
                                                            ${isSessionTime
                                                                ? 'bg-white text-olive-700 hover:bg-olive-50 hover:scale-[1.02]'
                                                                : 'bg-white/20 text-white/50 cursor-not-allowed'
                                                            }`}
                                                        title={!isSessionTime ? 'Session can be started 15 minutes before scheduled time' : 'Start consultation'}
                                                    >
                                                        {isSessionTime ? '▶ Start Session' : '🔒 Session Locked'}
                                                    </button>

                                                    <button
                                                        onClick={handleCancelAppointment}
                                                        className="w-full py-3 rounded-2xl font-bold uppercase tracking-wider transition-all bg-red-500/20 text-red-100 border border-red-400/30 hover:bg-red-500/30 hover:border-red-400/50"
                                                    >
                                                        Cancel Appointment
                                                    </button>
                                                </div>

                                                {/* Time indicator */}
                                                <div className="text-center">
                                                    <p className="text-xs text-olive-200">
                                                        {getDueSoonText(nextAppointment)}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-4 relative z-10 text-center py-8">
                                                <Calendar size={48} className="mx-auto text-olive-200 opacity-50" />
                                                <div>
                                                    <p className="text-lg font-bold text-white mb-2">No Appointments</p>
                                                    <p className="text-sm text-olive-200">No upcoming appointments scheduled for today</p>
                                                </div>
                                            </div>
                                        )}

                                        <Clock size={180} className="absolute bottom-[-15%] right-[-15%] text-white/5" />
                                    </div>
                                );
                            })()}

                            {/* Availability Overview Card */}
                            {availability && (
                                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Availability Overview</h4>
                                        <Clock className="text-olive-500" size={20} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="bg-slate-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase">Total</p>
                                            <p className="text-xl font-black text-slate-900">{availability.totalHours}h</p>
                                        </div>
                                        <div className="bg-red-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] text-red-400 font-bold uppercase">Booked</p>
                                            <p className="text-xl font-black text-red-600">{availability.bookedSlots}</p>
                                        </div>
                                        <div className="bg-green-50 rounded-2xl p-4 text-center">
                                            <p className="text-[10px] text-green-500 font-bold uppercase">Free</p>
                                            <p className="text-xl font-black text-green-600">{availability.freeSlots}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-3">Time Slots</p>
                                        <div className="grid grid-cols-3 gap-2">
                                            {availability.slots.map((slot: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className={`
                                                        py-2 px-1 rounded-xl text-center text-[10px] font-bold uppercase tracking-wide border
                                                        ${slot.status === 'free'
                                                            ? 'bg-white border-green-200 text-green-700 shadow-sm'
                                                            : 'bg-slate-100 border-transparent text-slate-400 cursor-not-allowed decoration-slice'}
                                                    `}
                                                >
                                                    {slot.time}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

