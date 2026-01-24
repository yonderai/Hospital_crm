"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { BarChart3, TrendingUp, Calendar } from "lucide-react";

export default function ReportsPage() {
    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Usage Reports</h1>
                    <p className="text-slate-500 mt-2 font-medium">Analyze medication consumption and costs.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center gap-2">
                        <Calendar size={16} /> Last 30 Days
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Total Dispensed</h3>
                    <p className="text-4xl font-black text-slate-900">1,240</p>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                        <TrendingUp size={12} /> +12% vs last month
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Revenue Generated</h3>
                    <p className="text-4xl font-black text-slate-900">$24,500</p>
                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
                        <TrendingUp size={12} /> +8% vs last month
                    </div>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-2">Low Stock Incidents</h3>
                    <p className="text-4xl font-black text-slate-900">3</p>
                    <div className="flex items-center gap-1 text-red-600 text-xs font-bold mt-2">
                        +1 vs last month
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm h-96 flex items-center justify-center text-slate-400 flex-col">
                <BarChart3 size={48} className="mb-4 opacity-20" />
                <p>Detailed chart functionality enabled in premium analytics module.</p>
            </div>
        </DashboardLayout>
    );
}
