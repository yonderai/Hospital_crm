"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Clock, User, MapPin, AlertTriangle, CheckCircle, Calendar } from "lucide-react";

export default function PatientQueueStatusPage() {
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [alert, setAlert] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/patient/queue');
                const json = await res.json();
                const data = json.data || [];
                setAppointments(data);

                // Check for upcoming appointments (< 30 mins)
                const now = new Date();
                const upcoming = data.find((apt: any) => {
                    const time = new Date(apt.startTime);
                    const diff = (time.getTime() - now.getTime()) / 60000; // diff in minutes
                    return diff > 0 && diff <= 30 && apt.status !== 'completed' && apt.status !== 'cancelled';
                });

                setAlert(upcoming || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Refresh every minute to update times/alerts
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">QUEUE STATUS</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">LIVE TRACKING</p>
                </div>

                {/* ALERT SECTION */}
                {alert && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-start gap-4 animate-pulse">
                        <div className="p-3 bg-red-100 text-red-600 rounded-full">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-red-700">Upcoming Appointment Alert!</h3>
                            <p className="text-sm font-bold text-red-600 mt-1">
                                You have an appointment with <span className="underline">{alert.doctor}</span> in less than 30 minutes.
                            </p>
                            <p className="text-xs font-bold text-red-500 mt-2 uppercase tracking-wide">
                                Please proceed to {alert.department} Waiting Area.
                            </p>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2].map(i => <div key={i} className="h-32 bg-slate-50 rounded-[32px] animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {appointments.length === 0 ? (
                            <div className="p-12 text-center bg-slate-50 rounded-[40px] border border-slate-100">
                                <p className="text-slate-400 font-bold">No appointments scheduled for today.</p>
                            </div>
                        ) : (
                            appointments.map((apt, idx) => {
                                const aptDate = new Date(apt.startTime);
                                const timeStr = aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={idx} className={`relative p-8 rounded-[32px] border transition-all ${apt.id === alert?.id ? 'bg-white border-red-200 shadow-xl shadow-red-500/10' : 'bg-white border-slate-100 shadow-sm'
                                        }`}>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            {/* Time Column */}
                                            <div className="flex items-center gap-4">
                                                <div className={`p-4 rounded-2xl ${apt.id === alert?.id ? 'bg-red-50 text-red-600' : 'bg-olive-50 text-olive-600'}`}>
                                                    <Clock size={24} />
                                                </div>
                                                <div>
                                                    <p className="text-3xl font-black text-slate-900 tracking-tight">{timeStr}</p>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Today</p>
                                                </div>
                                            </div>

                                            {/* Details Column */}
                                            <div className="flex-1">
                                                <h4 className="text-xl font-black text-slate-900">{apt.doctor}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <MapPin size={14} className="text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{apt.department} Wing</span>
                                                </div>
                                            </div>

                                            {/* Status Column */}
                                            <div className="text-right min-w-[140px]">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2 ${apt.status === 'checked-in' ? 'bg-blue-50 text-blue-600' :
                                                    apt.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                        'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{apt.status}</span>
                                                </div>

                                                {apt.queuePosition && (
                                                    <p className="text-xs font-bold text-slate-400">
                                                        Position: <span className="text-slate-900 text-lg">{apt.queuePosition}</span> in line
                                                    </p>
                                                )}
                                                {apt.id === alert?.id && (
                                                    <p className="text-xs font-bold text-red-500 animate-pulse">Starting Soon</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
