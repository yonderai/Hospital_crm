"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Clock, User, MapPin, AlertTriangle, CheckCircle, Calendar, Users, Timer } from "lucide-react";

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
                    <div className="grid grid-cols-1 gap-8">
                        {appointments.length === 0 ? (
                            <div className="p-12 text-center bg-slate-50 rounded-[40px] border border-slate-100">
                                <p className="text-slate-400 font-bold">No appointments scheduled for today.</p>
                            </div>
                        ) : (
                            appointments.map((apt, idx) => {
                                const aptDate = new Date(apt.startTime);
                                const timeStr = aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={idx} className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                                        {/* Header Section */}
                                        <div className={`p-8 border-b border-slate-100 ${apt.id === alert?.id ? 'bg-red-50' : 'bg-slate-50'}`}>
                                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                {/* Time Column */}
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-4 rounded-2xl ${apt.id === alert?.id ? 'bg-red-100 text-red-600' : 'bg-olive-100 text-olive-600'}`}>
                                                        <Clock size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{timeStr}</p>
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Appointment</p>
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
                                                <div className="text-right min-w-[180px]">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-2 ${apt.status === 'checked-in' ? 'bg-blue-50 text-blue-600' :
                                                        apt.status === 'completed' ? 'bg-green-50 text-green-600' :
                                                            'bg-slate-100 text-slate-500'
                                                        }`}>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{apt.status}</span>
                                                    </div>

                                                    <div className="flex items-center justify-end gap-2 text-xs font-bold text-slate-400">
                                                        <Users size={14} />
                                                        <span>Position: <span className="text-slate-900 text-xl font-black">{apt.queuePosition}</span> of {apt.totalInQueue}</span>
                                                    </div>

                                                    {apt.estimatedWaitTime > 0 && (
                                                        <div className="flex items-center justify-end gap-2 text-xs font-bold text-olive-600 mt-1">
                                                            <Timer size={14} />
                                                            <span>~{apt.estimatedWaitTime} mins wait</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Queue Display Section */}
                                        {apt.patientsAhead && apt.patientsAhead.length > 0 && (
                                            <div className="p-8">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                        <Users size={20} />
                                                    </div>
                                                    <div>
                                                        <h5 className="text-lg font-black text-slate-900">Patients Ahead of You</h5>
                                                        <p className="text-xs text-slate-500 font-bold">{apt.patientsAheadCount} {apt.patientsAheadCount === 1 ? 'patient' : 'patients'} in queue before your turn</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {apt.patientsAhead.map((patient: any, pIdx: number) => {
                                                        const patientTime = new Date(patient.time);
                                                        const patientTimeStr = patientTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                                                        return (
                                                            <div key={pIdx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all">
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                                                        <span className="text-sm font-black text-slate-900">{pIdx + 1}</span>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-black text-slate-900">{patient.name}</p>
                                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRN: {patient.mrn}</p>
                                                                    </div>
                                                                </div>

                                                                <div className="text-right">
                                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                                        <Clock size={12} />
                                                                        <span>{patientTimeStr}</span>
                                                                    </div>
                                                                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg mt-1 text-[10px] font-black uppercase tracking-widest ${patient.status === 'checked-in' ? 'bg-blue-100 text-blue-600' :
                                                                        patient.status === 'in-progress' ? 'bg-green-100 text-green-600' :
                                                                            'bg-slate-200 text-slate-600'
                                                                        }`}>
                                                                        {patient.status}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {/* Your Turn Indicator */}
                                                <div className="mt-4 p-6 bg-gradient-to-r from-olive-50 to-green-50 rounded-2xl border-2 border-olive-200 border-dashed">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-olive-500 rounded-xl flex items-center justify-center">
                                                            <User className="text-white" size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-base font-black text-olive-900">YOUR TURN</p>
                                                            <p className="text-xs font-bold text-olive-600">You'll be called after the above patients</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* No Queue - You're First */}
                                        {(!apt.patientsAhead || apt.patientsAhead.length === 0) && (
                                            <div className="p-8">
                                                <div className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 text-center">
                                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                                        <CheckCircle className="text-white" size={32} />
                                                    </div>
                                                    <h5 className="text-xl font-black text-green-900 mb-2">You're First in Line!</h5>
                                                    <p className="text-sm font-bold text-green-600">No patients ahead of you. Please be ready at your appointment time.</p>
                                                </div>
                                            </div>
                                        )}
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
