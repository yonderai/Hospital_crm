"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    Briefcase,
    Calendar,
    GraduationCap,
    ArrowUpRight,
    Activity,
    ShieldCheck,
    MapPin,
    ChevronRight,
    Settings,
    FileText
} from "lucide-react";

export default function AdminHRPage() {
    const [staffStats, setStaffStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStaffStats([
                { dept: "Clinical Staff", count: 242, status: "Healthy", vacancy: 12 },
                { dept: "Nursing", count: 185, status: "Critical", vacancy: 28 },
                { dept: "Administration", count: 45, status: "Stable", vacancy: 2 },
                { dept: "Support Services", count: 90, status: "Healthy", vacancy: 5 },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Human Capital</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">Personnel Allocation & Credentials</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Payroll Integration
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-teal-400 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/20 hover:bg-slate-800 transition-all">
                            <Briefcase size={16} /> Open Vacancies
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <HRKPI label="Headcount" value="562" icon={Users} color="text-olive-600" bg="bg-olive-50" />
                    <HRKPI label="Retention Rate" value="94.2%" icon={Activity} color="text-teal-600" bg="bg-teal-50" />
                    <HRKPI label="Compliance" value="98%" icon={ShieldCheck} color="text-blue-600" bg="bg-blue-50" />
                    <HRKPI label="Vacancies" value="47" icon={FileText} color="text-red-500" bg="bg-red-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Department Allocation */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Departmental Staffing</h3>
                            <button className="text-[10px] font-black text-olive-700 uppercase tracking-widest hover:underline">Full Directory →</button>
                        </div>
                        <div className="p-8 space-y-8">
                            {loading ? (
                                [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)
                            ) : (
                                staffStats.map((dept, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{dept.dept}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{dept.count} Active Personnel</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${dept.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'}`}>
                                                    {dept.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                                            <div className="h-full bg-olive-600" style={{ width: `${(dept.count / (dept.count + dept.vacancy)) * 100}%` }} />
                                            <div className="h-full bg-slate-200" style={{ width: `${(dept.vacancy / (dept.count + dept.vacancy)) * 100}%` }} />
                                        </div>
                                        <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                            <span>Occupied ({dept.count})</span>
                                            <span>Vacant ({dept.vacancy})</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recruitment & Actions */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
                            <div className="relative z-10 space-y-8">
                                <div className="flex items-center gap-3">
                                    <GraduationCap className="text-teal-400" size={24} />
                                    <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Talent Pipeline</h4>
                                </div>

                                <div className="space-y-4">
                                    <CandidateRow name="Dr. Julian Moore" role="Radiologist" status="Final Interview" />
                                    <CandidateRow name="Sarah Jenkins" role="OR Nurse" status="Credentialing" />
                                    <CandidateRow name="Michael Ross" role="IT Admin" status="Technical Round" />
                                </div>

                                <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20">
                                    Review All Applications
                                </button>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Staff Directives</h4>
                            <div className="space-y-3">
                                <DirectiveButton label="Credential Audit" icon={ShieldCheck} />
                                <DirectiveButton label="Shift Roster V2" icon={Calendar} />
                                <DirectiveButton label="Training Portal" icon={GraduationCap} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function HRKPI({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className={`p-5 ${bg} ${color} rounded-[24px] shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
            </div>
        </div>
    );
}

function CandidateRow({ name, role, status }: any) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <div>
                <p className="text-xs font-bold text-white">{name}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{role}</p>
            </div>
            <span className="text-[8px] font-black text-teal-400 uppercase tracking-widest">{status}</span>
        </div>
    );
}

function DirectiveButton({ label, icon: Icon }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all group">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400 group-hover:text-olive-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{label}</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
        </button>
    );
}
