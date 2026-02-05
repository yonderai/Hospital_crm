"use client";

import { useState, useEffect } from "react";
import {
    X, FileText, Activity, Calendar, User, AlertCircle,
    CheckCircle2, TrendingUp, TrendingDown, Scissors, Clock, Check, ClipboardList
} from "lucide-react";

interface PatientReportsModalProps {
    patientId: string;
    patientName: string;
    onClose: () => void;
}

export default function PatientReportsModal({ patientId, patientName, onClose }: PatientReportsModalProps) {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<any>({ results: [], radiologyReports: [], labResults: [], preSurgeryOrders: [], postSurgeryInstructions: [], surgeryCases: [] });
    const [activeTab, setActiveTab] = useState<'all' | 'radiology' | 'lab' | 'surgery'>('all');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`/api/doctor/surgery/patient-reports?patientId=${patientId}`);
                if (res.ok) {
                    const data = await res.json();
                    console.log('Patient Reports Data:', data);
                    setReports(data);
                } else {
                    const errorData = await res.json();
                    console.error('Failed to fetch patient reports:', errorData);
                }
            } catch (error) {
                console.error('Failed to fetch patient reports:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [patientId]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'final': return 'text-emerald-600 bg-emerald-50';
            case 'preliminary': return 'text-blue-600 bg-blue-50';
            case 'corrected': return 'text-orange-600 bg-orange-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-6xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-olive-50 rounded-3xl flex items-center justify-center text-olive-600 shadow-sm">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Patient Reports</h4>
                            <p className="text-[10px] text-olive-600 font-bold uppercase tracking-widest mt-1">
                                {patientName} • Pre-Surgical Review
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 bg-slate-50/50 px-10 shrink-0">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'all'
                            ? 'text-olive-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <FileText size={14} className="inline mr-2" />
                        All Reports ({reports.results?.length || 0})
                        {activeTab === 'all' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-olive-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('radiology')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'radiology'
                            ? 'text-olive-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Activity size={14} className="inline mr-2" />
                        Radiology ({reports.radiologyReports.length})
                        {activeTab === 'radiology' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-olive-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('lab')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'lab'
                            ? 'text-olive-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Activity size={14} className="inline mr-2" />
                        Lab Results ({reports.labResults.length})
                        {activeTab === 'lab' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-olive-600 rounded-t-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('surgery')}
                        className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'surgery'
                            ? 'text-olive-600'
                            : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Scissors size={14} className="inline mr-2" />
                        Surgery Reports ({reports.preSurgeryOrders.length + reports.postSurgeryInstructions.length + (reports.surgeryCases?.length || 0)})
                        {activeTab === 'surgery' && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-olive-600 rounded-t-full" />
                        )}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 border-4 border-olive-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Reports...</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* All Reports - Card Style View */}
                            {activeTab === 'all' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {reports.results?.length === 0 ? (
                                        <div className="col-span-full text-center py-20">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileText size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Reports Available</p>
                                        </div>
                                    ) : (
                                        reports.results?.map((item: any) => (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    if (item.type === 'lab') setActiveTab('lab');
                                                    else if (item.type === 'radiology') setActiveTab('radiology');
                                                    else if (item.type === 'surgery' || item.type === 'surgery_report') setActiveTab('surgery');
                                                }}
                                                className="group bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-olive-200 transition-all p-6 flex flex-col justify-between cursor-pointer"
                                            >
                                                <div>
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${item.type === 'lab'
                                                            ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                                            : item.type === 'radiology'
                                                                ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                                                                : item.type === 'surgery_report'
                                                                    ? 'bg-gradient-to-br from-olive-500 to-emerald-600'
                                                                    : 'bg-gradient-to-br from-orange-400 to-amber-600'
                                                            }`}>
                                                            {item.type === 'lab' ? <Activity className="text-white" size={20} /> :
                                                                item.type === 'radiology' ? <FileText className="text-white" size={20} /> :
                                                                    item.type === 'surgery_report' ? <Scissors className="text-white" size={20} /> :
                                                                        <ClipboardList className="text-white" size={20} />}
                                                        </div>
                                                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${item.status === 'final' || item.status === 'completed'
                                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    </div>

                                                    <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-olive-700 transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-3 italic">
                                                        {item.summary}
                                                    </p>

                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                                        <Calendar size={12} className="text-slate-300" />
                                                        {formatDate(item.date)}
                                                    </div>
                                                </div>

                                                <div className="mt-6">
                                                    <div className="w-full bg-slate-50 group-hover:bg-olive-600 group-hover:text-white border border-slate-100 group-hover:border-olive-500 p-3 rounded-2xl flex items-center justify-center text-slate-600 font-black text-xs uppercase tracking-widest transition-all">
                                                        {item.type === 'lab' ? 'Lab Report' :
                                                            item.type === 'radiology' ? 'Radiology Report' :
                                                                item.type === 'surgery' ? 'Surgery Order' :
                                                                    item.type === 'surgery_report' ? 'Operative Report' : 'Post-Op Instruction'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Radiology Reports */}
                            {activeTab === 'radiology' && (
                                <div className="space-y-6">
                                    {reports.radiologyReports.length === 0 ? (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <FileText size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Radiology Reports</p>
                                        </div>
                                    ) : (
                                        reports.radiologyReports.map((report: any) => (
                                            <div key={report.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                                                {/* Report Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                            <Activity size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-slate-900">
                                                                {report.title}
                                                            </h5>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                <Calendar size={12} className="inline mr-1" />
                                                                {formatDate(report.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${getStatusColor(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </div>

                                                {/* Findings */}
                                                {report.details?.report?.findings && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Findings</label>
                                                        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                                                            {report.details.report.findings}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Impression */}
                                                {report.details?.report?.impression && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impression</label>
                                                        <p className="text-sm text-slate-900 font-semibold leading-relaxed bg-olive-50/30 p-4 rounded-2xl">
                                                            {report.details.report.impression}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Recommendations */}
                                                {report.details?.report?.recommendations && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations</label>
                                                        <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/30 p-4 rounded-2xl">
                                                            {report.details.report.recommendations}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Interpreted By */}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                                    <User size={14} />
                                                    <span className="font-medium">
                                                        Report Date: {formatDate(report.date)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Lab Results */}
                            {activeTab === 'lab' && (
                                <div className="space-y-6">
                                    {reports.labResults.length === 0 ? (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Activity size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Lab Results</p>
                                        </div>
                                    ) : (
                                        reports.labResults.map((labOrder: any) => (
                                            <div key={labOrder.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                                                {/* Lab Order Header */}
                                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                            <Activity size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-slate-900">
                                                                {labOrder.title}
                                                            </h5>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                <Calendar size={12} className="inline mr-1" />
                                                                {formatDate(labOrder.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${getStatusColor(labOrder.status)}`}>
                                                            {labOrder.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Results Grid */}
                                                {labOrder.details?.results && labOrder.details.results.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {labOrder.details.results.map((result: any, idx: number) => (
                                                            <div key={idx} className="bg-slate-50 rounded-2xl p-6 space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <h6 className="text-sm font-black text-slate-900">{result.testName}</h6>
                                                                    {result.abnormalFlag && (
                                                                        <div className="w-6 h-6 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                                                                            <AlertCircle size={14} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className={`text-2xl font-black ${result.abnormalFlag ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                        {result.value}
                                                                    </span>
                                                                    <span className="text-sm font-bold text-slate-400">{result.unit}</span>
                                                                </div>
                                                                <p className="text-xs text-slate-500 font-medium">
                                                                    Reference: {result.referenceRange}
                                                                </p>
                                                                {result.notes && (
                                                                    <p className="text-xs text-slate-600 bg-yellow-50 p-2 rounded-lg">
                                                                        <span className="font-black uppercase text-[10px] text-yellow-700">Note: </span>
                                                                        {result.notes}
                                                                    </p>
                                                                )}
                                                                <div className="pt-2 border-t border-slate-200">
                                                                    {result.abnormalFlag ? (
                                                                        <span className="text-[10px] font-black text-red-600 uppercase flex items-center gap-1">
                                                                            <TrendingUp size={12} /> Abnormal
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1">
                                                                            <CheckCircle2 size={12} /> Normal
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 bg-slate-50 rounded-2xl">
                                                        <p className="text-sm text-slate-400 font-medium">Results pending</p>
                                                    </div>
                                                )}

                                                {/* Ordering Provider */}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                                    <User size={14} />
                                                    <span className="font-medium">
                                                        Ordered by: {labOrder.orderingProviderId?.firstName} {labOrder.orderingProviderId?.lastName}
                                                    </span>
                                                    {labOrder.reviewedBy && (
                                                        <>
                                                            <span className="mx-2">•</span>
                                                            <span className="font-medium">
                                                                Reviewed by: {labOrder.reviewedBy?.firstName} {labOrder.reviewedBy?.lastName}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {/* Surgery Orders */}
                            {activeTab === 'surgery' && (
                                <div className="space-y-6">
                                    {reports.preSurgeryOrders.length === 0 && reports.postSurgeryInstructions.length === 0 && (!reports.surgeryCases || reports.surgeryCases.length === 0) ? (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Scissors size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Surgery Reports found</p>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Operative Reports */}
                                            {reports.surgeryCases && reports.surgeryCases.length > 0 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-olive-50 rounded-xl flex items-center justify-center text-olive-600">
                                                            <FileText size={16} />
                                                        </div>
                                                        Operative Reports ({reports.surgeryCases.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {reports.surgeryCases.map((surgery: any) => (
                                                            <div key={surgery._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-olive-50 text-olive-600">
                                                                            <Scissors size={20} />
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-base font-black text-slate-900 capitalize">
                                                                                {surgery.procedureName}
                                                                            </h5>
                                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                                Surgeon: {surgery.surgeonId?.firstName} {surgery.surgeonId?.lastName} • {formatDate(surgery.surgeryReport?.reportDate || surgery.updatedAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-600">
                                                                        Completed
                                                                    </span>
                                                                </div>

                                                                {/* Findings Section */}
                                                                {surgery.surgeryReport?.findings && (
                                                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Operative Findings</label>
                                                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                                            {surgery.surgeryReport.findings}
                                                                        </p>
                                                                    </div>
                                                                )}

                                                                {/* Diagnosis */}
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    {surgery.surgeryReport?.preOpDiagnosis && (
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pre-Op Diagnosis</label>
                                                                            <p className="text-xs font-bold text-slate-800">{surgery.surgeryReport.preOpDiagnosis}</p>
                                                                        </div>
                                                                    )}
                                                                    {surgery.surgeryReport?.postOpDiagnosis && (
                                                                        <div className="space-y-1">
                                                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Post-Op Diagnosis</label>
                                                                            <p className="text-xs font-bold text-slate-800">{surgery.surgeryReport.postOpDiagnosis}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Pre-Surgery Orders */}
                                            {reports.preSurgeryOrders.length > 0 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                                            <Clock size={16} />
                                                        </div>
                                                        Pre-Surgery Orders ({reports.preSurgeryOrders.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {reports.preSurgeryOrders.map((order: any) => (
                                                            <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                                                                {/* Order Header */}
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                                            order.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                                                'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {order.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-base font-black text-slate-900 capitalize">
                                                                                {order.orderType.replace('_', ' ')}
                                                                            </h5>
                                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                                {order.caseId?.procedureName || 'Surgery'} • {formatDate(order.createdAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-2">
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                                            order.status === 'in-progress' ? 'bg-blue-50 text-blue-600' :
                                                                                order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                                                    'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {order.status}
                                                                        </span>
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${order.priority === 'stat' ? 'bg-red-50 text-red-600' :
                                                                            order.priority === 'urgent' ? 'bg-orange-50 text-orange-600' :
                                                                                'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {order.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Instructions & Results */}
                                                                <div className="space-y-3">
                                                                    {order.status === 'completed' ? (
                                                                        <div className="space-y-3">
                                                                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                                                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Nursing Report / Findings</label>
                                                                                <p className="text-sm text-emerald-900 font-bold leading-relaxed italic">
                                                                                    {order.nurseNotes || "Confirmed & Verified"}
                                                                                </p>
                                                                            </div>
                                                                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
                                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Original Instruction</label>
                                                                                <p className="text-xs text-slate-500 italic">
                                                                                    {order.instructions}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{order.instructions}</p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Assignment & Completion Info */}
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={12} />
                                                                        <span>
                                                                            By: {order.prescribedBy?.firstName} {order.prescribedBy?.lastName}
                                                                        </span>
                                                                    </div>
                                                                    {order.status === 'completed' && (
                                                                        <div className="flex items-center gap-1 text-emerald-600">
                                                                            <CheckCircle2 size={12} />
                                                                            <span>Done: {formatDate(order.completedAt)}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Post-Surgery Instructions */}
                                            {reports.postSurgeryInstructions.length > 0 && (
                                                <div className="space-y-4">
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                                            <Activity size={16} />
                                                        </div>
                                                        Post-Surgery Instructions ({reports.postSurgeryInstructions.length})
                                                    </h4>
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {reports.postSurgeryInstructions.map((instruction: any) => (
                                                            <div key={instruction._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
                                                                {/* Instruction Header */}
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${instruction.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                                            instruction.status === 'in-progress' ? 'bg-purple-50 text-purple-600' :
                                                                                'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {instruction.status === 'completed' ? <CheckCircle2 size={20} /> : <Activity size={20} />}
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="text-base font-black text-slate-900 capitalize">
                                                                                {instruction.instructionType.replace('_', ' ')}
                                                                            </h5>
                                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                                {instruction.caseId?.procedureName || 'Surgery'} • {formatDate(instruction.createdAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end gap-2">
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${instruction.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                                                                            instruction.status === 'in-progress' ? 'bg-purple-50 text-purple-600' :
                                                                                instruction.status === 'discontinued' ? 'bg-red-50 text-red-600' :
                                                                                    'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {instruction.status}
                                                                        </span>
                                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${instruction.priority === 'critical' ? 'bg-red-50 text-red-600' :
                                                                            instruction.priority === 'urgent' ? 'bg-orange-50 text-orange-600' :
                                                                                'bg-slate-50 text-slate-600'
                                                                            }`}>
                                                                            {instruction.priority}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                {/* Instructions & Results */}
                                                                <div className="space-y-3">
                                                                    {instruction.status === 'completed' ? (
                                                                        <div className="space-y-3">
                                                                            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                                                                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Nurse Action / Note</label>
                                                                                <p className="text-sm text-emerald-900 font-bold leading-relaxed italic">
                                                                                    {instruction.nurseNotes || "Action Completed"}
                                                                                </p>
                                                                            </div>
                                                                            <div className="bg-slate-50/50 p-4 rounded-2xl border border-dashed border-slate-200">
                                                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Prescribed Instruction</label>
                                                                                <p className="text-xs text-slate-500 italic">
                                                                                    {instruction.instructions}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                                                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{instruction.instructions}</p>
                                                                            {(instruction.frequency || instruction.duration) && (
                                                                                <div className="flex items-center gap-4 pt-2 border-t border-slate-200 mt-3">
                                                                                    {instruction.frequency && (
                                                                                        <span className="text-xs text-slate-600 font-bold">
                                                                                            Frequency: {instruction.frequency}
                                                                                        </span>
                                                                                    )}
                                                                                    {instruction.duration && (
                                                                                        <span className="text-xs text-slate-600 font-bold">
                                                                                            Duration: {instruction.duration}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Assignment & Completion Info */}
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={12} />
                                                                        <span>
                                                                            By: {instruction.prescribedBy?.firstName} {instruction.prescribedBy?.lastName}
                                                                        </span>
                                                                    </div>
                                                                    {instruction.status === 'completed' && (
                                                                        <div className="flex items-center gap-1 text-emerald-600">
                                                                            <CheckCircle2 size={12} />
                                                                            <span>Done: {formatDate(instruction.completedAt)}</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Completion Details */}
                                                                {instruction.status === 'completed' && (
                                                                    <div className="bg-emerald-50 p-4 rounded-2xl space-y-2">
                                                                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                                                                            <CheckCircle2 size={14} />
                                                                            <span>Completed by {instruction.completedBy?.firstName} {instruction.completedBy?.lastName}</span>
                                                                            <span className="mx-2">•</span>
                                                                            <span>{formatDate(instruction.completedAt)}</span>
                                                                        </div>
                                                                        {instruction.nurseNotes && (
                                                                            <p className="text-sm text-emerald-800 mt-2">
                                                                                <span className="font-black uppercase text-[10px]">Notes: </span>
                                                                                {instruction.nurseNotes}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-10 border-t border-slate-100 bg-white flex justify-end shrink-0">
                    <button
                        onClick={onClose}
                        className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 transition-all shadow-lg"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
