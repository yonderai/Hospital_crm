"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { FileText, Eye, Download, Activity, AlertCircle, X, Microscope, Aperture } from "lucide-react";

export default function PatientReportViewerPage() {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<any[]>([]);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        fetch('/api/patient/reports')
            .then(res => res.json())
            .then(json => {
                setReports(json.data || []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">REPORT VIEWER</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">LAB & DIAGNOSTIC RESULTS</p>
                    </div>
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-6 shadow-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lab Results</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Radiology</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-20 bg-slate-50 rounded-[24px]"></div>)}
                    </div>
                ) : (
                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <tr>
                                    <th className="px-10 py-6">Diagnostic Test</th>
                                    <th className="px-10 py-6">Date</th>
                                    <th className="px-10 py-6">Result / Finding</th>
                                    <th className="px-10 py-6">Reference</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reports.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic">No reports found in your medical wallet.</td></tr>
                                ) : reports.map((report, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border ${report.type === 'LAB'
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                        : 'bg-purple-50 text-purple-600 border-purple-100'
                                                    }`}>
                                                    {report.type === 'LAB' ? <Microscope size={20} /> : <Aperture size={20} />}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-900 text-sm block tracking-tight">{report.testName}</span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{report.type}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase">{report.date}</td>
                                        <td className="px-10 py-6">
                                            <div className="max-w-xs">
                                                <span className="text-sm font-black text-slate-800 line-clamp-1 italic tracking-tight">{report.value}</span>
                                                {report.unit && <span className="text-[10px] font-bold text-olive-600 ml-1 bg-olive-50 px-1.5 rounded">{report.unit}</span>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">{report.range}</td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setSelectedReport(report)}
                                                    className="px-4 py-2 bg-olive-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm hover:bg-olive-700 transition-all flex items-center gap-2"
                                                >
                                                    <Eye size={12} /> View Report
                                                </button>
                                                <button className="p-2 text-slate-400 hover:text-slate-900 transition-all" title="Download PDF">
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

            {/* Report Detail Modal */}
            {selectedReport && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-10 border-b border-slate-50 flex justify-between items-start">
                            <div>
                                <p className="text-olive-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Diagnostic Interpretaton</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">{selectedReport.testName}</h3>
                                <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">{selectedReport.date} • {selectedReport.status}</p>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-all">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
                            {selectedReport.type === 'LAB' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-10">
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Measured Value</p>
                                            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
                                                {selectedReport.value}
                                                <span className="text-lg font-bold text-olive-600 ml-2">{selectedReport.unit}</span>
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reference Range</p>
                                            <p className="text-xl font-black text-slate-500 tracking-tight">{selectedReport.range}</p>
                                        </div>
                                    </div>
                                    <div className="bg-olive-50 p-8 rounded-[32px] border border-olive-100/50">
                                        <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <AlertCircle size={14} /> Clinical Significance
                                        </p>
                                        <p className="text-sm text-olive-900 leading-relaxed font-medium italic">
                                            The laboratory report indicates a {selectedReport.status.toLowerCase()} status. Please consult your physician for a full clinical correlation of these results with your current symptoms.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-l-4 border-olive-500 pl-4">Findings</p>
                                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap font-medium">{selectedReport.findings}</p>
                                    </div>
                                    <div className="bg-slate-900 p-8 rounded-[32px] text-white">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Impression</p>
                                        <p className="text-lg font-black tracking-tight italic leading-snug">"{selectedReport.value}"</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl">
                                Download Clinical PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
