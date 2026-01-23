"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    Package,
    AlertTriangle,
    CheckCircle,
    Plus,
    Activity,
    Clipboard,
    Truck
} from "lucide-react";

export default function PharmacistDashboard() {
    const stats = [
        { title: "Prescriptions Pending", value: "24", icon: Pill, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Low Stock Items", value: "12", icon: AlertTriangle, color: "text-orange-500", bg: "bg-orange-50" },
        { title: "Fulfilled Today", value: "156", icon: CheckCircle, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Incoming Deliveries", value: "03", icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    const prescriptionQueue = [
        { patient: "Jim Morrison", med: "Atorvastatin 20mg", doctor: "Dr. Singh", status: "Verified", time: "10:15 AM" },
        { patient: "Janis Joplin", med: "Amoxicillin 500mg", doctor: "Dr. Singh", status: "Filling", time: "10:30 AM" },
        { patient: "Kurt Cobain", med: "Lisnopril 10mg", doctor: "Dr. Gupta", status: "Review", time: "10:45 AM" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Central Pharmacy</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">PHARM. GREGORY HOUSE • MAIN DISPENSARY</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Stock Entry
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
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Prescription Queue</h3>
                            <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em]">Verified Only</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Patient / Doctor</th>
                                        <th className="px-8 py-4">Medication</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Time</th>
                                        <th className="px-8 py-4 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {prescriptionQueue.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <p className="text-sm font-bold text-slate-900">{p.patient}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">{p.doctor}</p>
                                            </td>
                                            <td className="px-8 py-5 text-xs font-bold text-olive-700">{p.med}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${p.status === 'Verified' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        p.status === 'Filling' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                    }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-500 font-medium">{p.time}</td>
                                            <td className="px-8 py-5 text-right pr-8">
                                                <button className="px-4 py-2 bg-olive-100 text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                                    Label & Pack
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-orange-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Stock Alerts</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/20">
                                        <Package className="text-white" size={20} />
                                        <div>
                                            <p className="text-sm font-black">Insulin Lantus</p>
                                            <p className="text-[10px] text-orange-200 mt-0.5 font-bold uppercase tracking-widest">Only 5 units left</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-white/10 rounded-2xl border border-white/20">
                                        <Truck className="text-white" size={20} />
                                        <div>
                                            <p className="text-sm font-black">Refill Ordered</p>
                                            <p className="text-[10px] text-orange-200 mt-0.5 font-bold uppercase tracking-widest">Expected: Jan 23</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Pharmacy Directives</h4>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Clipboard size={18} className="text-slate-400" />
                                        <span className="text-xs font-black uppercase text-slate-600">Narcotics Log</span>
                                    </div>
                                    <Activity size={16} className="text-slate-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
