"use client";

import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Microscope, Activity, Beaker, FileText, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const data = [
    { name: "Mon", tests: 40 },
    { name: "Tue", tests: 30 },
    { name: "Wed", tests: 45 },
    { name: "Thu", tests: 50 },
    { name: "Fri", tests: 35 },
    { name: "Sat", tests: 20 },
    { name: "Sun", tests: 15 },
];

const LabDashboard = () => {
    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Pending Samples", value: "14", icon: <Beaker />, color: "text-olive-400" },
                        { label: "In-Progress", value: "8", icon: <Activity />, color: "text-olive-500" },
                        { label: "Completed (Today)", value: "32", icon: <CheckCircle />, color: "text-olive-600" },
                        { label: "Urgent Orders", value: "3", icon: <Activity />, color: "text-red-600" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div className={`${stat.color} mb-4`}>{stat.icon}</div>
                            <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Test Volume Chart */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Test Volume (Last 7 Days)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="tests" fill="#6B8E23" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <FileText size={20} className="text-slate-400" /> Recent Reports
                        </h3>
                        <div className="space-y-4 flex-1">
                            {[
                                { patient: "Alice Winston", test: "CBC", status: "Verified", time: "10 mins ago" },
                                { patient: "Bob Marley", test: "Lipid Profile", status: "Pending", time: "45 mins ago" },
                                { patient: "Charlie Brown", test: "Glucose Tolerance", status: "Verified", time: "1 hr ago" },
                            ].map((report, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{report.patient}</p>
                                        <p className="text-xs text-slate-500">{report.test}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${report.status === 'Verified' ? 'bg-olive-100 text-olive-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {report.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-3 mt-6 text-sm font-bold text-olive-600 hover:bg-olive-50 rounded-xl transition-all">
                            View All Reports
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default LabDashboard;
