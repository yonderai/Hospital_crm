"use client";

import { useEffect, useState } from "react";
import { Wrench, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

export default function MaintenanceDashboardPage() {
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        inProgress: 0,
        completed: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/maintenance/tickets")
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) {
                    const newStats = data.reduce((acc: any, ticket: any) => {
                        acc.total++;
                        if (ticket.status === "Pending Approval") acc.pending++;
                        if (ticket.status === "Approved") acc.approved++;
                        if (ticket.status === "Rejected") acc.rejected++;
                        if (ticket.status === "In Progress") acc.inProgress++;
                        if (ticket.status === "Completed") acc.completed++;
                        return acc;
                    }, { total: 0, pending: 0, approved: 0, rejected: 0, inProgress: 0, completed: 0 });
                    setStats(newStats);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const StatsCard = ({ title, value, icon: Icon, color, href }: any) => (
        <Link href={href} className="block group">
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 group-hover:shadow-md group-hover:border-olive-200 cursor-pointer">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-olive-600 transition-colors">{title}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{loading ? "-" : value}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Ops</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">FACILITY MANAGEMENT • STAFF PORTAL</p>
                    </div>
                    <Link href="/maintenance/raise-ticket" className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 transition-colors shadow-lg shadow-olive-600/20 flex items-center gap-2">
                        <Wrench size={18} /> Raise Ticket
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard title="Total Tickets" value={stats.total} icon={Wrench} color="bg-slate-100 text-slate-600" href="/maintenance/tickets" />
                    <StatsCard title="Pending Approval" value={stats.pending} icon={Clock} color="bg-yellow-100 text-yellow-600" href="/maintenance/tickets?status=Pending Approval" />
                    <StatsCard title="Approved" value={stats.approved} icon={CheckCircle} color="bg-green-100 text-green-600" href="/maintenance/tickets?status=Approved" />
                    <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} color="bg-red-100 text-red-600" href="/maintenance/tickets?status=Rejected" />
                </div>

                {/* Main Content Area - Matching Doctor Dashboard Card Style */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-[400px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">System Status</h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">Operational Metrics & Alerts</p>
                            </div>
                        </div>
                        <div className="p-12 text-center text-slate-400 font-medium flex-1 flex flex-col justify-center items-center">
                            <CheckCircle size={48} className="text-green-500 mb-4 opacity-50" />
                            <p className="font-bold text-slate-900">All Systems Operational</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">No critical alerts at this time</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
