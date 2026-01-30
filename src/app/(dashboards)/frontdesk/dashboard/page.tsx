"use client";

import { useState, useEffect } from "react";
import {
    Users,
    CheckCircle2,
    Calendar,
    DollarSign,
    QrCode,
    UserPlus,
    Plus,
    Stethoscope,
    Bed,
    Clock,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function FrontDeskDashboard() {
    const [stats, setStats] = useState({
        registrations: 0,
        checkIns: 0,
        appointments: 0,
        pendingPayments: { count: 0, amount: 0 },
        beds: { total: 0, available: 0, occupied: 0 },
        queue: 0
    });
    const [loading, setLoading] = useState(true);
    const [queue, setQueue] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Stats
                const statsRes = await fetch("/api/front-desk/stats");
                const statsData = await statsRes.json();
                if (!statsData.error) setStats(statsData);

                // Fetch Queue
                const queueRes = await fetch("/api/front-desk/queue");
                const queueData = await queueRes.json();
                if (!queueData.error && queueData.queue) setQueue(queueData.queue);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const statCards = [
        { title: "Today's Registrations", value: stats.registrations, icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50", link: "/frontdesk/registration" },
        { title: "Check-ins Today", value: stats.checkIns, sub: `vs ${stats.appointments} Scheduled`, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", link: "/frontdesk/check-in" },
        { title: "Available Beds", value: `${stats.beds.available}/${stats.beds.total}`, sub: `${Math.round((stats.beds.available / stats.beds.total) * 100)}% Available`, icon: Bed, color: "text-purple-600", bg: "bg-purple-50", link: "/frontdesk/bed-allocation" },
        { title: "Pending Payments", value: `₹${stats.pendingPayments.amount.toLocaleString()}`, sub: `${stats.pendingPayments.count} Patients`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50", link: "/frontdesk/billing" },
    ];

    if (loading) return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Loading dashboard...</div>;

    return (
        <div className="space-y-8 max-w-7xl mx-auto font-sans">
            {/* --- HEADER --- */}
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Front Desk Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">Manage patient intake, check-ins, and queue.</p>
            </div>

            {/* --- STATS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, idx) => (
                    <Link href={stat.link} key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={26} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider group-hover:text-slate-700 transition-colors">{stat.title}</p>
                            <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
                            {stat.sub && <p className="text-xs font-semibold text-slate-400 mt-1">{stat.sub}</p>}
                        </div>
                    </Link>
                ))}
            </div>

            {/* --- MAIN CONTENT SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: CHECK-IN QUEUE (2/3) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                                    <Clock className="text-olive-600" size={20} />
                                    Check-in Queue
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">
                                    {stats.queue} Patients Waiting
                                </p>
                            </div>
                            <Link href="/frontdesk/check-in" className="px-4 py-2 bg-olive-600 hover:bg-olive-700 text-white font-bold rounded-xl text-sm flex items-center gap-2 transition-colors shadow-olive-200 shadow-lg">
                                <QrCode size={18} />
                                QR Check-in
                            </Link>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {queue.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                    <CheckCircle2 size={48} className="mb-4 opacity-20" />
                                    <p className="font-bold">All caught up!</p>
                                    <p className="text-sm">No scheduled appointments waiting for check-in.</p>
                                </div>
                            ) : (
                                queue.map((patient) => (
                                    <div key={patient.id} className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-olive-200 hover:shadow-md transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-xl flex items-center justify-center font-black text-lg group-hover:bg-olive-50 group-hover:text-olive-600 transition-colors">
                                                {patient.patientName.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{patient.patientName}</h4>
                                                <p className="text-xs font-medium text-slate-500">{patient.mrn}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-bold text-slate-400 uppercase">Appointment</p>
                                                <p className="font-bold text-slate-700">{patient.time} with {patient.doctor}</p>
                                            </div>
                                            <Link href={`/frontdesk/check-in?mrn=${patient.mrn}`} className="p-2 bg-slate-50 text-slate-400 hover:bg-olive-50 hover:text-olive-600 rounded-lg transition-colors">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: QUICK ACTIONS & ALERTS (1/3) */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-olive-900 text-white p-6 rounded-3xl shadow-xl shadow-olive-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                            <QrCode size={120} />
                        </div>
                        <h3 className="text-xl font-black mb-1 relative z-10">Quick Actions</h3>
                        <p className="text-olive-200 text-sm font-medium mb-6 relative z-10">Fast-track patient processing</p>

                        <div className="space-y-3 relative z-10">
                            <Link href="/frontdesk/registration" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex items-center gap-3 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                    <Plus size={18} strokeWidth={3} />
                                </div>
                                <span className="font-bold text-sm">New Registration</span>
                            </Link>

                            <Link href="/frontdesk/appointments" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex items-center gap-3 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <Calendar size={18} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-sm">Book Appointment</span>
                            </Link>

                            <Link href="/frontdesk/check-in" className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 p-3 rounded-xl flex items-center gap-3 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                                    <QrCode size={18} strokeWidth={2.5} />
                                </div>
                                <span className="font-bold text-sm">Detailed Check-in</span>
                            </Link>
                        </div>
                    </div>

                    {/* Pending Payments Widget */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4">
                            <DollarSign size={20} className="text-amber-500" />
                            Unpaid Bills
                        </h3>
                        <div className="space-y-4">
                            {/* Mock Data List */}
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-amber-200 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Rajesh Kumar</p>
                                    <p className="text-xs font-medium text-slate-400">Consultation Fee</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-amber-600">₹500</p>
                                    <p className="text-[10px] font-bold text-amber-600/60 uppercase">Collect</p>
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-amber-200 transition-colors">
                                <div>
                                    <p className="text-sm font-bold text-slate-800">Priya Sharma</p>
                                    <p className="text-xs font-medium text-slate-400">Lab Test</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-black text-amber-600">₹1,200</p>
                                    <p className="text-[10px] font-bold text-amber-600/60 uppercase">Collect</p>
                                </div>
                            </div>
                        </div>
                        <Link href="/frontdesk/billing" className="block w-full mt-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest border border-dashed border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-center">
                            View All Pending
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
