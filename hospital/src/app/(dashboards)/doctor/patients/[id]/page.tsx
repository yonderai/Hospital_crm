"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
    ArrowLeft,
    Activity,
    FileText,
    Pill,
    Beaker,
    Calendar,
    AlertCircle
} from "lucide-react";

export default function PatientProfile() {
    const params = useParams();
    const router = useRouter();
    const [patient, setPatient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("clinical");

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await fetch(`/api/patients/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setPatient(data);
                } else {
                    console.error("Failed to fetch");
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchPatient();
    }, [params.id]);

    if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
    if (!patient) return <DashboardLayout><div>Patient not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                        <ArrowLeft size={20} className="text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{patient.firstName} {patient.lastName}</h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">MRN: {patient.mrn} • {new Date(patient.dob).toLocaleDateString()} • {patient.gender}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200 pb-1">
                    <TabButton label="Clinical Overview" icon={Activity} active={activeTab === "clinical"} onClick={() => setActiveTab("clinical")} />
                    <TabButton label="Diagnoses" icon={AlertCircle} active={activeTab === "diagnoses"} onClick={() => setActiveTab("diagnoses")} />
                    <TabButton label="Medications" icon={Pill} active={activeTab === "meds"} onClick={() => setActiveTab("meds")} />
                    <TabButton label="Lab Results" icon={Beaker} active={activeTab === "labs"} onClick={() => setActiveTab("labs")} />
                    <TabButton label="History" icon={FileText} active={activeTab === "history"} onClick={() => setActiveTab("history")} />
                </div>

                {/* Content Area */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
                    {activeTab === "clinical" && (
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Vitals</h3>
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-500 text-sm">
                                    No recent vitals recorded.
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Allergies</h3>
                                <div className="flex flex-wrap gap-2">
                                    {patient.allergies?.length > 0 ? patient.allergies.map((a: string) => (
                                        <span key={a} className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-wide">{a}</span>
                                    )) : <span className="text-slate-400 text-sm">No valid allergies</span>}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Placeholders for other tabs */}
                    {activeTab !== "clinical" && <div className="text-slate-400 text-center py-20">Module Under Construction</div>}
                </div>
            </div>
        </DashboardLayout>
    );
}

function TabButton({ label, icon: Icon, active, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold text-xs uppercase tracking-widest transition-all ${active
                    ? "bg-white text-olive-700 border-b-2 border-olive-600"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
        >
            <Icon size={16} />
            {label}
        </button>
    )
}
