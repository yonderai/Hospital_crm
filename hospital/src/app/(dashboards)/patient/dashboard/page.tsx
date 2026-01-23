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

export default function PatientDashboard() {
    return (
        <DashboardLayout>
            <div className="space-y-12">
                {/* Welcome Block */}
                <div className="bg-[#0F172A] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-8">
                        <div className="space-y-2">
                            <p className="text-teal-400 text-xs font-black uppercase tracking-[0.4em]">Personal Health Hub</p>
                            <h2 className="text-5xl font-black tracking-tight leading-none italic font-serif">Welcome back,<br />Johnathan.</h2>
                        </div>
                        <p className="text-slate-400 text-lg leading-relaxed opacity-80">
                            You have an upcoming wellness check today at <span className="text-white font-bold underline decoration-teal-500">02:30 PM</span> with Dr. Yuvraj Singh.
                        </p>
                        <div className="flex gap-4">
                            <button className="px-8 py-4 bg-teal-500 text-[#0F172A] rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center gap-3">
                                Join Televisit <Play size={16} fill="currentColor" />
                            </button>
                            <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-[20px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                                Reschedule
                            </button>
                        </div>
                    </div>
                    <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={400} />
                </div>

                {/* Action Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <PatientWidget title="Messages" value="03" sub="Unread" icon={MessageSquare} color="text-blue-500" bg="bg-blue-50" />
                    <Link href="/patient/records" className="block">
                        <PatientWidget title="Lab Results" value="Ready" sub="2 items" icon={FileText} color="text-purple-500" bg="bg-purple-50" />
                    </Link>
                    <Link href="/patient/billing" className="block">
                        <PatientWidget title="Balance Due" value="$42" sub="Pay by Jan 30" icon={Wallet} color="text-emerald-500" bg="bg-emerald-50" />
                    </Link>
                    <PatientWidget title="Care Plans" value="Active" sub="Hypertension" icon={Stethoscope} color="text-olive-600" bg="bg-olive-50" />
                </div>

                {/* Records & Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Timeline & Interactions</h3>
                            <button className="text-[10px] font-black text-olive-700 uppercase tracking-widest hover:underline">Full Medical History →</button>
                        </div>
                        <div className="space-y-4">
                            <InteractionRow
                                title="Comprehensive Wellness Visit"
                                date="Jan 22, 2026"
                                provider="Dr. Yuvraj Singh"
                                type="Televisit"
                                status="Today"
                                active
                            />
                            <InteractionRow
                                title="Lab Visit: Blood Panel"
                                date="Feb 05, 2026"
                                provider="Main Lab Center"
                                type="In-Person"
                                status="Upcoming"
                            />
                            <InteractionRow
                                title="Routine Follow-up"
                                date="Dec 12, 2025"
                                provider="Dr. Yuvraj Singh"
                                type="Completed"
                                status="Past"
                            />
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight mb-6">Patient Adherence</h4>
                            <div className="space-y-6">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                    <span>Medication Compliance</span>
                                    <span className="text-olive-600">88%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-olive-600 w-[88%]" />
                                </div>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium italic">
                                    "Great job! You've missed 0 doses in the last 7 days. Consistency is key for long-term health."
                                </p>
                            </div>
                        </div>

                        <div className="bg-olive-50 border border-olive-100 rounded-[40px] p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <CheckCircle2 size={18} className="text-olive-700" />
                                <h4 className="text-sm font-black text-olive-900 uppercase tracking-widest">Health Education</h4>
                            </div>
                            <ul className="space-y-3">
                                <li className="text-[11px] font-bold text-olive-800 hover:underline cursor-pointer flex items-center gap-2">
                                    <Clock size={12} /> Managing Daily Sodium Intake
                                </li>
                                <li className="text-[11px] font-bold text-olive-800 hover:underline cursor-pointer flex items-center gap-2">
                                    <Clock size={12} /> Benefits of 30min Physical Activity
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
                        {active && <span className="text-[9px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">In 2 Hours</span>}
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
