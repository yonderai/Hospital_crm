"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    MessageSquare,
    FileText,
    Wallet,
    Activity,
    Stethoscope,
    CheckCircle2,
    Clock,
    Play
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export default function PatientDashboard() {
    const { data: session } = useSession();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [billing, setBilling] = useState<any>(null);
    const [todayAlert, setTodayAlert] = useState<any>(null);
    const [admission, setAdmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [apptRes, billRes, queueRes, admRes] = await Promise.all([
                    fetch('/api/appointments'),
                    fetch('/api/patient/billing'),
                    fetch('/api/patient/queue'),
                    fetch('/api/patient/admission')
                ]);

                if (apptRes.ok) {
                    const data = await apptRes.json();
                    setAppointments(data.filter((a: any) => new Date(a.date) >= new Date()).slice(0, 3));
                }

                if (billRes.ok) {
                    const data = await billRes.json();
                    setBilling(data);
                }

                if (queueRes.ok) {
                    const json = await queueRes.json();
                    const queueData = json.data || [];
                    const now = new Date();
                    const nextToday = queueData.find((a: any) => {
                        const time = new Date(a.startTime);
                        return time > now && a.status !== 'completed' && a.status !== 'cancelled';
                    });
                    setTodayAlert(nextToday || null);
                }

                if (admRes && admRes.ok) {
                    const data = await admRes.json();
                    setAdmission(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const nextAppt = appointments[0];
    const balance = billing?.stats?.balanceDue || 0;
    const userFirstName = session?.user?.name?.split(' ')[0] || 'Patient';

    return (
        <DashboardLayout>
            <div className="space-y-12 pb-20">
                {/* ADMISSION CARD */}
                {admission && admission.admitted && (
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-200 animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                        <Activity size={20} className="text-white" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/20">Active Admission</span>
                                </div>
                                <h3 className="text-3xl font-black mb-1">Room {admission.bed.roomNumber}</h3>
                                <p className="text-indigo-100 font-medium text-lg">Bed {admission.bed.bedNumber} • {admission.bed.floor}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Ward</p>
                                <p className="font-bold text-xl">{admission.bed.ward}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ALERT SECTION */}
                {todayAlert && (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[20px] flex items-center justify-center shadow-lg shadow-red-200/50">
                                <Clock size={32} className="animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-red-900 uppercase italic tracking-tight">Today's Appointment Alert!</h3>
                                <p className="text-sm font-bold text-red-600/80 mt-1 uppercase tracking-widest">
                                    You have a {todayAlert.status} visit with <span className="font-black underline decoration-2">{todayAlert.doctor}</span> at {new Date(todayAlert.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.
                                </p>
                            </div>
                        </div>
                        <Link href="/patient/queue-status">
                            <button className="px-8 py-4 bg-red-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 hover:scale-105 transition-all">
                                Track Live Queue
                            </button>
                        </Link>
                    </div>
                )}

                {/* Welcome Block */}
                <div className="bg-[#0F172A] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-8">
                        <div className="space-y-2">
                            <p className="text-teal-400 text-xs font-black uppercase tracking-[0.4em]">Personal Health Hub</p>
                            <h2 className="text-5xl font-black tracking-tight leading-none italic font-serif">Welcome back,<br />{userFirstName}.</h2>
                        </div>
                        {nextAppt ? (
                            <p className="text-slate-400 text-lg leading-relaxed opacity-80">
                                You have an upcoming {nextAppt.type} visit on <span className="text-white font-bold underline decoration-teal-500">{new Date(nextAppt.date).toLocaleDateString()} at {nextAppt.time}</span>.
                            </p>
                        ) : (
                            <p className="text-slate-400 text-lg leading-relaxed opacity-80">
                                No upcoming appointments scheduled. Stay on top of your health by booking a routine checkup.
                            </p>
                        )}
                        <div className="flex gap-4">
                            {nextAppt && (
                                <button className="px-8 py-4 bg-teal-500 text-[#0F172A] rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center gap-3">
                                    Join Televisit <Play size={16} fill="currentColor" />
                                </button>
                            )}
                            <Link href="/patient/booking">
                                <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                    Book New Appointment
                                </button>
                            </Link>
                        </div>
                    </div>
                    <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={400} />
                </div>

                {/* Action Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <PatientWidget title="Messages" value="00" sub="Secure Inbox" icon={MessageSquare} color="text-blue-500" bg="bg-blue-50" />
                    <Link href="/patient/records" className="block">
                        <PatientWidget title="Health Records" value="SYNC" sub="Verified Repository" icon={FileText} color="text-purple-500" bg="bg-purple-50" />
                    </Link>
                    <Link href="/patient/billing" className="block">
                        <PatientWidget title="Balance" value={`₹${balance.toLocaleString()}`} sub={balance > 0 ? "Outstanding" : "Clear Account"} icon={Wallet} color="text-emerald-500" bg="bg-emerald-50" />
                    </Link>
                    <Link href="/patient/prescriptions" className="block">
                        <PatientWidget title="Prescriptions" value="Live" sub="My Medications" icon={Stethoscope} color="text-olive-600" bg="bg-olive-50" />
                    </Link>
                </div>

                {/* Records & Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Timeline & Interactions</h3>
                            <Link href="/patient/records">
                                <button className="text-[10px] font-black text-olive-700 uppercase tracking-widest hover:underline">Full Archive →</button>
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Retrieving Timeline...</div>
                            ) : appointments.length === 0 ? (
                                <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No recent interactions found</p>
                                </div>
                            ) : (
                                appointments.map((appt, i) => (
                                    <InteractionRow
                                        key={i}
                                        title={appt.type}
                                        date={new Date(appt.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        provider={appt.providerName || "Medical Provider"}
                                        type={appt.time}
                                        status={appt.status.toUpperCase()}
                                        active={i === 0}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight mb-6">Health Adherence</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                    <span>Medication Compliance</span>
                                    <span className="text-olive-600">--%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-olive-600 w-[5%]" />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    "Clinical synchronization in progress. Continue following your prescribed course meticulously."
                                </p>
                            </div>
                        </div>

                        <div className="bg-olive-50 border border-olive-100 rounded-[40px] p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 size={18} className="text-olive-700" />
                                <h4 className="text-sm font-black text-olive-900 uppercase tracking-widest">Intelligence Feed</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-[11px] font-bold text-olive-800 hover:underline cursor-pointer flex items-center gap-2">
                                    <Clock size={12} /> Personalized Diet & Nutrition
                                </li>
                                <li className="text-[11px] font-bold text-olive-800 hover:underline cursor-pointer flex items-center gap-2">
                                    <Clock size={12} /> Understanding your medications
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function PatientWidget({ title, value, sub, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:border-olive-400 transition-all text-center flex flex-col items-center">
            <div className={`p-5 ${bg} ${color} rounded-[24px] mb-6 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-1">{sub}</p>
        </div>
    );
}

function InteractionRow({ title, date, provider, type, status, active }: any) {
    return (
        <div className={`p-8 rounded-[32px] border flex items-center justify-between transition-all cursor-pointer ${active ? 'bg-white border-teal-500 shadow-xl shadow-teal-500/5 ring-1 ring-teal-500' : 'bg-slate-50/30 border-slate-100 hover:bg-white hover:border-olive-200'}`}>
            <div className="flex gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${active ? 'bg-teal-500 text-white' : 'bg-white text-slate-400'}`}>
                    <Calendar size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h4 className={`text-lg font-bold ${active ? 'text-teal-500' : 'text-slate-900'}`}>{title}</h4>
                        {active && <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Next Action</span>}
                    </div>
                    <div className="flex gap-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span>{date}</span>
                        <span>{provider}</span>
                        <span>{type}</span>
                    </div>
                </div>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{status}</span>
        </div>
    );
}
