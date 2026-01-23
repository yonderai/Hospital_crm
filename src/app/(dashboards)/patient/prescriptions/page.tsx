"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Pill, Calendar, User, FileText } from "lucide-react";

export default function PatientPrescriptionsPage() {
    const [loading, setLoading] = useState(true);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/patient/prescriptions')
            .then(res => res.json())
            .then(json => {
                setPrescriptions(json.data || []);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">E-PRESCRIPTIONS</h2>
                    <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">MEDICATION HISTORY</p>
                </div>

                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[32px]"></div>)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {prescriptions.map((rx, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:border-olive-200 transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-olive-50 rounded-2xl flex items-center justify-center text-olive-600">
                                            <Pill size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900">{rx.doctor}</h3>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{rx.department}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center gap-2 text-slate-500 mb-1 justify-end">
                                            <Calendar size={14} />
                                            <span className="text-xs font-bold">{rx.date}</span>
                                        </div>
                                        <span className="text-[10px] font-black px-3 py-1 bg-slate-100 rounded-full text-slate-500 uppercase tracking-widest">{rx.status}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {rx.medications.map((med: any, mIdx: number) => (
                                        <div key={mIdx} className="p-4 bg-slate-50 rounded-2xl flex justify-between items-center border border-slate-100">
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{med.drugName} <span className="text-slate-400 font-medium">({med.dosage})</span></p>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                                    {med.frequency} • {med.duration}
                                                </p>
                                            </div>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:text-olive-700 transition-all uppercase tracking-wider">
                                                Request Refill
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
