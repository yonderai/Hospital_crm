
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
    Sliders
} from "lucide-react";

export default function PatientChart() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('Timeline');
    const [loading, setLoading] = useState(true);

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
                        {activeTab === 'Labs & Imaging' && <LabsImagingView patientId={params.id} />}
                        {activeTab === 'Procedures' && <ProceduresView patientId={params.id} />}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// --- TAB COMPONENTS ---

function TimelineView({ patientId }: { patientId: any }) {
    // Mocking specific timeline data if API is not fully ready for "events", but usually fetching encounters
    // For now, let's fetch encounters and map them to timeline
    // If encounter API doesn't support list by patient easily without auth context, we might rely on a unified "history" endpoint
    // Assuming we can fetch patient details which might include history, or fetch encounters
    // Logic: Fetch encounters for this patient.

    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        // Mock fetch for timeline
        // In real app: fetch(`/api/clinical/history?patient=${patientId}`)
        setEvents([
            { date: "Oct 24, 2025", title: "General Consultation", desc: "Routine checkup. BP 120/80.", icon: FileText },
            { date: "Sep 15, 2025", title: "Lab Results", desc: "CBC Panel. Normal range.", icon: Microscope },
            { date: "Aug 02, 2025", title: "Prescription", desc: "Amoxicillin 500mg - 7 Days", icon: Pill },
            { date: "Jul 10, 2025", title: "Emergency Visit", desc: "Acute abdominal pain. Ultrasound performed.", icon: Activity },
        ]);
    }, [patientId]);

    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-100"></div>
            <div className="space-y-12 relative z-10 pl-12">
                {events.map((evt, i) => (
                    <TimelineItem key={i} {...evt} />
                ))}
            </div>
        </div>
    );
}

function SOAPView({ patientId }: { patientId: any }) {
    // Ideally fetch SOAP notes from Encounters
    const [notes, setNotes] = useState<any[]>([]);

    useEffect(() => {
        // Mocking Encounters with SOAP
        setNotes([
            {
                date: "Oct 24, 2025",
                provider: "Dr. House",
                s: "Patient reports persistent mild headache for 3 days.",
                o: "BP 130/85, Temp 98.6F. PERRLA.",
                a: "Tension headache likely.",
                p: "Monitor. OTC analgesics as needed. Hydration."
            },
            {
                date: "Jul 10, 2025",
                provider: "Dr. Wilson",
                s: "Acute abdominal pain, RLQ.",
                o: "Tenderness at McBurney's point. Rebound +.",
                a: "Rule out Appendicitis.",
                p: "Stat Ultrasound. CBC. NPO."
            }
        ]);
    }, [patientId]);

    return (
        <div className="space-y-6">
            {notes.map((note, i) => (
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

    useEffect(() => {
        const fetchMeds = async () => {
            // Fetch from API
            try {
                const res = await fetch(`/api/patients/${patientId}/prescriptions`);
                if (res.ok) {
                    const data = await res.json();
                    setMeds(data);
                } else {
                    // Fallback mock
                    setMeds([
                        { drugName: "Lisinopril", dosage: "10mg", frequency: "Daily", status: "Active" },
                        { drugName: "Atorvastatin", dosage: "20mg", frequency: "Nightly", status: "Active" }
                    ]);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchMeds();
    }, [patientId]);

    return (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <th className="px-8 py-4">Medication</th>
                        <th className="px-8 py-4">Dosage</th>
                        <th className="px-8 py-4">Frequency</th>
                        <th className="px-8 py-4">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {meds.length === 0 ? (
                        <tr><td colSpan={4} className="p-8 text-center text-slate-400">No active medications</td></tr>
                    ) : meds.map((m, i) => (
                        <tr key={i}>
                            <td className="px-8 py-4 font-bold text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-olive-100 text-olive-600 flex items-center justify-center"><Pill size={14} /></div>
                                {m.drugName}
                            </td>
                            <td className="px-8 py-4 text-sm text-slate-600">{m.dosage}</td>
                            <td className="px-8 py-4 text-sm text-slate-600">{m.frequency}</td>
                            <td className="px-8 py-4">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide">{m.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function LabsImagingView({ patientId }: { patientId: any }) {
    const [labs, setLabs] = useState<any[]>([]);
    const [scanSize, setScanSize] = useState(256); // Slider State

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                const res = await fetch(`/api/patients/${patientId}/labs`);
                if (res.ok) {
                    const data = await res.json();
                    setLabs(data);
                } else {
                    // Fallback Mock
                    setLabs([
                        { type: 'result', testName: "CBC with Diff", date: "Oct 24, 2025", result: "Normal", value: "WBC 7.5" },
                        { type: 'image', testName: "Chest X-Ray PA/Lat", date: "Oct 10, 2025", result: "Clear", src: "https://prod-images-static.radiopaedia.org/images/157210/332ea51c33be85f8cd20c2921501aa_jumbo.jpg" }
                    ]);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchLabs();
    }, [patientId]);

    // Split into Labs (text) and Imaging (visual) for demo, or mix
    const images = labs.filter(l => l.type === 'image' || l.src);
    const textLabs = labs.filter(l => !l.src);

    return (
        <div className="space-y-8">
            {/* Imaging Section with Slider */}
            {images.length > 0 && (
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-black text-slate-900">Medical Imaging</h3>
                        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl">
                            <Sliders size={16} className="text-slate-400" />
                            <input
                                type="range"
                                min="128"
                                max="512"
                                value={scanSize}
                                onChange={(e) => setScanSize(Number(e.target.value))}
                                className="w-32 accent-olive-600"
                            />
                            <span className="text-[10px] font-bold text-slate-400 w-12 text-right">{scanSize}px</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                        {images.map((img, i) => (
                            <div key={i} className="group relative">
                                <div
                                    className="bg-slate-900 rounded-2xl overflow-hidden shadow-lg transition-all border-4 border-slate-900 group-hover:border-olive-500"
                                    style={{ width: `${scanSize}px`, height: `${scanSize}px` }}
                                >
                                    {/* Placeholder for actual image if src is valid, else dummy */}
                                    <img
                                        src={img.src || "/placeholder-xray.jpg"}
                                        alt={img.testName}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                        onError={(e) => { (e.target as any).src = 'https://placehold.co/400x400/101010/FFF?text=Scan+Image'; }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                                        <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                                            <ImageIcon className="text-white" size={24} />
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-3 text-sm font-bold text-slate-900 text-center w-full max-w-[200px] mx-auto">{img.testName}</p>
                                <p className="text-xs text-center text-slate-400">{img.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lab Results Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50"><h3 className="text-lg font-black text-slate-900">Laboratory Results</h3></div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="px-8 py-4">Test Name</th>
                            <th className="px-8 py-4">Date</th>
                            <th className="px-8 py-4">Result</th>
                            <th className="px-8 py-4">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {textLabs.map((l, i) => (
                            <tr key={i}>
                                <td className="px-8 py-4 font-bold text-slate-900">{l.testName}</td>
                                <td className="px-8 py-4 text-sm text-slate-500">{l.date}</td>
                                <td className="px-8 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{l.result}</span></td>
                                <td className="px-8 py-4 text-sm font-mono text-slate-600">{l.value}</td>
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

    useEffect(() => {
        // Fetch orcases
        setProcedures([
            { name: "Appendectomy", date: "Jul 11, 2025", surgeon: "Dr. Cutter", status: "Completed" }
        ]);
    }, [patientId]);

    return (
        <div className="space-y-4">
            {procedures.map((proc, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                            <Scissors size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900">{proc.name}</h4>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">{proc.date} • {proc.surgeon}</p>
                        </div>
                    </div>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{proc.status}</span>
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
