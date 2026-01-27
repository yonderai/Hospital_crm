"use client";
import { useState, useEffect } from "react";
import ConsultationForm from "./ConsultationForm";
import PrescriptionForm from "./PrescriptionForm";
import LabOrderForm from "./LabOrderForm";
import RadiologyOrderForm from "./RadiologyOrderForm";
import {
    User, Activity, FileText, FlaskConical, Pill,
    History, Clock, CheckCircle2, AlertCircle, Calendar,
    ChevronRight, ExternalLink
} from "lucide-react";

export default function ClinicalProfile({ patient, onBack }: { patient: any; onBack: () => void }) {
    const [activeTab, setActiveTab] = useState("consultation");
    const [history, setHistory] = useState<any>({
        prescriptions: [],
        labs: [],
        radiology: [],
        loading: true
    });

    const fetchHistory = async () => {
        try {
            setHistory(prev => ({ ...prev, loading: true }));
            const [rxRes, labsRes, radRes] = await Promise.all([
                fetch(`/api/patients/${patient._id}/prescriptions`),
                fetch(`/api/patients/${patient._id}/labs`),
                fetch(`/api/patients/${patient._id}/radiology`)
            ]);

            const [rxData, labsData, radData] = await Promise.all([
                rxRes.ok ? rxRes.json() : [],
                labsRes.ok ? labsRes.json() : [],
                radRes.ok ? radRes.json() : []
            ]);

            setHistory({
                prescriptions: rxData,
                labs: labsData,
                radiology: radData,
                loading: false
            });
        } catch (error) {
            console.error("Failed to fetch history:", error);
            setHistory(prev => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        if (patient?._id) {
            fetchHistory();
        }
    }, [patient?._id]);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 p-6 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-6">
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all">
                        &larr; Back to List
                    </button>
                    <div>
                        <div className="flex items-center gap-4">
                            <h2 className="text-3xl font-black text-slate-900 italic tracking-tight">
                                {patient.firstName} {patient.lastName}
                            </h2>
                            <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-200">MRN: {patient.mrn}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-bold flex space-x-4 mt-2 uppercase tracking-tight">
                            <span>{new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs • {patient.gender}</span>
                            <span className="text-red-500 font-black flex items-center gap-1">
                                <AlertCircle size={12} /> Allergies: {patient.allergies.join(", ") || "None Recorded"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Global Status</div>
                    <div className="font-black text-olive-600 uppercase text-xs mt-1 italic tracking-widest">Active Consultation</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-8">
                {[
                    { id: 'consultation', label: 'Consultation', icon: FileText },
                    { id: 'prescription', label: 'Prescription', icon: Pill },
                    { id: 'labs', label: 'Lab Orders', icon: FlaskConical },
                    { id: 'radiology', label: 'Radiology', icon: Activity },
                    { id: 'timeline', label: 'Timeline', icon: History }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-8 py-5 text-[11px] font-black uppercase tracking-[0.2em] border-b-4 flex items-center transition-all ${activeTab === tab.id
                                ? 'border-olive-600 text-olive-600'
                                : 'border-transparent text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <tab.icon size={16} className="mr-3" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto p-10 bg-[#F8FAFC]">
                <div className="max-w-5xl mx-auto space-y-12">

                    {/* Forms Rendering Section */}
                    <div className="space-y-12">
                        {activeTab === "consultation" && (
                            <ConsultationForm patientId={patient._id} onSuccess={fetchHistory} />
                        )}
                        {activeTab === "prescription" && (
                            <div className="space-y-12">
                                <PrescriptionForm patientId={patient._id} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Medication History"
                                    icon={Pill}
                                    loading={history.loading}
                                    data={history.prescriptions}
                                    renderItem={(rx: any) => (
                                        <div key={rx._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:border-olive-400 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(rx.prescribedDate).toLocaleDateString()}</p>
                                                    <h4 className="text-sm font-bold text-slate-900 mt-1 uppercase">Order Ref: {rx.prescriptionId.slice(-8)}</h4>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${rx.status === 'active' ? 'bg-olive-50 text-olive-600 border border-olive-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                                    }`}>
                                                    {rx.status}
                                                </span>
                                            </div>
                                            <div className="space-y-3">
                                                {rx.medications.map((m: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-xs py-2 border-t border-slate-50 first:border-0 first:pt-0">
                                                        <span className="font-bold text-slate-700">{m.drugName} ({m.dosage})</span>
                                                        <span className="text-slate-400 font-medium italic">{m.frequency} x {m.duration}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {activeTab === "labs" && (
                            <div className="space-y-12">
                                <LabOrderForm patientId={patient._id} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Diagnostic Archive"
                                    icon={FlaskConical}
                                    loading={history.loading}
                                    data={history.labs}
                                    renderItem={(lab: any) => (
                                        <div key={lab._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between group">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${lab.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    <FlaskConical size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{(lab.tests || [lab.testType]).join(', ')}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                                        {new Date(lab.createdAt).toLocaleDateString()} • {lab.status.toUpperCase()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {lab.status === 'completed' && lab.results?.[0] ? (
                                                    <div className="flex items-center gap-6">
                                                        <div>
                                                            <p className="text-2xl font-black text-slate-900 italic tracking-tighter">{lab.results[0].value}</p>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lab.results[0].unit}</p>
                                                        </div>
                                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 translate-x-0 group-hover:translate-x-1 transition-all" />
                                                    </div>
                                                ) : (
                                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic animate-pulse">Processing...</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {activeTab === "radiology" && (
                            <div className="space-y-12">
                                <RadiologyOrderForm patientId={patient._id} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Imaging Findings"
                                    icon={Activity}
                                    loading={history.loading}
                                    data={history.radiology}
                                    renderItem={(item: any) => (
                                        <div key={item._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-purple-400 transition-all group">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                                        <Activity size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.imagingType} • {item.bodyPart}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.status === 'completed' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            {item.report ? (
                                                <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 italic">
                                                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">"{item.report.interpretation}"</p>
                                                    <button className="text-[9px] font-black text-purple-600 uppercase tracking-widest mt-3 flex items-center gap-1 hover:underline">
                                                        View Full Report <ExternalLink size={10} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="h-12 flex items-center justify-center border border-dashed border-slate-100 rounded-2xl">
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em] italic">Waiting for Radiologist</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {activeTab === "timeline" && (
                            <div className="bg-white rounded-[48px] p-20 border border-slate-100 text-center space-y-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300 border border-slate-100">
                                    <Clock size={32} />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-2xl font-black text-slate-900 tracking-tight italic">Temporal Reconstruction</h4>
                                    <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto">
                                        Clinical timeline visualization is currently synchronizing with the central repository.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClinicalSection({ title, icon: Icon, loading, data, renderItem }: any) {
    if (loading) return (
        <div className="space-y-6 animate-pulse px-2">
            <div className="h-6 w-48 bg-slate-200 rounded-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-32 bg-slate-100 rounded-[32px]" />
                <div className="h-32 bg-slate-100 rounded-[32px]" />
            </div>
        </div>
    );

    if (!data || data.length === 0) return null;

    return (
        <div className="space-y-8 px-2">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
                    <Icon size={18} className="text-slate-300" /> {title}
                </h3>
            </div>
            <div className={`grid grid-cols-1 ${data.length > 2 ? 'md:grid-cols-2' : ''} gap-8`}>
                {data.map(renderItem)}
            </div>
        </div>
    );
}
