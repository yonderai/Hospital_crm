"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity, Search, Filter, Clock, CheckCircle2,
    AlertCircle, ChevronRight, Beaker, User, Calendar
} from "lucide-react";

interface LabOrder {
    _id: string;
    orderId: string;
    patientId: {
        _id: string;
        firstName: string;
        lastName: string;
        name?: string;
        mrn: string;
    };
    orderingProviderId?: {
        _id: string;
        firstName: string;
        lastName: string;
        name?: string;
        department?: string;
    };
    tests: string[];
    priority: "routine" | "urgent" | "stat";
    status: "ordered" | "scheduled" | "collected" | "in-progress" | "completed" | "cancelled";
    createdAt: string;
    orderSource: "internal" | "direct";
}

const statusColors = {
    "ordered": "bg-slate-100 text-slate-600 border-slate-200",
    "scheduled": "bg-blue-50 text-blue-600 border-blue-100",
    "collected": "bg-amber-50 text-amber-600 border-amber-100",
    "in-progress": "bg-olive-50 text-olive-600 border-olive-100",
    "completed": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "cancelled": "bg-red-50 text-red-600 border-red-100"
};

const priorityColors = {
    "routine": "text-slate-400",
    "urgent": "text-orange-500",
    "stat": "text-red-600 font-black"
};

export default function SampleTrackingPage() {
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/lab/track");
            const data = await res.json();
            if (Array.isArray(data)) {
                setOrders(data);
            }
        } catch (err) {
            console.error("Failed to fetch tracking data:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.patientId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.patientId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.patientId?.mrn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.tests.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = filterStatus === "all" || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: orders.length,
        pending: orders.filter(o => ["ordered", "scheduled", "collected"].includes(o.status)).length,
        active: orders.filter(o => o.status === "in-progress").length,
        completed: orders.filter(o => o.status === "completed").length
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-10 pb-20">
                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">Sample Tracking</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">DIAGNOSTIC LIFECYCLE MONITORING</p>
                    </div>

                    <div className="flex gap-4">
                        {[
                            { label: "Total Orders", value: stats.total, color: "bg-slate-50 text-slate-600" },
                            { label: "Active/Pending", value: stats.pending + stats.active, color: "bg-amber-50 text-amber-600" },
                            { label: "Completed", value: stats.completed, color: "bg-emerald-50 text-emerald-600" }
                        ].map((stat, i) => (
                            <div key={i} className={`${stat.color} px-6 py-3 rounded-2xl border border-black/5`}>
                                <p className="text-[9px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                <p className="text-xl font-black">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search by MRN, Patient Name, or Test..."
                            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-2 focus:ring-olive-500 transition-all font-bold text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-slate-50 p-1.5 rounded-[24px] border border-slate-100 overflow-x-auto max-w-full noscrollbar">
                        {["all", "ordered", "collected", "in-progress", "completed", "cancelled"].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filterStatus === status
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {status.replace("-", " ")}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tracking List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-4">
                            <Activity className="text-olive-500 animate-spin" size={48} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synchronizing Archive Data...</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="bg-white rounded-[40px] p-20 border border-slate-100 text-center space-y-4">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                                <Beaker size={32} className="text-slate-200" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">No Samples Found</h3>
                            <p className="text-slate-400 text-sm font-bold">Adjust your search or filter to see more records.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {filteredOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm hover:border-olive-200 transition-all flex flex-col 2xl:flex-row 2xl:items-center gap-6 group"
                                >
                                    {/* Left: Status & ID */}
                                    <div className="flex items-center gap-4 2xl:w-64">
                                        <div className={`p-3 rounded-2xl ${statusColors[order.status].split(' ')[0]}`}>
                                            {order.status === 'completed' ? <CheckCircle2 size={24} className="text-emerald-500" /> :
                                                order.status === 'cancelled' ? <AlertCircle size={24} className="text-red-500" /> :
                                                    <Clock size={24} className="text-olive-500 animate-pulse" />}
                                        </div>
                                        <div>
                                            <p className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${statusColors[order.status]}`}>
                                                {order.status.replace("-", " ")}
                                            </p>
                                            <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase">ID: {order.orderId}</p>
                                        </div>
                                    </div>

                                    {/* Center: Patient & Provider */}
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 2xl:border-l border-slate-50 2xl:pl-6 min-w-0">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accession Subject</p>
                                                <h4 className="font-black text-slate-900 truncate">{order.patientId?.firstName} {order.patientId?.lastName}</h4>
                                                <p className="text-[9px] font-mono font-bold text-olive-600">{order.patientId?.mrn}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Beaker size={18} className="text-slate-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Dispatcher</p>
                                                <h4 className="font-black text-slate-900 italic truncate">
                                                    {order.orderSource === 'direct' ? 'Walk-in (Direct)' : `Dr. ${order.orderingProviderId?.lastName || 'Anonymous'}`}
                                                </h4>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase">{order.orderingProviderId?.department || 'Outpatient Clinic'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Tests & Meta */}
                                    <div className="2xl:w-72 2xl:border-l border-slate-50 2xl:pl-6 flex flex-col justify-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Requested Protocols</p>
                                        <div className="flex flex-wrap gap-2">
                                            {order.tests.map((test, i) => (
                                                <span key={i} className="text-[9px] font-black text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 uppercase">
                                                    {test}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="2xl:w-56 2xl:border-l border-slate-50 2xl:pl-6 flex flex-col justify-center">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Activity size={14} className={priorityColors[order.priority]} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${priorityColors[order.priority]}`}>
                                                {order.priority} Priority
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calendar size={14} />
                                            <span className="text-[9px] font-bold uppercase">
                                                {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <ChevronRight className="text-slate-200 group-hover:text-olive-400 transition-colors" size={24} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
