"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Clipboard,
    FileText,
    Heart,
    Calendar,
    ChevronRight,
    Search,
    User as UserIcon,
    ArrowUpRight,
    Stethoscope
} from "lucide-react";

export default function PatientClinicalPage() {
    const [stats, setStats] = useState<any[]>([]);
    const [surgeries, setSurgeries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStats([
                { label: "Blood Pressure", value: "120/80", unit: "mmHg", status: "Optimal", icon: Heart },
                { label: "Heart Rate", value: "72", unit: "BPM", status: "Resting", icon: Activity },
                { label: "SpO2", value: "98", unit: "%", status: "Normal", icon: Activity },
                { label: "Blood Glucose", value: "95", unit: "mg/dL", status: "Fasting", icon: Activity },
            ]);
            setLoading(false);
        }, 600);

        const fetchPatientData = async () => {
            try {
                // For demo, we assume patientId is "64b0f1a2e4b0f1a2e4b0f1a2" (John Doe)
                const patientId = "64b0f1a2e4b0f1a2e4b0f1a2";
                const res = await fetch(`/api/patients/${patientId}/surgery`);
                if (res.ok) {
                    const data = await res.json();
                    setSurgeries(data);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchPatientData();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Health Portal</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. YUVRAJ SINGH • PRIMARY CARE NODE</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                        Book Appointment
                    </button>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm group hover:border-olive-400 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-olive-50 group-hover:text-olive-600 transition-all">
                                    <s.icon size={20} />
                                </div>
                                <span className="text-[9px] font-black text-olive-600 uppercase tracking-widest">{s.status}</span>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <div className="flex items-baseline gap-1">
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">{s.unit}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Clinical Summary */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Care Plan</h3>
                            <button className="text-[10px] font-black text-olive-700 uppercase tracking-widest hover:underline">Full Record →</button>
                        </div>
                        <div className="p-8 space-y-8">
                            <CareItem
                                title="Medication Regimen"
                                desc="Lisinopril 10mg Daily (Morning), Metformin 500mg BID (With Meals)"
                                date="Last Updated: Jan 20"
                                icon={Stethoscope}
                            />
                            <CareItem
                                title="Primary Diagnosis"
                                desc="Essential Hypertension (Controlled), Type 2 Diabetes Mellitus"
                                date="Verified Jan 15"
                                icon={Clipboard}
                            />
                            <CareItem
                                title="Upcoming Lab Work"
                                desc="HbA1c & Lipid Panel Requisition #L-9021"
                                date="Due: Feb 05"
                                icon={FileText}
                            />
                        </div>

                        {surgeries.length > 0 && (
                            <div className="p-8 border-t border-slate-50 bg-slate-50/10">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                    <Activity size={14} /> Surgical History
                                </h3>
                                <div className="space-y-4">
                                    {surgeries.map((s) => (
                                        <div key={s._id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group hover:border-teal-400 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                                                    <Activity size={18} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{s.procedureName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(s.scheduledDate).toLocaleDateString()} • {s.startTime}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Care Team */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                            <div className="relative z-10 space-y-8">
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Care Team</h4>
                                <div className="space-y-6">
                                    <TeamMember name="Dr. Yuvraj Singh" role="Primary Physician" status="Online" />
                                    <TeamMember name="Nurse Sarah Connor" role="Care Coordinator" status="Online" />
                                    <TeamMember name="Dr. Elena Vance" role="Endocrinologist" status="Away" />
                                </div>
                                <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all">
                                    Message Provider
                                </button>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function CareItem({ title, desc, date, icon: Icon }: any) {
    return (
        <div className="flex items-start gap-6 p-6 bg-slate-50/50 rounded-[32px] border border-slate-100 hover:bg-white hover:border-olive-200 transition-all group">
            <div className="p-4 bg-white border border-slate-100 rounded-2xl text-slate-400 group-hover:bg-olive-600 group-hover:text-white transition-all shadow-sm">
                <Icon size={24} />
            </div>
            <div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1">{title}</h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed mb-2">{desc}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{date}</p>
            </div>
        </div>
    );
}

function TeamMember({ name, role, status }: any) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <UserIcon size={18} />
                </div>
                <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{role}</p>
                </div>
            </div>
            <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'Online' ? 'bg-teal-400 animate-pulse' : 'bg-slate-700'}`} />
                <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
            </div>
        </div>
    );
}
