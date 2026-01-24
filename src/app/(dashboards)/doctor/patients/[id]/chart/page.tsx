
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import { FileText, Pill, Microscope } from "lucide-react";

export default function PatientChart() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);

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
            }
        };
        fetchPatient();
    }, [params.id]);

    if (!patient) return <DashboardLayout><div>Loading...</div></DashboardLayout>;

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
                        {['Timeline', 'SOAP Notes', 'Medications', 'Labs & Imaging', 'Procedures'].map((item, i) => (
                            <button key={i} className={`w-full text-left px-6 py-4 rounded-2xl font-bold text-sm transition-all ${i === 0 ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20' : 'bg-white text-slate-500 hover:bg-slate-50'}`}>
                                {item}
                            </button>
                        ))}
                    </div>

                    {/* Chart Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Timeline Mock */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 left-8 bottom-0 w-0.5 bg-slate-100"></div>

                            <div className="space-y-12 relative z-10 pl-12">
                                <TimelineItem
                                    date="Jan 24, 2026"
                                    title="General Consultation"
                                    desc="Patient complained of persistent headaches. Vitals stable."
                                    icon={FileText}
                                />
                                <TimelineItem
                                    date="Dec 15, 2025"
                                    title="Lab Results: Blood Panel"
                                    desc="CBC and Lipid Panel results reviewed. Cholesterol slightly elevated."
                                    icon={Microscope}
                                />
                                <TimelineItem
                                    date="Nov 02, 2025"
                                    title="Prescription Renewal"
                                    desc="Metformin 500mg renewed for 3 months."
                                    icon={Pill}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
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
