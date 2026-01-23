"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Wrench, AlertTriangle, CheckCircle2, Calendar, Settings, FileText, Search, Plus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const maintenanceData = [
    { name: "Imaging", value: 12, color: "#6B8E23" },
    { name: "Monitoring", value: 45, color: "#556B2F" },
    { name: "Surgical", value: 8, color: "#90A955" },
    { name: "Laboratory", value: 15, color: "#808000" },
];

const AssetDashboard = () => {
    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biomedical Engineering</h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">Asset Performance & Maintenance Hub</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                            <Plus size={18} /> Register Asset
                        </button>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Operational", value: "84%", icon: <CheckCircle2 />, color: "bg-olive-600", trend: "+2.4%" },
                        { label: "Repair Pending", value: "12", icon: <Wrench />, color: "bg-amber-500", trend: "High Priority" },
                        { label: "Critical Failure", value: "2", icon: <AlertTriangle />, color: "bg-red-500", trend: "Immediate Action" },
                        { label: "Scheduled Main.", value: "24", icon: <Calendar />, color: "bg-olive-500", trend: "Next 7 Days" },
                    ].map((kpi, i) => (
                        <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className={`${kpi.color} text-white p-3 rounded-2xl shadow-lg`}>
                                        {kpi.icon}
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.trend}</span>
                                </div>
                                <div className="mt-6">
                                    <p className="text-sm font-bold text-slate-500">{kpi.label}</p>
                                    <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
                                </div>
                            </div>
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${kpi.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-all duration-700`}></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Asset Distribution Chart */}
                    <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black text-slate-900">Asset Distribution</h3>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded-lg uppercase">All Units</span>
                            </div>
                        </div>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={maintenanceData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                                    />
                                    <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                                        {maintenanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Maintenance Log */}
                    <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 text-white flex flex-col">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold">Engineering Log</h3>
                            <button className="p-2 border border-slate-700 rounded-xl hover:bg-slate-800 transition-all">
                                <Settings size={18} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="space-y-6 flex-1">
                            {[
                                { asset: "MRI-01", type: "Calibration", time: "Completed", tech: "Eng. Smith" },
                                { asset: "VENT-12", type: "Oxygen Sensor", time: "In-Progress", tech: "Eng. Davis" },
                                { asset: "SURG-L4", type: "Light Filter", time: "Scheduled", tech: "Eng. Wilson" },
                            ].map((task, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className={`w-2 h-12 rounded-full ${task.time === 'Completed' ? 'bg-olive-600' : task.time === 'In-Progress' ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                                    <div className="flex-1">
                                        <p className="font-bold text-sm group-hover:text-olive-400 transition-all">{task.asset} - {task.type}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{task.tech}</p>
                                            <span className="text-[10px] text-slate-600 font-black">•</span>
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${task.time === 'Completed' ? 'text-olive-500' : 'text-slate-400'}`}>{task.time}</p>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-all">
                                        <FileText size={16} className="text-slate-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 mt-10 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-300 transition-all border border-white/10">
                            Download Workflow Report
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AssetDashboard;
