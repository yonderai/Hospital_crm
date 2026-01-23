"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ShieldCheck,
    Search,
    Filter,
    User,
    Lock,
    FileText,
    AlertTriangle,
    CheckCircle,
    Download,
    Clock
} from "lucide-react";

export default function AdminAuditPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const res = await fetch('/api/admin/audit');
                const data = await res.json();
                if (data.logs) setLogs(data.logs);
            } catch (error) {
                console.error("Failed to fetch audit logs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

    // Helper to format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-US", {
            month: "short", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric"
        });
    };

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security Audit Trail</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">COMPLIANCE • ACCESS LOGS • IMMUTABLE RECORD</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl w-96 transition-all focus-within:border-olive-400">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search User, Action, or IP..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                        />
                    </div>
                    <div className="h-8 w-px bg-slate-100 mx-2" />
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                        <Filter size={14} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all ml-auto">
                        <Download size={14} /> Export CSV
                    </button>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-slate-50/50">
                                <th className="px-8 py-6">Timestamp</th>
                                <th className="px-8 py-6">User / Actor</th>
                                <th className="px-8 py-6">Action Performed</th>
                                <th className="px-8 py-6">Resource</th>
                                <th className="px-8 py-6">Severity</th>
                                <th className="px-8 py-6">IP Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-8 py-6 animate-pulse bg-slate-50/20 text-center text-xs text-slate-300">Loading...</td></tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-50">
                                            <ShieldCheck size={48} className="text-slate-300 mb-4" />
                                            <p className="text-slate-900 font-bold text-lg">No audit records found</p>
                                            <p className="text-slate-500 text-sm">The system hasn't logged any sensitive actions yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log: any, idx: number) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                                <Clock size={14} className="text-slate-300" />
                                                {formatDate(log.timestamp)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-black">
                                                    {(log.userId?.firstName?.[0] || "U")}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">{log.userId?.firstName || "System"} {log.userId?.lastName || "Admin"}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{log.userId?.role || "SYSTEM"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-bold text-slate-700">{log.action}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-500">
                                                {log.resource}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            {log.severity === 'critical' ? (
                                                <span className="flex items-center gap-2 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                                                    <AlertTriangle size={12} /> Critical
                                                </span>
                                            ) : log.severity === 'warning' ? (
                                                <span className="flex items-center gap-2 text-[10px] font-black text-orange-600 bg-orange-50 border border-orange-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                                                    <AlertTriangle size={12} /> Warning
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full w-fit uppercase tracking-widest">
                                                    <CheckCircle size={12} /> Info
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-8 py-5 text-xs font-mono text-slate-400">
                                            {log.ipAddress || "127.0.0.1"}
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
