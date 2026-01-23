"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    Search,
    Plus,
    CheckCircle,
    AlertCircle,
    Truck,
    Clock
} from "lucide-react";

export default function DoctorPharmacy() {
    const prescriptions = [
        { patient: "Jim Morrison", medication: "Atorvastatin 20mg", status: "Dispensed", date: "Jan 22, 2026", pharmacist: "Gregory House" },
        { patient: "Janis Joplin", medication: "Amoxicillin 500mg", status: "Filling", date: "Jan 22, 2026", pharmacist: "Gregory House" },
        { patient: "Freddie Mercury", medication: "Lantus SoloStar", status: "Awaiting", date: "Jan 21, 2026", pharmacist: "Pending" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Prescription Management</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">DR. YUVRAJ SINGH • E-PRESCRIBING HUB</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New E-Prescription
                        </button>
                    </div>
                </div>

                {/* Tracking View */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active E-Prescriptions</h3>
                        <div className="flex bg-slate-100 p-0.5 rounded-xl">
                            <button className="px-5 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Today</button>
                            <button className="px-5 py-1.5 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">Pending</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                    <th className="px-8 py-5">Patient Name</th>
                                    <th className="px-8 py-5">Medication / Dose</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Fulfillment</th>
                                    <th className="px-8 py-5 text-right pr-12">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {prescriptions.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tight">{p.patient}</td>
                                        <td className="px-8 py-6 text-xs text-olive-700 font-bold uppercase">{p.medication}</td>
                                        <td className="px-8 py-6">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${p.status === 'Dispensed' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    p.status === 'Filling' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <Clock size={12} className="text-slate-400" />
                                                <span className="text-xs text-slate-500 font-medium">{p.pharmacist}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right pr-8">
                                            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-600 hover:text-white transition-all">
                                                Order Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Formulary Search Mock */}
                <div className="bg-[#0F172A] rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h4 className="text-2xl font-black tracking-tight">Hospital Formulary Search</h4>
                            <p className="text-slate-400 text-sm mt-2">Check availability, alternative therapeutics, and dosage guidelines.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl w-full md:w-96">
                            <Search size={20} className="text-olive-400 ml-4" />
                            <input
                                type="text"
                                placeholder="Search medication..."
                                className="bg-transparent border-none outline-none text-md text-white px-4 py-2 w-full"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
