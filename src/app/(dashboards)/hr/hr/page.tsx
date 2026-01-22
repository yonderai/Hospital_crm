"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Search,
    UserPlus,
    Briefcase,
    Calendar,
    GraduationCap,
    MoreVertical,
    ChevronRight,
    MapPin,
    Activity
} from "lucide-react";

export default function HRPersonnelPage() {
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStaff([
                { id: "1", name: "Dr. Yuvraj Singh", role: "Sr. Cardiologist", dept: "Cardiology", status: "On Duty", joined: "Jan 2020", type: "Full-time" },
                { id: "2", name: "Nurse Sarah Connor", role: "Head Nurse", dept: "Sector 7G", status: "On Duty", joined: "Mar 2021", type: "Full-time" },
                { id: "3", name: "Dr. Alan Turing", role: "Chief Pathologist", dept: "Laboratory", status: "On Leave", joined: "Jun 2019", type: "Consultant" },
                { id: "4", name: "Steve Jobs", role: "HR Director", dept: "Administration", status: "On Duty", joined: "Aug 2018", type: "Full-time" },
                { id: "5", name: "Gregory House", role: "Lead Pharmacist", dept: "Pharmacy", status: "Off Duty", joined: "Nov 2022", type: "Contract" },
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Management</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">HUMAN RESOURCES CORE • ENTERPRISE NODE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                            Payroll Logs
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <UserPlus size={16} /> Add Personnel
                        </button>
                    </div>
                </div>

                {/* Personnel Insights */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <HRStat label="Total Staff" value="482" detail="+4 this week" icon={Users} />
                    <HRStat label="On Active Duty" value="124" detail="89% shift coverage" icon={Activity} />
                    <HRStat label="Open Reqs" value="15" icon={Briefcase} />
                    <HRStat label="Certifications" value="94%" detail="Compliance Rate" icon={GraduationCap} />
                </div>

                {/* Staff Directory */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div className="flex items-center gap-6">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Staff Registry</h3>
                            <div className="flex items-center gap-3 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl w-80 shadow-sm">
                                <Search size={18} className="text-slate-400" />
                                <input placeholder="Search Name, Role, or ID..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full" />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <DeptFilter label="All" active />
                            <DeptFilter label="Medical" />
                            <DeptFilter label="Nursing" />
                            <DeptFilter label="Admin" />
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                                <th className="px-8 py-6">Staff Member</th>
                                <th className="px-8 py-6">Department</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6">Tenure</th>
                                <th className="px-8 py-6 text-right pr-12">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                            ) : (
                                staff.map((s, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 font-bold text-xs uppercase group-hover:bg-white group-hover:border-olive-200 transition-all">
                                                    {s.name.split(' ').map((n: string) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{s.name}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{s.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                <MapPin size={12} className="text-slate-300" />
                                                {s.dept}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${s.status === 'On Duty' ? 'bg-green-500' : s.status === 'On Leave' ? 'bg-yellow-500' : 'bg-slate-300'}`} />
                                                <p className="text-[10px] font-black uppercase text-slate-500 tracking-tight">{s.status}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-slate-500">{s.joined}</p>
                                            <p className="text-[9px] font-black text-slate-300 uppercase">{s.type}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-olive-700 rounded-xl shadow-sm transition-all group-hover:border-olive-200">
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function HRStat({ label, value, detail, icon: Icon }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{value}</p>
                {detail && <p className="text-[10px] font-bold text-olive-600 uppercase tracking-tight">{detail}</p>}
            </div>
            <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl group-hover:bg-olive-50 group-hover:text-olive-600 transition-all">
                <Icon size={24} />
            </div>
        </div>
    );
}

function DeptFilter({ label, active = false }: any) {
    return (
        <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all border ${active ? 'bg-olive-700 text-white border-transparent' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}>
            {label}
        </span>
    );
}
