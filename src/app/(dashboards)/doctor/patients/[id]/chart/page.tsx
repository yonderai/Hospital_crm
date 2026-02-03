
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import {
    FileText,
    Pill,
    Microscope,
    Activity,
    Scissors,
    Clock,
    Calendar,
    Image as ImageIcon,
    Sliders,
    AlertCircle,
    X
} from "lucide-react";
import ReportModal from "@/components/doctor/ReportModal";
import { format } from "date-fns";

export default function PatientChart() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Timeline');
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState<any>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!params.id) return;
            try {
                const res = await fetch(`/api/patients/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPatient(data);
                }
            } catch (error) {
                console.error("Failed to fetch patient:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [params.id]);

    if (!patient && loading) return <DashboardLayout><div className="p-12">Loading Chart...</div></DashboardLayout>;
    if (!patient) return <DashboardLayout><div className="p-12">Patient not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Full Patient Chart</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">{patient.firstName} {patient.lastName} • MRN: {patient.mrn}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Chart Nav */}
                    <div className="space-y-2">
                        {['Timeline', 'SOAP Notes', 'Medications', 'Labs & Imaging', 'Procedures'].map((item) => (
                            <button
                                key={item}
                                onClick={() => setActiveTab(item)}
                                className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all ${activeTab === item ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20' : 'bg-white text-slate-500 hover:bg-olive-50 hover:text-olive-700'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Chart Content */}
                    <div className="lg:col-span-3 min-h-[600px]">
                        {activeTab === 'Timeline' && <TimelineView patientId={params.id} />}
                        {activeTab === 'SOAP Notes' && <SOAPView patientId={params.id} />}
                        {activeTab === 'Medications' && <MedicationsView patientId={params.id} />}
                        {activeTab === 'Labs & Imaging' && <LabsImagingView patientId={params.id} onSelectReport={setSelectedReport} patient={patient} />}
                        {activeTab === 'Procedures' && <ProceduresView patientId={params.id} />}
                    </div>
                </div>

                {selectedReport && (
                    <div className="no-print">
                        <ReportModal
                            title={selectedReport.title}
                            data={selectedReport.data}
                            imageUrl={selectedReport.imageUrl}
                            onClose={() => setSelectedReport(null)}
                        />
                        {/* Overlay to hide print/download buttons as requested for doctor section */}
                        <style jsx global>{`
                            .no-print button[title="Print Report"],
                            .no-print button[title="Download PDF"] {
                                display: none !important;
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

// --- TAB COMPONENTS ---

function TimelineView({ patientId }: { patientId: any }) {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            try {
                const [labsRes, radRes, medsRes] = await Promise.all([
                    fetch(`/api/patients/${patientId}/labs`),
                    fetch(`/api/patients/${patientId}/radiology`),
                    fetch(`/api/patients/${patientId}/prescriptions`)
                ]);

                const labs = labsRes.ok ? await labsRes.json() : [];
                const radiology = radRes.ok ? await radRes.json() : [];
                const prescriptions = medsRes.ok ? await medsRes.json() : [];

                const allEvents: any[] = [];

                // Map Labs
                labs.forEach((l: any) => {
                    allEvents.push({
                        date: format(new Date(l.createdAt), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(l.createdAt).getTime(),
                        title: `Lab Order: ${(l.tests || []).join(', ')}`,
                        desc: `Status: ${l.status.toUpperCase()}`,
                        icon: Microscope
                    });
                });

                // Map Radiology
                radiology.forEach((r: any) => {
                    allEvents.push({
                        date: format(new Date(r.createdAt), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(r.createdAt).getTime(),
                        title: `Imaging: ${r.imagingType} (${r.bodyPart})`,
                        desc: `Priority: ${r.priority.toUpperCase()} - ${r.status}`,
                        icon: ImageIcon
                    });
                });

                // Map Prescriptions
                prescriptions.forEach((p: any) => {
                    allEvents.push({
                        date: format(new Date(p.prescribedDate), "MMM dd, yyyy HH:mm"),
                        timestamp: new Date(p.prescribedDate).getTime(),
                        title: `Prescription: ${p.medications.map((m: any) => m.drugName).join(', ')}`,
                        desc: `Status: ${p.status.toUpperCase()}`,
                        icon: Pill
                    });
                });

                // Sort by timestamp desc
                allEvents.sort((a, b) => b.timestamp - a.timestamp);
                setEvents(allEvents);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchTimeline();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Aggregating Longitudinal Timeline...</div>;

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-100"></div>
            <div className="space-y-12 relative z-10 pl-12">
                {events.length === 0 ? (
                    <div className="text-slate-400 italic py-10">No clinical events recorded for this patient.</div>
                ) : events.map((evt, i) => (
                    <TimelineItem key={i} {...evt} />
                ))}
            </div>
        </div>
    );
}


function SOAPView({ patientId }: { patientId: any }) {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/consultations`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data.map((c: any) => ({
                        date: new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        provider: `${c.providerId?.firstName || 'Dr.'} ${c.providerId?.lastName || 'Provider'}`,
                        s: c.soapNotes?.subjective || "No subjective notes.",
                        o: c.soapNotes?.objective || "No objective findings.",
                        a: c.soapNotes?.assessment || "Assessment pending.",
                        p: c.soapNotes?.plan || "Plan not recorded."
                    })));
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse">Retrieving Clinical Narratives...</div>;

    return (
        <div className="space-y-6">
            {notes.length === 0 ? (
                <div className="bg-white p-12 rounded-[30px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 italic">No formal SOAP notes recorded for this patient.</p>
                </div>
            ) : notes.map((note, i) => (
                <div key={i} className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h4 className="text-lg font-black text-slate-900">{note.date}</h4>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Provider: {note.provider}</p>
                        </div>
                        <FileText className="text-olive-500" size={24} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <span className="font-black text-slate-900 uppercase tracking-widest text-xs block mb-2">Subjective</span>
                            <p className="text-slate-600">{note.s}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl">
                            <span className="font-black text-slate-900 uppercase tracking-widest text-xs block mb-2">Objective</span>
                            <p className="text-slate-600">{note.o}</p>
                        </div>
                        <div className="bg-olive-50 p-4 rounded-xl md:col-span-2">
                            <span className="font-black text-olive-800 uppercase tracking-widest text-xs block mb-2">Assessment & Plan</span>
                            <div className="space-y-2">
                                <p className="text-olive-900 font-bold"><span className="opacity-50 uppercase text-[10px] tracking-widest mr-2">ASM:</span> {note.a}</p>
                                <p className="text-olive-700"><span className="opacity-50 uppercase text-[10px] tracking-widest mr-2">PLN:</span> {note.p}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function MedicationsView({ patientId }: { patientId: any }) {
    const [meds, setMeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMeds = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/prescriptions`);
                if (res.ok) {
                    const data = await res.json();
                    const flatMeds = data.flatMap((rx: any) =>
                        rx.medications.map((m: any) => ({
                            ...m,
                            status: rx.status,
                            date: new Date(rx.prescribedDate).toLocaleDateString(),
                            prescriptionId: rx.prescriptionId
                        }))
                    );
                    setMeds(flatMeds);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchMeds();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Accessing Pharmacy Records...</div>;

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Active & Historical Medications</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Longitudinal Prescription Log</p>
                </div>
                <Pill size={24} className="text-olive-500 opacity-30" />
            </div>
            <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-10 py-5">Medication</th>
                        <th className="px-10 py-5">Dosage</th>
                        <th className="px-10 py-5">Frequency</th>
                        <th className="px-10 py-5">Date</th>
                        <th className="px-10 py-5">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {meds.length === 0 ? (
                        <tr><td colSpan={5} className="p-10 text-center text-slate-400 italic">No medication history found</td></tr>
                    ) : meds.map((m, i) => (
                        <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-10 py-6 font-bold text-slate-900 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-olive-50 text-olive-600 flex items-center justify-center border border-olive-100"><Pill size={18} /></div>
                                <div>
                                    <p className="font-black text-sm italic tracking-tight">{m.drugName}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{m.prescriptionId}</p>
                                </div>
                            </td>
                            <td className="px-10 py-6 text-sm font-bold text-slate-600">{m.dosage}</td>
                            <td className="px-10 py-6 text-sm text-slate-500 italic">{m.frequency}</td>
                            <td className="px-10 py-6 text-xs font-bold text-slate-400 uppercase">{m.date}</td>
                            <td className="px-10 py-6">
                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${m.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>{m.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LabsImagingView({ patientId, onSelectReport, patient }: { patientId: any, onSelectReport: (report: any) => void, patient: any }) {
    const [labs, setLabs] = useState<any[]>([]);
    const [radiology, setRadiology] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [scanSize, setScanSize] = useState(256);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [labsRes, radRes] = await Promise.all([
                    fetch(`/api/patients/${patientId}/labs`),
                    fetch(`/api/patients/${patientId}/radiology`)
                ]);

                if (labsRes.ok) setLabs(await labsRes.json());
                if (radRes.ok) setRadiology(await radRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse tracking-widest uppercase text-xs font-bold">Synchronizing Clinical Diagnostics...</div>;

    const flatResults = labs.flatMap((order: any) =>
        (order.results || []).map((r: any) => ({
            testName: r.testName,
            date: new Date(order.resultDate || order.createdAt).toLocaleDateString(),
            result: order.status,
            value: r.value,
            unit: r.unit,
            referenceRange: r.referenceRange,
            abnormalFlag: r.abnormalFlag,
            abnormal: r.abnormalFlag
        }))
    );

    const displayLabs = flatResults.length > 0 ? flatResults : labs.map(order => ({
        testName: (order.tests || []).join(', '),
        date: new Date(order.createdAt).toLocaleDateString(),
        result: order.status,
        value: 'Pending',
        unit: '',
        referenceRange: '',
        abnormal: false,
        abnormalFlag: false
    }));

    return (
        <div className="space-y-8">
            {radiology.length > 0 && (
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Diagnostic Imaging</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Radiology Archive</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                            <Sliders size={14} className="text-slate-400" />
                            <input
                                type="range"
                                min="160"
                                max="480"
                                value={scanSize}
                                onChange={(e) => setScanSize(Number(e.target.value))}
                                className="w-32 accent-olive-600"
                            />
                            <span className="text-[9px] font-black text-slate-400 w-10 text-right">{scanSize}px</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-10">
                        {radiology.map((item, i) => (
                            <div key={i} className="group relative cursor-pointer" onClick={() => onSelectReport({
                                title: `Imaging Report: ${item.imagingType}`,
                                data: {
                                    type: 'radiology',
                                    patientName: `${patient.firstName} ${patient.lastName}`,
                                    mrn: patient.mrn,
                                    date: new Date(item.createdAt).toLocaleDateString(),
                                    radiology: {
                                        findings: item.report?.findings || "Findings pending interpretation.",
                                        impression: item.report?.impression || "Impression pending.",
                                        recommendations: item.report?.recommendations
                                    }
                                }
                            })}>
                                <div
                                    className="bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl transition-all border-8 border-slate-900 group-hover:border-olive-500 relative"
                                    style={{ width: `${scanSize}px`, height: `${scanSize}px` }}
                                >
                                    <img
                                        src={`https://placehold.co/600x600/101010/FFF?text=${item.imagingType}+${item.bodyPart}`}
                                        alt={item.imagingType}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity flex flex-col justify-end p-6">
                                        <p className="text-white text-xs font-black uppercase tracking-widest">{item.bodyPart}</p>
                                        <p className="text-slate-400 text-[9px] font-bold mt-1">{new Date(item.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none transition-all scale-75 group-hover:scale-100">
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20">
                                            <ImageIcon className="text-white" size={32} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 text-center px-4">
                                    <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase italic">{item.imagingType}</h4>
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block ${item.status === 'completed' ? 'bg-olive-50 text-olive-600 border border-olive-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                                        }`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Laboratory Results</h3>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 italic">Biochemical Analysis Archive</p>
                    </div>
                    <Microscope size={24} className="text-olive-500 opacity-30" />
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-10 py-5">Test Parameter</th>
                            <th className="px-10 py-5">Date</th>
                            <th className="px-10 py-5">Status</th>
                            <th className="px-10 py-5">Result Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {displayLabs.length === 0 ? (
                            <tr><td colSpan={4} className="p-10 text-center text-slate-400 italic">No lab history recorded</td></tr>
                        ) : displayLabs.map((l, i) => (
                            <tr key={i} className="hover:bg-slate-50/30 transition-colors cursor-pointer" onClick={() => onSelectReport({
                                title: `Diagnostic Report: ${l.testName}`,
                                data: {
                                    type: 'lab',
                                    patientName: `${patient.firstName} ${patient.lastName}`,
                                    mrn: patient.mrn,
                                    date: l.date,
                                    testName: l.testName,
                                    results: [{
                                        testName: l.testName,
                                        value: l.value,
                                        unit: l.unit || '',
                                        referenceRange: l.referenceRange || 'N/A',
                                        abnormalFlag: l.abnormalFlag
                                    }]
                                }
                            })}>
                                <td className="px-10 py-6">
                                    <p className="font-black text-slate-900 text-sm italic tracking-tight uppercase">{l.testName}</p>
                                </td>
                                <td className="px-10 py-6 text-xs font-bold text-slate-500 uppercase tracking-tight">{l.date}</td>
                                <td className="px-10 py-6">
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${l.result === 'completed' ? 'bg-olive-50 text-olive-600 border-olive-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                        {l.result}
                                    </span>
                                </td>
                                <td className="px-10 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <p className={`text-lg font-black italic tracking-tighter ${l.abnormal ? 'text-red-600 underline decoration-2 underline-offset-4' : 'text-slate-900'}`}>
                                                {l.value} <span className="text-xs opacity-50 not-italic font-bold tracking-normal">{l.unit}</span>
                                            </p>
                                            {l.referenceRange && (
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Range: {l.referenceRange}</p>
                                            )}
                                        </div>
                                        {l.abnormal && <AlertCircle size={14} className="text-red-500" />}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ProceduresView({ patientId }: { patientId: any }) {
    const [procedures, setProcedures] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProcedures = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/surgery`);
                if (res.ok) {
                    const data = await res.json();
                    setProcedures(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchProcedures();
    }, [patientId]);

    if (loading) return <div className="p-8 text-center text-slate-400 italic animate-pulse">Retrieving Surgical Records...</div>;

    return (
        <div className="space-y-6">
            {procedures.length === 0 ? (
                <div className="bg-white p-12 rounded-[30px] border border-slate-100 shadow-sm text-center">
                    <p className="text-slate-400 italic font-medium uppercase tracking-[0.2em]">No surgical procedures recorded for this patient</p>
                </div>
            ) : procedures.map((proc, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                                <Scissors size={24} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-slate-900 italic uppercase italic tracking-tight">{proc.procedureName}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                                    {new Date(proc.scheduledDate).toLocaleDateString()} • Surgeon: {proc.surgeonId?.firstName} {proc.surgeonId?.lastName}
                                </p>
                            </div>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${proc.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                            }`}>{proc.status}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vitals Section */}
                        <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                            <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity size={12} className="text-blue-500" /> Intra-operative Vitals
                            </h5>
                            {proc.vitals && Object.keys(proc.vitals).length > 0 ? (
                                <div className="grid grid-cols-2 gap-4">
                                    {proc.vitals.bloodPressure && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">BP (mmHg)</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.bloodPressure}</p>
                                        </div>
                                    )}
                                    {proc.vitals.heartRate && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Heart Rate</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.heartRate} <span className="text-[10px] opacity-30">BPM</span></p>
                                        </div>
                                    )}
                                    {proc.vitals.oxygenSaturation && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SpO2</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.oxygenSaturation}%</p>
                                        </div>
                                    )}
                                    {proc.vitals.temperature && (
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Temp</p>
                                            <p className="text-lg font-black text-slate-800 tabular-nums">{proc.vitals.temperature}°C</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p className="text-[10px] text-slate-400 italic">No vitals recorded during this procedure.</p>
                            )}
                        </div>

                        {/* Medications Section */}
                        <div className="bg-olive-50/30 p-6 rounded-3xl border border-olive-100/50">
                            <h5 className="text-[10px] font-black text-olive-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Pill size={12} /> Post-Op Prescriptions
                            </h5>
                            {proc.medications && proc.medications.length > 0 ? (
                                <div className="space-y-4">
                                    {proc.medications.map((med: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-start pb-2 border-b border-olive-100/50 last:border-0 last:pb-0">
                                            <div>
                                                <p className="text-xs font-black text-olive-900 leading-tight tracking-tight uppercase italic">{med.drugName}</p>
                                                <p className="text-[10px] text-olive-600 font-bold mt-0.5">{med.dosage} • {med.frequency}</p>
                                            </div>
                                            {med.instructions && <p className="text-[9px] text-slate-400 italic max-w-[120px] text-right">{med.instructions}</p>}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[10px] text-olive-500/70 italic">No specific medications recorded for this case.</p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function TimelineItem({ date, title, desc, icon: Icon }: any) {
    return (
        <div className="relative group">
            <div className="absolute -left-[54px] top-1 w-5 h-5 rounded-full bg-olive-50 border-2 border-olive-500 z-20 group-hover:scale-125 transition-all"></div>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-olive-100 group-hover:text-olive-700 transition-colors">
                    <Icon size={20} />
                </div>
                <div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{date}</p>
                    <h4 className="text-lg font-bold text-slate-900">{title}</h4>
                    <p className="text-slate-500 mt-1">{desc}</p>
                </div>
            </div>
        </div>
    );
}
