"use client";

import { useState, useEffect } from "react";
import { X, FileText, Activity, Calendar, User, AlertCircle, CheckCircle2, TrendingUp, TrendingDown, Scissors, Clock } from "lucide-react";

interface PatientReportsModalProps {
    patientId: string;
    patientName: string;
    onClose: () => void;
}

export default function PatientReportsModal({ patientId, patientName, onClose }: PatientReportsModalProps) {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<any>({ radiologyReports: [], labResults: [], preSurgeryOrders: [], postSurgeryInstructions: [] });
    const [activeTab, setActiveTab] = useState<'radiology' | 'lab' | 'surgery'>('radiology');

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await fetch(`/api/doctor/surgery/patient-reports?patientId=${patientId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReports(data);
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
                        Surgery Orders ({reports.preSurgeryOrders.length + reports.postSurgeryInstructions.length})
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
                                            <div key={report._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                                                {/* Report Header */}
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                            <Activity size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-slate-900">
                                                                {report.orderId?.testType || 'Imaging Study'}
                                                            </h5>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                <Calendar size={12} className="inline mr-1" />
                                                                {formatDate(report.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${getStatusColor(report.status)}`}>
                                                        {report.status}
                                                    </span>
                                                </div>

                                                {/* Findings */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Findings</label>
                                                    <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl">
                                                        {report.findings}
                                                    </p>
                                                </div>

                                                {/* Impression */}
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Impression</label>
                                                    <p className="text-sm text-slate-900 font-semibold leading-relaxed bg-olive-50/30 p-4 rounded-2xl">
                                                        {report.impression}
                                                    </p>
                                                </div>

                                                {/* Recommendations */}
                                                {report.recommendations && (
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommendations</label>
                                                        <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/30 p-4 rounded-2xl">
                                                            {report.recommendations}
                                                        </p>
                                                    </div>
                                                )}

                                                {/* Interpreted By */}
                                                <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-100">
                                                    <User size={14} />
                                                    <span className="font-medium">
                                                        Interpreted by: {report.interpretedBy?.firstName} {report.interpretedBy?.lastName}
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
                                            <div key={labOrder._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                                                {/* Lab Order Header */}
                                                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                                            <Activity size={20} />
                                                        </div>
                                                        <div>
                                                            <h5 className="text-lg font-black text-slate-900">
                                                                {labOrder.tests?.join(', ') || 'Lab Test'}
                                                            </h5>
                                                            <p className="text-xs text-slate-500 font-medium mt-1">
                                                                <Calendar size={12} className="inline mr-1" />
                                                                {formatDate(labOrder.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase ${getStatusColor(labOrder.status)}`}>
                                                            {labOrder.status}
                                                        </span>
                                                        {labOrder.priority && (
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${labOrder.priority === 'stat' ? 'bg-red-50 text-red-600' :
                                                                labOrder.priority === 'urgent' ? 'bg-orange-50 text-orange-600' :
                                                                    'bg-slate-50 text-slate-600'
                                                                }`}>
                                                                {labOrder.priority}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Results Grid */}
                                                {labOrder.results && labOrder.results.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {labOrder.results.map((result: any, idx: number) => (
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
                                    {reports.preSurgeryOrders.length === 0 && reports.postSurgeryInstructions.length === 0 ? (
                                        <div className="text-center py-20">
                                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Scissors size={32} className="text-slate-300" />
                                            </div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Surgery Orders</p>
                                        </div>
                                    ) : (
                                        <>
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

                                                                {/* Instructions */}
                                                                <div className="bg-slate-50 p-4 rounded-2xl">
                                                                    <p className="text-sm text-slate-700 leading-relaxed">{order.instructions}</p>
                                                                </div>

                                                                {/* Assignment & Completion Info */}
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={14} />
                                                                        <span className="font-medium">
                                                                            Prescribed by: {order.prescribedBy?.firstName} {order.prescribedBy?.lastName}
                                                                        </span>
                                                                    </div>
                                                                    {order.assignedTo && (
                                                                        <span className="font-medium">
                                                                            Assigned to: {order.assignedTo?.firstName} {order.assignedTo?.lastName}
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {/* Completion Details */}
                                                                {order.status === 'completed' && (
                                                                    <div className="bg-emerald-50 p-4 rounded-2xl space-y-2">
                                                                        <div className="flex items-center gap-2 text-xs text-emerald-700 font-bold">
                                                                            <CheckCircle2 size={14} />
                                                                            <span>Completed by {order.completedBy?.firstName} {order.completedBy?.lastName}</span>
                                                                            <span className="mx-2">•</span>
                                                                            <span>{formatDate(order.completedAt)}</span>
                                                                        </div>
                                                                        {order.nurseNotes && (
                                                                            <p className="text-sm text-emerald-800 mt-2">
                                                                                <span className="font-black uppercase text-[10px]">Notes: </span>
                                                                                {order.nurseNotes}
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
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

                                                                {/* Instructions */}
                                                                <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                                                                    <p className="text-sm text-slate-700 leading-relaxed">{instruction.instructions}</p>
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

                                                                {/* Assignment & Completion Info */}
                                                                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                                                                    <div className="flex items-center gap-2">
                                                                        <User size={14} />
                                                                        <span className="font-medium">
                                                                            Prescribed by: {instruction.prescribedBy?.firstName} {instruction.prescribedBy?.lastName}
                                                                        </span>
                                                                    </div>
                                                                    {instruction.assignedTo && (
                                                                        <span className="font-medium">
                                                                            Assigned to: {instruction.assignedTo?.firstName} {instruction.assignedTo?.lastName}
                                                                        </span>
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
