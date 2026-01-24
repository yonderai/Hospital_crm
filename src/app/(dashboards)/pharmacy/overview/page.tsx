"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    AlertTriangle,
    Clock,
    TrendingUp,
    Package,
    ArrowRight
} from "lucide-react";
import Link from "next/link";

interface Stats {
    pendingRx: number;
    lowStock: number;
    expiring: number;
    salesToday: number;
}

export default function PharmacyOverview() {
    const [stats, setStats] = useState<Stats>({ pendingRx: 0, lowStock: 0, expiring: 0, salesToday: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/pharmacy/stats")
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const cards = [
        {
            title: "Pending Prescriptions",
            value: stats.pendingRx,
            icon: Pill,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-100",
            link: "/pharmacy/dispensing",
            label: "Dispense Now"
        },
        {
            title: "Low Stock Alerts",
            value: stats.lowStock,
            icon: AlertTriangle,
            color: "text-orange-600",
            bg: "bg-orange-50",
            border: "border-orange-100",
            link: "/pharmacy/inventory",
            label: "Restock"
        },
        {
            title: "Expiring Soon (30 Days)",
            value: stats.expiring,
            icon: Clock,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-100",
            link: "/pharmacy/batch-expiry",
            label: "View Batches"
        },
        {
            title: "Rx Dispensed Today",
            value: stats.salesToday,
            icon: TrendingUp,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            link: "/pharmacy/reports",
            label: "View Report"
        }
    ];

    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Overview</h1>
                        <p className="text-slate-500 mt-2 font-medium">Real-time inventory status and prescription queue.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/pharmacy/dispensing" className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl shadow-lg shadow-olive-600/20 hover:bg-olive-700 transition-all flex items-center gap-2">
                            <Pill size={18} />
                            Dispense Rx
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-12">
                    {cards.map((card, idx) => (
                        <div key={idx} className={`p-6 rounded-3xl border ${card.border} ${card.bg} flex flex-col justify-between h-48 transition-all hover:scale-[1.02] hover:shadow-xl`}>
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl bg-white shadow-sm ${card.color}`}>
                                    <card.icon size={24} />
                                </div>
                                <span className={`text-4xl font-black ${card.color}`}>{loading ? "-" : card.value}</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-700 mb-1">{card.title}</h3>
                                <Link href={card.link} className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1 opacity-60 hover:opacity-100 ${card.color}`}>
                                    {card.label} <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-2 gap-8">
                    {/* Recent Alerts Section Placeholder */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <AlertTriangle size={20} className="text-slate-400" />
                                Inventory Alerts
                            </h3>
                            <Link href="/pharmacy/inventory" className="text-xs font-bold text-blue-600 hover:text-blue-700">See All</Link>
                        </div>
                        {loading ? (
                            <p className="text-slate-400 text-sm">Loading inventory status...</p>
                        ) : stats.lowStock === 0 && stats.expiring === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                                <CheckCircle size={48} className="mb-4 opacity-20 text-emerald-500" />
                                <p>Inventory health is perfect.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stats.lowStock > 0 && (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100">
                                        <Package className="text-orange-600" />
                                        <div>
                                            <p className="font-bold text-slate-800">{stats.lowStock} items low on stock</p>
                                            <p className="text-xs text-orange-600 font-medium">Reorder required immediately</p>
                                        </div>
                                    </div>
                                )}
                                {stats.expiring > 0 && (
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100">
                                        <Clock className="text-red-600" />
                                        <div>
                                            <p className="font-bold text-slate-800">{stats.expiring} batches expiring soon</p>
                                            <p className="text-xs text-red-600 font-medium">Check batch expiry list</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center gap-4">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Quick Actions</h3>
                        <Link href="/pharmacy/inventory" className="p-4 rounded-2xl border border-slate-200 hover:border-olive-500 hover:bg-olive-50 transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-olive-200">
                                <Package size={20} className="text-slate-500 group-hover:text-olive-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Add New Medicine</h4>
                                <p className="text-xs text-slate-400">Update inventory catalog</p>
                            </div>
                        </Link>
                        <Link href="/pharmacy/procurement" className="p-4 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-4 group">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-blue-200">
                                <TrendingUp size={20} className="text-slate-500 group-hover:text-blue-700" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Create Purchase Order</h4>
                                <p className="text-xs text-slate-400">Request stock from suppliers</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// Helper icon
function CheckCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
