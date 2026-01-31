"use client";
import { useState, useEffect } from "react";
import ConsultationForm from "./ConsultationForm";
import PrescriptionForm from "./PrescriptionForm";
import LabOrderForm from "./LabOrderForm";
import RadiologyOrderForm from "./RadiologyOrderForm";
import SurgeryOrderForm from "./SurgeryOrderForm";
import {
    User, Activity, FileText, FlaskConical, Pill,
    History, Clock, CheckCircle2, AlertCircle, Calendar, Stethoscope,
    ChevronRight, ExternalLink, ZoomIn, Scissors, Scan, Download, X
} from "lucide-react";
import ReportModal from "./ReportModal";
import { format } from "date-fns";

export default function ClinicalProfile(props: { patient: any; onBack: () => void; initialTab?: string; appointmentId?: string; encounterId?: string }) {
    const { onBack, appointmentId, encounterId, patient, initialTab = "overview" } = props;
    const [activeTab, setActiveTab] = useState(initialTab);
    const [history, setHistory] = useState<any>({
        prescriptions: [],
        labs: [],
        radiology: [],
        surgeries: [],
        consultations: [],
        documents: [],
        loading: true
    });
    const [selectedReport, setSelectedReport] = useState<any | null>(null);
    const [previewDoc, setPreviewDoc] = useState<any | null>(null);

    const fetchHistory = async () => {
        try {
            setHistory((prev: any) => ({ ...prev, loading: true }));
            const [rxRes, labsRes, radRes, surgeryRes, consultRes, docRes] = await Promise.all([
                fetch(`/api/patients/${patient._id}/prescriptions`),
                fetch(`/api/patients/${patient._id}/labs`),
                fetch(`/api/patients/${patient._id}/radiology`),
                fetch(`/api/patients/${patient._id}/surgery`),
                fetch(`/api/patients/${patient._id}/consultations`),
                fetch(`/api/patient/documents?patientId=${patient._id}`)
            ]);

            const [rxData, labsData, radData, consultData, docData] = await Promise.all([
                rxRes.ok ? rxRes.json() : [],
                labsRes.ok ? labsRes.json() : [],
                radRes.ok ? radRes.json() : [],
                consultRes.ok ? consultRes.json() : [],
                docRes.ok ? docRes.json() : { documents: [] }
            ]);

            const surgeriesData = await fetch(`/api/patients/${patient._id}/surgery`).then(r => r.ok ? r.json() : []);

            setHistory({
                prescriptions: rxData,
                labs: labsData,
                radiology: radData,
                surgeries: surgeriesData,
                consultations: consultData,
                documents: docData.documents || [],
                loading: false
            });
        } catch (error) {
            console.error("Failed to fetch history:", error);
            setHistory((prev: any) => ({ ...prev, loading: false }));
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
                                <AlertCircle size={12} /> Allergies: {patient.allergies?.join(", ") || "None Recorded"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Global Status</div>
                    <div className="font-black text-olive-600 uppercase text-xs mt-1 italic tracking-widest">Active Consultation</div>
                </div>
            </div>

            {/* Report Modal Integration */}
            {selectedReport && (
                <ReportModal
                    imageUrl={selectedReport.url}
                    title={selectedReport.title}
                    data={selectedReport.data}
                    onClose={() => setSelectedReport(null)}
                />
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                {[
                    { id: 'overview', label: 'Overview', icon: History },
                    { id: 'consultation', label: 'Consultation', icon: FileText },
                    { id: 'prescription', label: 'Prescription', icon: Pill },
                    { id: 'labs', label: 'Lab Orders', icon: FlaskConical },
                    { id: 'radiology', label: 'Radiology', icon: Scan },
                    { id: 'surgery', label: 'Surgery', icon: Scissors },
                    { id: 'archive', label: 'Records Archive', icon: Activity }
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
                <div className="max-w-6xl mx-auto space-y-12">

                    {activeTab === "overview" && (
                        <div className="space-y-8">
                            {/* Patient Quick Info Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User size={14} /> Demographics
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-slate-50 pb-2">
                                            <span className="text-xs text-slate-500">Blood Type</span>
                                            <span className="text-xs font-bold text-red-600">{patient.bloodType || "N/A"}</span>
                                        </div>
                                        <div className="items-start">
                                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Chronic Conditions</p>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {patient.chronicConditions?.map((c: string) => (
                                                    <span key={c} className="text-[9px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-bold uppercase">{c}</span>
                                                )) || <span className="text-[9px] text-slate-400 italic">None</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <FileText size={14} /> Insurance & Billing
                                    </h4>
                                    <div className="space-y-3">
                                        <div className="flex justify-between border-b border-slate-50 pb-2">
                                            <span className="text-xs text-slate-500">Provider</span>
                                            <span className="text-xs font-bold text-slate-800">{patient.insuranceInfo?.provider || "N/A"}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-50 pb-2">
                                            <span className="text-xs text-slate-500">Policy #</span>
                                            <span className="text-xs font-mono font-bold text-slate-800">{patient.insuranceInfo?.policyNumber || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle size={14} /> Emergency Contact
                                    </h4>
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-slate-800">{patient.emergencyContact?.name || "N/A"}</p>
                                        <p className="text-xs text-slate-500">{patient.emergencyContact?.relation || ""}</p>
                                        <p className="text-xs font-mono font-bold text-olive-600">{patient.emergencyContact?.phone || "No phone"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* History Summary Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Recent Prescription */}
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Pill size={14} /> Recent Medication
                                        </h4>
                                        <button onClick={() => setActiveTab('prescription')} className="text-[9px] font-black text-olive-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                            View All <ChevronRight size={10} />
                                        </button>
                                    </div>
                                    {history.loading ? (
                                        <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                    ) : history.prescriptions[0] ? (
                                        <div onClick={() => setSelectedReport({
                                            url: "/brain/7e558bad-ff5f-46ac-afb7-d36c8d2b6454/mock_lab_report_john_doe_1769605788071.png",
                                            title: `Lab Report: ${history.prescriptions[0].prescriptionId.slice(-8)}`
                                        })} className="space-y-4 cursor-pointer hover:opacity-80 transition-opacity">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref: {history.prescriptions[0].prescriptionId.slice(-8)} • {format(new Date(history.prescriptions[0].prescribedDate), "MMM dd, yyyy HH:mm")}</p>
                                            <div className="space-y-2">
                                                {history.prescriptions[0].medications.slice(0, 2).map((m: any, i: number) => (
                                                    <div key={i} className="flex justify-between text-xs p-3 bg-slate-50 rounded-xl">
                                                        <span className="font-bold text-slate-700">{m.drugName}</span>
                                                        <span className="text-slate-400 font-medium italic">{m.dosage} • {m.frequency}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No medication history found.</p>
                                    )}
                                </div>

                                {/* Recent Lab */}
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FlaskConical size={14} /> Diagnostic Status
                                        </h4>
                                        <button onClick={() => setActiveTab('labs')} className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                            View Archive <ChevronRight size={10} />
                                        </button>
                                    </div>
                                    {history.loading ? (
                                        <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                    ) : history.labs[0] ? (
                                        <div onClick={() => setSelectedReport({
                                            title: `Diagnostic Report: ${history.labs[0].testType}`,
                                            data: {
                                                type: 'lab',
                                                patientName: `${patient.firstName} ${patient.lastName}`,
                                                mrn: patient.mrn,
                                                date: format(new Date(history.labs[0].createdAt), "MMM dd, yyyy HH:mm"),
                                                results: history.labs[0].results?.map((r: any) => ({
                                                    testName: r.testName,
                                                    value: r.value,
                                                    unit: r.unit,
                                                    referenceRange: r.referenceRange,
                                                    abnormalFlag: r.abnormalFlag
                                                }))
                                            }
                                        })} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <div>
                                                <h5 className="text-xs font-black text-slate-900 uppercase">{(history.labs[0].tests || [history.labs[0].testType]).join(', ')}</h5>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(history.labs[0].createdAt), "MMM dd, yyyy HH:mm")}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-900 italic tracking-tighter">{history.labs[0].results?.[0]?.value || history.labs[0].status}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{history.labs[0].results?.[0]?.unit || ""}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No diagnostic history found.</p>
                                    )}
                                </div>

                                {/* Recent Radiology */}
                                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm md:col-span-2">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Activity size={14} /> Imaging Timeline
                                        </h4>
                                        <button onClick={() => setActiveTab('radiology')} className="text-[9px] font-black text-purple-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                            View Gallery <ChevronRight size={10} />
                                        </button>
                                    </div>
                                    {history.loading ? (
                                        <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                    ) : history.radiology[0] ? (
                                        <div onClick={() => setSelectedReport({
                                            title: `Imaging Report: ${history.radiology[0].imagingType}`,
                                            data: {
                                                type: 'radiology',
                                                patientName: `${patient.firstName} ${patient.lastName}`,
                                                mrn: patient.mrn,
                                                date: format(new Date(history.radiology[0].createdAt), "MMM dd, yyyy HH:mm"),
                                                radiology: {
                                                    findings: history.radiology[0].report?.findings || "Findings pending interpretation.",
                                                    impression: history.radiology[0].report?.impression || "Impression pending.",
                                                    recommendations: history.radiology[0].report?.recommendations
                                                }
                                            }
                                        })} className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                                <Activity size={20} />
                                            </div>
                                            <div className="flex-1">
                                                <h5 className="text-xs font-black text-slate-900 uppercase">{history.radiology[0].imagingType} • {history.radiology[0].bodyPart}</h5>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(history.radiology[0].createdAt), "MMM dd, yyyy HH:mm")}</p>
                                            </div>
                                            <div className="max-w-md hidden lg:block">
                                                <p className="text-[10px] text-slate-500 italic line-clamp-1">"{history.radiology[0].report?.interpretation || "Report Pending"}"</p>
                                            </div>
                                            <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${history.radiology[0].status === 'completed' ? 'bg-purple-50 text-purple-600' : 'bg-slate-200 text-slate-500'}`}>
                                                {history.radiology[0].status}
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic">No imaging history found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Recent Consultation */}
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm md:col-span-2">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Stethoscope size={14} /> Recent Consultation
                                    </h4>
                                    <button onClick={() => setActiveTab('consultation')} className="text-[9px] font-black text-olive-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                        View History <ChevronRight size={10} />
                                    </button>
                                </div>
                                {history.loading ? (
                                    <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                ) : history.consultations[0] ? (
                                    <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-2xl">
                                        <div className="w-12 h-12 rounded-xl bg-olive-100 text-olive-600 flex items-center justify-center">
                                            <Stethoscope size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-xs font-black text-slate-900 uppercase">{history.consultations[0].chiefComplaint}</h5>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(history.consultations[0].createdAt), "MMM dd, yyyy HH:mm")} • {history.consultations[0].status.toUpperCase()}</p>
                                        </div>
                                        <div className="max-w-md hidden lg:block">
                                            <p className="text-[10px] text-slate-500 italic line-clamp-1">"{history.consultations[0].soapNotes?.assessment || "No assessment recorded"}"</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No consultation history found.</p>
                                )}
                            </div>

                            {/* Recent Patient Uploads */}
                            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm md:col-span-2">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <History size={14} /> Patient Uploaded Records
                                    </h4>
                                    <button onClick={() => setActiveTab('archive')} className="text-[9px] font-black text-olive-600 uppercase tracking-widest flex items-center gap-1 hover:underline">
                                        Open Vault <ChevronRight size={10} />
                                    </button>
                                </div>
                                {history.loading ? (
                                    <div className="h-20 bg-slate-50 animate-pulse rounded-2xl" />
                                ) : history.documents?.length > 0 ? (
                                    <div className="flex flex-wrap gap-4">
                                        {history.documents.slice(0, 3).map((doc: any, i: number) => (
                                            <div key={i} onClick={() => setPreviewDoc(doc)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-transparent hover:border-olive-200">
                                                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-olive-600">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{doc.fileName}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">{doc.documentType}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {history.documents.length > 3 && (
                                            <button onClick={() => setActiveTab('archive')} className="p-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-olive-200 hover:text-olive-600 transition-all">
                                                +{history.documents.length - 3} more
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No patient-uploaded documents available.</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Forms Rendering Section */}
                    <div className="space-y-12">
                        {activeTab === "consultation" && (
                            <div className="space-y-12">
                                <ConsultationForm patientId={patient._id} appointmentId={appointmentId} encounterId={encounterId} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Consultation History"
                                    icon={Stethoscope}
                                    loading={history.loading}
                                    data={history.consultations}
                                    renderItem={(c: any) => (
                                        <div key={c._id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:border-olive-400 transition-all group lg:col-span-2">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-olive-50 text-olive-600 flex items-center justify-center">
                                                        <Stethoscope size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{c.chiefComplaint}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(c.createdAt), "MMM dd, yyyy HH:mm")} • {c.providerId?.firstName} {c.providerId?.lastName}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${c.status === 'closed' ? 'bg-olive-50 text-olive-600 border border-olive-100' : 'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    {c.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-slate-50/50 p-6 rounded-[32px] border border-slate-50">
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Subjective</p>
                                                    <p className="text-[10px] text-slate-600 italic line-clamp-3">{c.soapNotes?.subjective || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Objective</p>
                                                    <p className="text-[10px] text-slate-600 italic line-clamp-3">{c.soapNotes?.objective || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessment</p>
                                                    <p className="text-[10px] text-slate-600 italic line-clamp-3">{c.soapNotes?.assessment || "N/A"}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                                                    <p className="text-[10px] text-slate-600 italic line-clamp-3">{c.soapNotes?.plan || "N/A"}</p>
                                                </div>
                                            </div>
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {c.diagnosis?.map((d: string) => (
                                                    <span key={d} className="text-[8px] font-black bg-white border border-slate-100 text-slate-400 px-2 py-1 rounded-md uppercase tracking-tight">{d}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}
                        {activeTab === "prescription" && (
                            <div className="space-y-12">
                                <PrescriptionForm patientId={patient._id} appointmentId={appointmentId} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Medication History"
                                    icon={Pill}
                                    loading={history.loading}
                                    data={history.prescriptions}
                                    renderItem={(rx: any) => (
                                        <div key={rx._id} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:border-olive-400 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{format(new Date(rx.prescribedDate), "MMM dd, yyyy HH:mm")}</p>
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
                                        <div key={lab._id}
                                            onClick={() => setSelectedReport({
                                                title: `Diagnostic Report: ${lab.tests?.[0] || 'Lab Result'}`,
                                                data: {
                                                    type: 'lab',
                                                    patientName: `${patient.firstName} ${patient.lastName}`,
                                                    mrn: patient.mrn,
                                                    date: format(new Date(lab.createdAt), "MMM dd, yyyy HH:mm"),
                                                    results: lab.results?.map((r: any) => ({
                                                        testName: r.testName,
                                                        value: r.value,
                                                        unit: r.unit,
                                                        referenceRange: r.referenceRange,
                                                        abnormalFlag: r.abnormalFlag
                                                    }))
                                                }
                                            })}
                                            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-blue-400 transition-all flex items-center justify-between group cursor-pointer">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${lab.status === 'completed' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    <FlaskConical size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{(lab.tests || [lab.testType]).join(', ')}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                                                        {format(new Date(lab.createdAt), "MMM dd, yyyy HH:mm")} • {lab.status.toUpperCase()}
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
                                        <div key={item._id}
                                            onClick={() => setSelectedReport({
                                                title: `Imaging Report: ${item.imagingType}`,
                                                data: {
                                                    type: 'radiology',
                                                    patientName: `${patient.firstName} ${patient.lastName}`,
                                                    mrn: patient.mrn,
                                                    date: format(new Date(item.createdAt), "MMM dd, yyyy HH:mm"),
                                                    radiology: {
                                                        findings: item.report?.findings || "Findings pending interpretation.",
                                                        impression: item.report?.impression || "Impression pending.",
                                                        recommendations: item.report?.recommendations
                                                    }
                                                }
                                            })}
                                            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-purple-400 transition-all group cursor-pointer">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                                        <Activity size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.imagingType} • {item.bodyPart}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{format(new Date(item.createdAt), "MMM dd, yyyy HH:mm")}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.status === 'completed' ? 'bg-purple-50 text-purple-600' : 'bg-slate-50 text-slate-400 border border-slate-100'
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
                        {activeTab === "surgery" && (
                            <div className="space-y-12">
                                <SurgeryOrderForm patientId={patient._id} onSuccess={fetchHistory} />
                                <ClinicalSection
                                    title="Surgical History"
                                    icon={Activity}
                                    loading={history.loading}
                                    data={history.surgeries}
                                    renderItem={(item: any) => (
                                        <div key={item._id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-teal-400 transition-all group">
                                            <div className="flex justify-between items-center mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                                        <Activity size={18} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{item.procedureName}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                            {new Date(item.scheduledDate).toLocaleDateString()} • {item.startTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                    item.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                        'bg-orange-50 text-orange-600 border border-orange-100'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">OR Location</p>
                                                <p className="text-xs font-bold text-slate-700">{item.orRoomId}</p>
                                                {item.notes && (
                                                    <>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-4 mb-2">Clinical Notes</p>
                                                        <p className="text-xs text-slate-600 italic leading-relaxed">"{item.notes}"</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        )}

                        {activeTab === "archive" && (
                            <div className="space-y-12">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 px-2">
                                        <History size={18} className="text-slate-300" /> Patient Evidence Archive
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
                                    {history.loading ? (
                                        [...Array(6)].map((_, i) => (
                                            <div key={i} className="h-40 bg-slate-100 animate-pulse rounded-[32px]" />
                                        ))
                                    ) : history.documents.length === 0 ? (
                                        <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[40px]">
                                            <p className="text-slate-400 font-black uppercase tracking-[0.2em] italic">No historical records uploaded by patient</p>
                                        </div>
                                    ) : (
                                        history.documents.map((doc: any) => (
                                            <div key={doc._id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:border-olive-400 transition-all group relative overflow-hidden">
                                                <div className="relative z-10 flex flex-col h-full justify-between">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="w-14 h-14 rounded-2xl bg-olive-50 text-olive-600 flex items-center justify-center border border-olive-100 group-hover:scale-110 transition-transform shadow-inner">
                                                            <FileText size={28} />
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-1 max-w-[120px]">{doc.fileName}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="inline-block px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                                            {doc.documentType}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-tight">
                                                            <Calendar size={12} /> {format(new Date(doc.createdAt), "MMM dd, yyyy HH:mm")}
                                                        </div>
                                                    </div>

                                                    <div className="mt-8 pt-6 border-t border-slate-50 flex gap-3">
                                                        <button
                                                            onClick={() => setPreviewDoc(doc)}
                                                            className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-olive-700 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                                                        >
                                                            <ZoomIn size={14} /> Preview
                                                        </button>
                                                        <a
                                                            href={doc.fileUrl}
                                                            download
                                                            target="_blank"
                                                            className="w-12 h-11 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center hover:text-slate-900 transition-all hover:bg-slate-50 shadow-sm"
                                                        >
                                                            <Download size={16} />
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="absolute top-[-20%] right-[-10%] text-slate-50 group-hover:text-olive-50 transition-colors pointer-events-none">
                                                    <FileText size={160} />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* In-App Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-4 md:p-10 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl h-full rounded-[48px] shadow-2xl overflow-hidden border border-white/20 flex flex-col animate-in zoom-in-95 duration-500">
                        {/* Modal Header */}
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-3xl bg-olive-50 flex items-center justify-center text-olive-600 shadow-inner">
                                    <FileText size={32} />
                                </div>
                                <div>
                                    <p className="text-[11px] font-black text-olive-600 uppercase tracking-[0.3em] mb-1">Medical Record Preview</p>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight italic flex items-center gap-3">
                                        {previewDoc.fileName}
                                        <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full not-italic font-black uppercase tracking-widest border border-slate-200">
                                            {previewDoc.documentType}
                                        </span>
                                    </h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <a
                                    href={previewDoc.fileUrl}
                                    download
                                    target="_blank"
                                    className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-slate-900 transition-all hover:bg-slate-100"
                                >
                                    <Download size={24} />
                                </a>
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="w-16 h-16 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-3xl transition-all shadow-sm"
                                >
                                    <X size={28} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 bg-slate-100 p-8 overflow-hidden">
                            <div className="w-full h-full rounded-[32px] border border-slate-200 bg-white overflow-hidden shadow-inner flex items-center justify-center relative">
                                {previewDoc.mimeType === 'application/pdf' ? (
                                    <iframe
                                        src={`${previewDoc.fileUrl}#toolbar=0`}
                                        className="w-full h-full border-none"
                                    />
                                ) : (
                                    <img
                                        src={previewDoc.fileUrl}
                                        alt={previewDoc.fileName}
                                        className="max-w-full max-h-full object-contain"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50/50 flex justify-center border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={12} /> Patient assumes full responsibility for document accuracy
                            </p>
                        </div>
                    </div>
                </div>
            )}
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
