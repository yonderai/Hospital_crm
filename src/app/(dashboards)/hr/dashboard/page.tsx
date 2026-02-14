"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Activity,
    Calendar,
    Award,
    Plus,
    Clock,
    UserCheck,
    Briefcase
} from "lucide-react";

import { useState, useEffect } from "react";

export default function HRDashboard() {
    const [stats, setStats] = useState([
        { title: "Total Hospital Staff", value: "...", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Doctors", value: "...", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Nurses", value: "...", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
        { title: "Other Staff", value: "...", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/hr/staff');
                const data = await res.json();
                if (data.stats) {
                    const totalStat = data.stats.find((s: any) => s.label === "Total Staff");
                    const doctorStat = data.stats.find((s: any) => s.label === "Doctors");
                    const nurseStat = data.stats.find((s: any) => s.label === "Nurses");
                    const otherStat = data.stats.find((s: any) => s.label === "Other");

                    setStats([
                        { title: "Total Hospital Staff", value: totalStat?.value || "0", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
                        { title: "Doctors", value: doctorStat?.value || "0", icon: UserCheck, color: "text-blue-500", bg: "bg-blue-50" },
                        { title: "Nurses", value: nurseStat?.value || "0", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
                        { title: "Other Staff", value: otherStat?.value || "0", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-50" },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch HR stats", error);
            }
        };
        fetchStats();
    }, []);

    const staffActivity = [
        { name: "Dr. Yuvraj Singh", role: "Cardiologist", status: "On Duty", location: "OPD-1", shift: "08:00 AM - 04:00 PM" },
        { name: "Nurse Sarah Connor", role: "Head Nurse", status: "Break", location: "Sector 7G", shift: "07:00 AM - 03:00 PM" },
        { name: "Tech Alan Turing", role: "Lab Lead", status: "On Duty", location: "Lab Node 42", shift: "09:00 AM - 05:00 PM" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Management</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">HR DIR. STEVE JOBS • QUALITY & COMPLIANCE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Add Personnel
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Staff Deployment</h3>
                            <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em]">Roster View</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Name / Role</th>
                                        <th className="px-8 py-4">Status / Location</th>
                                        <th className="px-8 py-4">Shift Timeline</th>
                                        <th className="px-8 py-4 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {staffActivity.map((staff, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-slate-900">{staff.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{staff.role}</p>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${staff.status === 'On Duty' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`} />
                                                    <p className="text-xs font-bold text-slate-700">{staff.status}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase ml-2">({staff.location})</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-medium text-slate-500">{staff.shift}</td>
                                            <td className="px-8 py-5 text-right pr-8">
                                                <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Compliance & Training</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <Award className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">12 Certifications Expiring</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-black">Next 30 Days</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-olive-500/10 rounded-2xl border border-olive-500/20">
                                        <Activity className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-olive-100">CME Requirements</p>
                                            <p className="text-[10px] text-olive-300 mt-0.5 uppercase tracking-widest font-black">94% Compliance Rate</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">HR Shortcuts</h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all">
                                    <Clock size={18} className="text-slate-400" />
                                    <span className="text-xs font-black uppercase text-slate-600">Payroll Processing</span>
                                </button>
                                <button className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all">
                                    <Briefcase size={18} className="text-slate-400" />
                                    <span className="text-xs font-black uppercase text-slate-600">Recruitment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
