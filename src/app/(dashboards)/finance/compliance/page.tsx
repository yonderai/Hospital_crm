"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Search, ShieldCheck } from "lucide-react";

export default function CompliancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/finance/compliance");
            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load audit logs");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Compliance & Audit</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Internal Controls & History</p>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Audit Log</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search logs..." className="bg-transparent text-sm font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">Loading history...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">No audit records found.</td></tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-black text-slate-900">
                                                    {log.userId?.firstName} {log.userId?.lastName}
                                                </p>
                                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">{log.userId?.role}</p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{log.resourceType}</td>
                                            <td className="px-8 py-4 text-sm font-medium text-slate-500 max-w-xs truncate">
                                                {JSON.stringify(log.details)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
