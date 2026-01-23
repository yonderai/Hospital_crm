"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    ClipboardCheck,
    AlertTriangle,
    Clock,
    Search,
    ChevronRight,
    Activity,
    FlaskConical
} from "lucide-react";

export default function NurseLaboratoryPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setOrders([
                { id: "LAB-101", patient: "Jim Morrison", test: "CBC w/ Diff", room: "W2-A", status: "Needs Collection", priority: "Urgent" },
                { id: "LAB-102", patient: "Janis Joplin", test: "PT/INR", room: "W3-C", status: "Collected", priority: "Routine" },
                { id: "LAB-103", patient: "Kurt Cobain", test: "Blood Culture x2", room: "W1-B", status: "Needs Collection", priority: "STAT" },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Specimen Collection</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">Nursing Lab Workflow • Unit 7G</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <LabMetric label="Pending Collection" value="08" icon={FlaskConical} color="text-olive-600" bg="bg-olive-50" />
                    <LabMetric label="STAT Orders" value="02" icon={AlertTriangle} color="text-red-500" bg="bg-red-50" />
                    <LabMetric label="Collected (Shift)" value="15" icon={ClipboardCheck} color="text-teal-600" bg="bg-teal-50" />
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Lab Requisitions</h3>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="bg-white border border-slate-200 px-8 py-2 rounded-xl text-[10px] font-bold outline-none" placeholder="Search..." />
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="px-8 py-6">Patient / Room</th>
                                <th className="px-8 py-6">Assay / Test</th>
                                <th className="px-8 py-6">Priority</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right pr-12">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                            ) : (
                                orders.map((o, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-black text-slate-900">{o.patient}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{o.room}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold text-slate-700">{o.test}</span>
                                            <p className="text-[9px] text-slate-400 mt-0.5">#{o.id}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black uppercase ${o.priority === 'STAT' ? 'text-red-600' : o.priority === 'Urgent' ? 'text-orange-600' : 'text-slate-500'}`}>
                                                {o.priority}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${o.status === 'Needs Collection' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-teal-50 text-teal-600 border-teal-100'}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-10">
                                            <button className="px-4 py-2 bg-slate-900 text-teal-400 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all">
                                                Collect
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

function LabMetric({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                <Icon size={20} />
            </div>
        </div>
    );
}
