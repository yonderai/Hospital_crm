"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Users, CreditCard, Calendar, TrendingUp, UserPlus, Briefcase } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const staffStats = [
    { name: "Clinical", value: 45, color: "#6B8E23" },
    { name: "Administrative", value: 15, color: "#556B2F" },
    { name: "Support", value: 12, color: "#90A955" },
    { name: "Nursing", value: 28, color: "#808000" },
];

const HRDashboard = () => {
    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Workforce Overview</h2>
                        <p className="text-slate-500">Manage hospital staff, payroll, and recruitment</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all">
                            <UserPlus size={18} /> Add New Staff
                        </button>
                        <button className="px-6 py-2 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-all">
                            <TrendingUp size={18} /> Payroll Report
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Total Staff", value: "128", icon: <Users />, color: "bg-olive-50 text-olive-600" },
                        { label: "Monthly Payroll", value: "$425k", icon: <CreditCard />, color: "bg-olive-100 text-olive-700" },
                        { label: "Open Vacancies", value: "12", icon: <Briefcase />, color: "bg-olive-200 text-olive-800" },
                        { label: "On Leave", value: "5", icon: <Calendar />, color: "bg-amber-50 text-amber-600" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`${stat.color} p-4 rounded-2xl`}>{stat.icon}</div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Staff Distribution */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Staff Distribution by Department</h3>
                        <div className="h-64 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={staffStats}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {staffStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="space-y-2 ml-8">
                                {staffStats.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                                        <span className="font-medium text-slate-600">{s.name} ({s.value}%)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Shifts/Events */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Upcoming Events</h3>
                        <div className="space-y-4">
                            {[
                                { title: "Nursing Shift Rotation", date: "Jan 25, 2026", type: "Shift" },
                                { title: "Annual Safety Training", date: "Jan 28, 2026", type: "Training" },
                                { title: "Payroll Processing Deadline", date: "Jan 30, 2026", type: "Admin" },
                            ].map((event, i) => (
                                <div key={i} className="flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{event.title}</p>
                                        <p className="text-xs text-slate-500">{event.date}</p>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{event.type}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default HRDashboard;
