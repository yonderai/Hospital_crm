
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import { Activity, Heart, Thermometer, Wind } from "lucide-react";

export default function ClinicalSummary() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);

    // Mock Vitals for demo (Real implementation would fetch from a Vitals model)
    const vitals = [
        { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Heart Rate', value: '72', unit: 'bpm', icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
        { label: 'Temperature', value: '98.6', unit: '°F', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'SpO2', value: '98', unit: '%', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    ];

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
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Clinical Vitals</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">{patient.firstName} {patient.lastName} • MRN: {patient.mrn}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vitals.map((v, i) => (
                        <div key={i} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:border-olive-200 transition-all">
                            <div className={`w-16 h-16 ${v.bg} rounded-full flex items-center justify-center ${v.color} mb-6`}>
                                <v.icon size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-1">{v.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{v.label} <span className="text-slate-300">({v.unit})</span></p>
                        </div>
                    ))}
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Recent Trends</h3>
                    <div className="h-64 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 font-medium">
                        Chart visualization placeholder
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
