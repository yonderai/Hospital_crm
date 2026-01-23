
"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";
import {
    Activity,
    Calendar,
    FileText,
    Heart,
    Phone,
    Shield,
    Clock,
    CreditCard
} from "lucide-react";

export default function PatientDashboard() {
    const { data: session }: any = useSession();
    const [vitals, setVitals] = useState<any[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.patientProfileId) {
            fetchPatientData(session.user.patientProfileId);
        }
    }, [session]);

    const fetchPatientData = async (patientId: string) => {
        setLoading(true);
        try {
            // Parallel fetch for dashboard widgets
            const [vitalsRes, apptRes, invRes] = await Promise.all([
                fetch(`/api/vitals?patientId=${patientId}`),
                fetch(`/api/appointments?patientId=${patientId}`), // Assuming API supports filter
                fetch(`/api/invoices?patientId=${patientId}`)   // Assuming API supports filter
            ]);

            const vitalsData = await vitalsRes.json();
            const apptData = await apptRes.json();
            const invData = await invRes.json();

            if (vitalsData.records) setVitals(vitalsData.records.slice(0, 3));
            if (apptData.appointments) setAppointments(apptData.appointments);
            if (invData.invoices) setInvoices(invData.invoices);
        } catch (e) {
            console.error("Error fetching patient data:", e);
        } finally {
            setLoading(false);
        }
    };

    if (!session) return <div>Loading session...</div>;

    const patientName = session.user?.name || "Patient";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Health</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">WELCOME BACK, {patientName}</p>
                    </div>
                </div>

                {/* Vitals Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-red-50 text-red-500 rounded-2xl"><Heart size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Latest Heart Rate</p>
                            <p className="text-2xl font-black text-slate-900">{vitals[0]?.data?.hr || "--"} <span className="text-sm font-medium text-slate-400">bpm</span></p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl"><Activity size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Pressure</p>
                            <p className="text-2xl font-black text-slate-900">{vitals[0]?.data?.bp || "--"}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-orange-50 text-orange-500 rounded-2xl"><Activity size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temperature</p>
                            <p className="text-2xl font-black text-slate-900">{vitals[0]?.data?.temp || "--"}°F</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-500 rounded-2xl"><Shield size={24} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Insurance Status</p>
                            <p className="text-lg font-black text-slate-900">Active</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Appointments */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Upcoming Appointments</h3>
                            <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em] hover:text-olive-700">Request New</button>
                        </div>
                        <div className="space-y-4">
                            {loading ? <p className="text-slate-400 text-sm">Loading appointments...</p> :
                                appointments.length === 0 ? <p className="text-slate-400 text-sm">No upcoming appointments.</p> :
                                    appointments.map((appt, i) => (
                                        <div key={i} className="flex items-center gap-6 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                                            <div className="p-4 bg-white rounded-2xl text-slate-900 font-bold border border-slate-100 text-center min-w-[80px]">
                                                <div className="text-xs uppercase text-slate-400">{new Date(appt.date).toLocaleDateString([], { month: 'short' })}</div>
                                                <div className="text-2xl">{new Date(appt.date).getDate()}</div>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-base font-bold text-slate-900">Consultation with {appt.doctorId?.firstName} {appt.doctorId?.lastName}</p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">{appt.type} • {appt.time}</p>
                                            </div>
                                            <div className={`px - 4 py - 2 rounded - full text - [10px] font - black uppercase tracking - widest ${appt.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                                {appt.status}
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    </div>

                    {/* Billing Summary */}
                    <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xl font-black tracking-tight">Billing Overview</h4>
                                <CreditCard className="text-olive-400" size={24} />
                            </div>

                            <div className="space-y-4">
                                {invoices.length === 0 ? <p className="text-slate-400 text-xs">No outstanding bills.</p> :
                                    invoices.slice(0, 3).map((inv, i) => (
                                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                                            <div>
                                                <p className="text-sm font-bold">INV #{inv.invoiceNumber}</p>
                                                <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-black">{new Date(inv.dueDate).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-white">${inv.balanceDue}</p>
                                                <p className={`text - [9px] mt - 0.5 uppercase tracking - widest font - black ${inv.status === 'paid' ? 'text-green-400' : 'text-red-400'}`}>{inv.status}</p>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>

                            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">
                                View All Statements
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
