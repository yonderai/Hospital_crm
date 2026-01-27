
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
    Users,
    Calendar,
    Clock,
    Plus,
    Search,
    CheckCircle,
    Activity,
    Bed,
    FileText,
    ArrowRight,
    UserPlus,
    CreditCard
} from "lucide-react";

export default function FrontDeskDashboard() {
    const [stats, setStats] = useState({
        registrationsToday: 24,
        inQueue: 8,
        doctorsActive: 0,
        availableBeds: 12
    });
    const [doctors, setDoctors] = useState([]);

    // Mock Data for Queue
    const queue = [
        { id: 1, name: "Alice Cooper", time: "10:42 AM", reason: "Fever", status: "Waiting", type: "Walk-in" },
        { id: 2, name: "Bob Marley", time: "10:45 AM", reason: "Follow-up", status: "Waiting", type: "Appointment" },
        { id: 3, name: "John Doe", time: "10:50 AM", reason: "Chest Pain", status: "Triage", type: "Emergency" },
    ];

    useEffect(() => {
        // Fetch Doctors for count
        fetch('/api/frontdesk/doctors')
            .then(res => res.json())
            .then(data => {
                setDoctors(data);
                setStats(prev => ({ ...prev, doctorsActive: data.length || 5 }));
            })
            .catch(() => setStats(prev => ({ ...prev, doctorsActive: 5 }))); // Fallback
    }, []);

    const actions = [
        { label: "New Registration", icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50", href: "/frontdesk/registration" },
        { label: "Book Appointment", icon: Calendar, color: "text-olive-600", bg: "bg-olive-50", href: "/frontdesk/appointments" },
        { label: "Collect Fees", icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", href: "/frontdesk/fees" },
        { label: "Bed Allocation", icon: Bed, color: "text-purple-600", bg: "bg-purple-50", href: "/frontdesk/bed-allocation" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Front Desk Operations</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Reception & Triage Control</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center gap-2 shadow-sm">
                            <Clock size={16} className="text-slate-400" />
                            <span className="text-sm font-bold text-slate-700">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                <UserPlus size={20} />
                            </div>
                            <span className="px-2 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">+12%</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats.registrationsToday}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Registrations Today</p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                <Users size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats.inQueue}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Patients in Queue</p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-olive-50 text-olive-600 rounded-xl">
                                <Activity size={20} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats.doctorsActive}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Doctors On Duty</p>
                    </div>

                    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Bed size={20} />
                            </div>
                            <span className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">Critical</span>
                        </div>
                        <h3 className="text-3xl font-black text-slate-900">{stats.availableBeds}</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Available Beds</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Live Queue */}
                    <div className="col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-lg font-black text-slate-900">Live Queue</h3>
                            <button className="text-xs font-bold text-olive-600 hover:text-olive-700 flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </button>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-slate-50">
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <th className="px-8 py-4">Patient</th>
                                    <th className="px-8 py-4">Time</th>
                                    <th className="px-8 py-4">Reason</th>
                                    <th className="px-8 py-4">Type</th>
                                    <th className="px-8 py-4">Status</th>
                                    <th className="px-8 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {queue.map((p, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-4 font-bold text-slate-900">{p.name}</td>
                                        <td className="px-8 py-4 text-sm text-slate-500">{p.time}</td>
                                        <td className="px-8 py-4 text-sm text-slate-600">{p.reason}</td>
                                        <td className="px-8 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${p.type === 'Emergency' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                                                }`}>{p.type}</span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></span>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <button className="p-2 text-slate-400 hover:text-olive-600 hover:bg-olive-50 rounded-lg transition-all">
                                                <ArrowRight size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {actions.map((action, i) => (
                                    <Link key={i} href={action.href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group">
                                        <div className={`p-3 rounded-xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform`}>
                                            <action.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{action.label}</h4>
                                            <p className="text-xs text-slate-400 font-medium group-hover:text-slate-500">Access Module</p>
                                        </div>
                                        <ArrowRight size={16} className="ml-auto text-slate-300 group-hover:text-slate-400 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black uppercase tracking-tight mb-2">Hospital Occupancy</h3>
                                <div className="flex items-end gap-2 mb-1">
                                    <span className="text-4xl font-black text-white">84%</span>
                                    <span className="text-sm font-bold text-slate-400 mb-1">Full</span>
                                </div>
                                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                    <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 w-[84%] h-full rounded-full"></div>
                                </div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-4">12 Beds Remaining</p>
                            </div>
                            <Activity className="absolute -bottom-4 -right-4 text-slate-800/50" size={120} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
