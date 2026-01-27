"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Beaker, AlertCircle, Calendar, User, FileText, CheckCircle2, Clock, ChevronRight } from "lucide-react";

interface LabResult {
    _id: string;
    orderId: string;
    patientId: string;
    orderingProviderId: {
        firstName: string;
        lastName: string;
        department: string;
    };
    tests: string[];
    status: "ordered" | "scheduled" | "collected" | "in-progress" | "completed" | "cancelled";
    results: {
        testName: string;
        value: string;
        unit: string;
        referenceRange: string;
        abnormalFlag: boolean;
        notes?: string;
    }[];
    resultDate?: string;
    createdAt: string;
}

export default function PatientLabResultsPage() {
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [debugInfo, setDebugInfo] = useState<string>("");
    const [selectedReport, setSelectedReport] = useState<LabResult | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch("/api/patient/lab-results");
                if (res.ok) {
                    const json = await res.json();
                    const labData = json.data || [];
                    setResults(Array.isArray(labData) ? labData : []);
                    setDebugInfo(`Email: ${json.debug_email || 'N/A'}, PID: ${json.debug_patient_id || 'N/A'}, Count: ${labData.length}`);
                } else {
                    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
                    setDebugInfo(`Error ${res.status}: ${JSON.stringify(errorData)}`);
                }
            } catch (error: any) {
                console.error("Failed to fetch lab results:", error);
                setDebugInfo(`Exception: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "completed":
                return { label: "Ready", color: "text-green-600 bg-green-50", icon: CheckCircle2 };
            case "cancelled":
                return { label: "Cancelled", color: "text-red-600 bg-red-50", icon: AlertCircle };
            case "ordered":
                return { label: "Prescribed", color: "text-blue-600 bg-blue-50", icon: FileText };
            default:
                return { label: "Processing", color: "text-yellow-600 bg-yellow-50", icon: Clock };
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="p-10 text-slate-400 font-bold animate-pulse">Loading your diagnostic hub...</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Diagnostic Hub</h1>
                        <p className="text-olive-600 text-sm font-bold mt-2">Track prescribed tests and view clinical results</p>
                    </div>
                </div>

                {results.length === 0 ? (
                    <div className="bg-white rounded-[40px] p-20 text-center border border-slate-100 shadow-sm">
                        <Beaker size={64} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No diagnostics found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {results.map((result) => {
                            const status = getStatusConfig(result.status);
                            const Icon = status.icon;

                            return (
                                <div
                                    key={result._id}
                                    onClick={() => result.status === 'completed' && setSelectedReport(result)}
                                    className={`bg-white rounded-[40px] p-8 border border-slate-100 transition-all ${result.status === 'completed'
                                            ? 'cursor-pointer hover:shadow-2xl hover:border-olive-200 hover:scale-[1.01]'
                                            : 'opacity-80'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${status.color}`}>
                                                <Icon size={32} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-black text-slate-900">
                                                        {result.tests.join(", ")}
                                                    </h3>
                                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-bold text-slate-500 mt-1">
                                                    Dr. {result.orderingProviderId?.firstName} {result.orderingProviderId?.lastName} • {result.orderingProviderId?.department}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ordered On</p>
                                                <p className="text-sm font-black text-slate-900">
                                                    {new Date(result.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {result.status === 'completed' ? (
                                                <ChevronRight className="text-olive-600" size={32} />
                                            ) : (
                                                <Clock className="text-slate-300" size={24} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Formal Report Modal */}
                {selectedReport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-5xl rounded-[60px] shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-12 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 h-20 bg-olive-600 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-olive-600/30">
                                        <Beaker size={40} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-4">
                                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Laboratory Report</h2>
                                            <span className="px-5 py-2 bg-green-100 text-green-700 rounded-2xl text-xs font-black uppercase tracking-widest">Official Record</span>
                                        </div>
                                        <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Report ID: {selectedReport.orderId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="w-16 h-16 flex items-center justify-center bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-[32px] transition-all border border-slate-100 shadow-sm"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-12 space-y-12">
                                {/* Header Details */}
                                <div className="grid grid-cols-3 gap-12 p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Patient Detail</p>
                                        <p className="text-lg font-black text-slate-900">Patient #{selectedReport.patientId.slice(-6).toUpperCase()}</p>
                                        <p className="text-sm font-bold text-slate-500 mt-1 italic">Verified by Identity Module</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Ordering Provider</p>
                                        <p className="text-lg font-black text-slate-900">Dr. {selectedReport.orderingProviderId?.firstName} {selectedReport.orderingProviderId?.lastName}</p>
                                        <p className="text-sm font-bold text-olive-600 mt-1">{selectedReport.orderingProviderId?.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Validated On</p>
                                        <p className="text-lg font-black text-slate-900">
                                            {selectedReport.resultDate ? new Date(selectedReport.resultDate).toLocaleString() : 'N/A'}
                                        </p>
                                        <p className="text-sm font-bold text-slate-500 mt-1 italic">Diagnostics Core Station α</p>
                                    </div>
                                </div>

                                {/* Results Table */}
                                <div className="space-y-6">
                                    <h4 className="text-xl font-black text-slate-900 uppercase tracking-widest border-l-4 border-olive-600 pl-4">Test Analytics</h4>
                                    <div className="space-y-4">
                                        {selectedReport.results.map((test, idx) => (
                                            <div key={idx} className={`p-8 rounded-[36px] border ${test.abnormalFlag ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'} flex items-center justify-between shadow-sm`}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-4 mb-2">
                                                        <p className="text-xl font-black text-slate-900">{test.testName}</p>
                                                        {test.abnormalFlag && (
                                                            <span className="px-3 py-1 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase flex items-center gap-2">
                                                                <AlertCircle size={12} /> CRITICAL
                                                            </span>
                                                        )}
                                                    </div>
                                                    {test.notes && <p className="text-sm font-medium text-slate-500 mt-2 italic">“{test.notes}”</p>}
                                                </div>
                                                <div className="flex items-center gap-16">
                                                    <div className="text-center">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Value</p>
                                                        <p className={`text-4xl font-black tracking-tighter ${test.abnormalFlag ? 'text-red-600' : 'text-slate-900'}`}>
                                                            {test.value} <span className="text-lg font-bold text-slate-400">{test.unit}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-center min-w-[120px]">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Ref. Range</p>
                                                        <p className="text-lg font-black text-slate-700">{test.referenceRange}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Signatures */}
                                <div className="pt-8 border-t border-slate-100 flex justify-between items-end">
                                    <div className="space-y-2">
                                        <div className="w-48 h-px bg-slate-300 mb-4"></div>
                                        <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Digital Signature</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Medicore Lab Station</p>
                                    </div>
                                    <div className="text-right text-slate-300">
                                        <FileText size={80} strokeWidth={1} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
