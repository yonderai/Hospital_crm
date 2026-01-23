"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Eye, Download, Activity, AlertCircle } from "lucide-react";

export default function PatientReportViewerPage() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/patient/reports')
            .then(res => res.json())
            .then(json => {
                setReports(json.data || []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    const getStatusColor = (val: string, range: string) => {
        if (range === 'N/A') return 'text-slate-900';
        // Very basic check, in real app parsing logic would be robust
        return 'text-slate-900';
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">REPORT VIEWER</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">LAB & DIAGNOSTIC RESULTS</p>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-50 rounded-[20px]"></div>)}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <tr>
                                    <th className="px-8 py-6">Test Name</th>
                                    <th className="px-8 py-6">Date</th>
                                    <th className="px-8 py-6">Result</th>
                                    <th className="px-8 py-6">Reference Range</th>
                                    <th className="px-8 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reports.map((report, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <Activity size={16} />
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm">{report.testName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-500">{report.date}</td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-slate-900">{report.value}</span>
                                            <span className="text-xs font-medium text-slate-400 ml-1">{report.unit}</span>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-medium text-slate-500">{report.range}</td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 text-slate-400 hover:text-olive-600 hover:bg-olive-50 rounded-lg transition-all" title="View Details">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-olive-600 hover:bg-olive-50 rounded-lg transition-all" title="Download PDF">
                                                    <Download size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
