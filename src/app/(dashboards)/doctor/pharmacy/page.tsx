
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    Search,
    Plus,
    CheckCircle,
    AlertCircle,
    Truck,
    Clock,
    Database,
    ChevronRight,
    User
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorPharmacy() {
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const res = await fetch('/api/doctor/prescriptions');
                if (res.ok) setPrescriptions(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    const filteredRx = prescriptions.filter(rx =>
        rx.patientId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.patientId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rx.medications?.some((m: any) => m.drugName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Pharmaceutical Hub</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">E-Prescribing Node • Real-time Dispensation</p>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Active Orders', value: prescriptions.length, icon: Database, color: 'text-olive-600', bg: 'bg-olive-50' },
                        { label: 'Validated', value: prescriptions.filter(r => r.status === 'validated').length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Pending', value: prescriptions.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                        { label: 'In Transit', value: prescriptions.filter(r => r.status === 'dispensed').length, icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:scale-105 transition-transform cursor-default">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tracking View */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/20">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Prescription Log</h3>
                        <div className="relative w-full md:w-96">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by patient or medication..."
                                className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-xs font-bold outline-none focus:border-olive-400 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Patient Name</th>
                                    <th className="px-8 py-5">Medications / Dosage</th>
                                    <th className="px-8 py-5">Prescribed By</th>
                                    <th className="px-8 py-5 text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-black animate-pulse uppercase tracking-[0.3em]">Querying Archive...</td></tr>
                                ) : filteredRx.length === 0 ? (
                                    <tr><td colSpan={5} className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em]">No pharmaceutical records discovered</td></tr>
                                ) : (
                                    filteredRx.map((rx, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full border uppercase tracking-widest ${rx.status === 'validated' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        rx.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse' :
                                                            'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {rx.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-olive-50 group-hover:text-olive-600 transition-colors">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 text-sm tracking-tight italic">{rx.patientId?.firstName} {rx.patientId?.lastName}</p>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MRN: {rx.patientId?.mrn}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    {rx.medications?.map((m: any, i: number) => (
                                                        <p key={i} className="text-xs text-olive-700 font-bold uppercase">{m.drugName} • {m.dosage}</p>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs text-slate-900 font-black italic uppercase">Dr. {rx.providerId?.lastName}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{rx.providerId?.department}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-8">
                                                <Link
                                                    href={`/doctor/patients/${rx.patientId?._id}`}
                                                    className="inline-flex items-center justify-center p-3 text-slate-400 hover:bg-white hover:text-olive-600 hover:shadow-md rounded-2xl border border-transparent hover:border-olive-100 transition-all"
                                                >
                                                    <ChevronRight size={20} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
