
"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import { User, Phone, MapPin, Calendar, Activity, AlertCircle, FileText } from "lucide-react";

export default function PatientDetails() {
    const params = useParams();
    const [patient, setPatient] = useState<any>(null);
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

    if (loading) return <DashboardLayout><div>Loading...</div></DashboardLayout>;
    if (!patient) return <DashboardLayout><div>Patient not found</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Patient Details</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">MRN: {patient.mrn}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col: Profile */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
                            <div className="w-32 h-32 mx-auto bg-slate-100 rounded-full flex items-center justify-center text-4xl font-black text-slate-400 mb-6">
                                {patient.firstName[0]}{patient.lastName[0]}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{patient.firstName} {patient.lastName}</h3>
                            <p className="text-slate-500 font-medium">{new Date(patient.dob).toLocaleDateString()} ({new Date().getFullYear() - new Date(patient.dob).getFullYear()} yo)</p>

                            <div className="flex gap-2 justify-center mt-6">
                                <span className="px-4 py-2 bg-olive-50 text-olive-700 rounded-xl font-bold text-xs uppercase tracking-wider">{patient.gender}</span>
                                <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider">{patient.bloodType || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Contact Information</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-slate-600">
                                    <Phone size={18} className="text-olive-500" />
                                    <span className="font-medium text-sm">{patient.contact?.phone}</span>
                                </div>
                                <div className="flex items-center gap-4 text-slate-600">
                                    <MapPin size={18} className="text-olive-500" />
                                    <span className="font-medium text-sm">{patient.contact?.address}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Clinical Snapshot */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Clinical Overview</h4>

                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                                    <h5 className="flex items-center gap-2 font-bold text-red-700 mb-2">
                                        <AlertCircle size={18} /> Allergies
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.allergies?.length > 0 ? patient.allergies.map((a: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white text-red-600 rounded-lg text-xs font-bold border border-red-100">{a}</span>
                                        )) : <span className="text-slate-400 text-sm">No known allergies</span>}
                                    </div>
                                </div>
                                <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                                    <h5 className="flex items-center gap-2 font-bold text-blue-700 mb-2">
                                        <Activity size={18} /> Chronic Conditions
                                    </h5>
                                    <div className="flex flex-wrap gap-2">
                                        {patient.chronicConditions?.length > 0 ? patient.chronicConditions.map((c: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-white text-blue-600 rounded-lg text-xs font-bold border border-blue-100">{c}</span>
                                        )) : <span className="text-slate-400 text-sm">No reported conditions</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="font-bold text-slate-900 border-b pb-2">Assigned Care Team</h5>
                                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-olive-100 rounded-full flex items-center justify-center text-olive-700">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {patient.assignedDoctorId ? `Dr. ${patient.assignedDoctorId.firstName} ${patient.assignedDoctorId.lastName}` : 'Unassigned'}
                                        </p>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{patient.assignedDoctorId?.department || 'General Practice'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
