"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    ShieldCheck, Activity, FileText, Calendar,
    CreditCard, Download, Upload, AlertCircle,
    CheckCircle2, XCircle, ChevronRight, Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function PatientInsurancePage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [insuranceData, setInsuranceData] = useState<any>(null);
    const [claims, setClaims] = useState<any[]>([]);

    useEffect(() => {
        // Fetch logic would go here
        // Mocking data for now as per requirements
        setTimeout(() => {
            setInsuranceData({
                provider: "Bajaj Allianz",
                policyNumber: "POL123456789",
                groupNumber: "GRP987654",
                coverageType: "Family Floater",
                sumInsured: 500000,
                balance: 350000,
                validUntil: "2025-12-31",
                hasInsurance: true,
                utilization: 30 // percentage
            });

            setClaims([
                { date: "15/01/2025", service: "Cardiology Consultation", amount: 50000, status: "Approved" },
                { date: "10/12/2024", service: "Lab Tests - Blood Panel", amount: 5000, status: "Approved" },
                { date: "05/11/2024", service: "MRI Scan - Knee", amount: 15000, status: "Approved" },
                { date: "15/09/2024", service: "Pharmacy - Inpatient", amount: 8000, status: "Pending" }
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Insurance</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Coverage & Claims</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <Upload size={16} /> Update Policy
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-olive-700 transition-all shadow-lg shadow-olive-600/20">
                            <Plus size={16} /> Add New Policy
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
                        <div className="h-64 bg-slate-100 rounded-3xl col-span-2"></div>
                        <div className="h-64 bg-slate-100 rounded-3xl"></div>
                    </div>
                ) : (
                    <>
                        {/* Status Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Coverage Card */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <ShieldCheck size={200} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-olive-50 rounded-2xl flex items-center justify-center text-olive-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{insuranceData.provider}</h3>
                                            <p className="text-sm font-bold text-slate-500">Policy #{insuranceData.policyNumber}</p>
                                        </div>
                                        <div className="ml-auto px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 border border-green-100">
                                            <CheckCircle2 size={14} /> Active
                                        </div>
                                    </div>

                                    <div className="flex gap-12 mb-8">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sum Insured</p>
                                            <p className="text-2xl font-black text-slate-900">{formatCurrency(insuranceData.sumInsured)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Balance</p>
                                            <p className="text-2xl font-black text-olive-600">{formatCurrency(insuranceData.balance)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Valid Until</p>
                                            <p className="text-2xl font-black text-slate-900">{new Date(insuranceData.validUntil).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-500">
                                            <span>Utilization ({insuranceData.utilization}%)</span>
                                            <span>{formatCurrency(insuranceData.sumInsured - insuranceData.balance)} Used</span>
                                        </div>
                                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-olive-500 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${insuranceData.utilization}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-8 flex gap-4">
                                        <button className="text-xs font-bold text-slate-500 hover:text-olive-700 flex items-center gap-2">
                                            <FileText size={14} /> View Policy Document
                                        </button>
                                        <button className="text-xs font-bold text-slate-500 hover:text-olive-700 flex items-center gap-2">
                                            <Download size={14} /> Download E-Card
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Insurance Card Visual */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[40px] shadow-xl text-white flex flex-col justify-between relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <ShieldCheck className="text-olive-400" size={32} />
                                        <span className="text-xs font-bold uppercase tracking-widest opacity-60">Health Card</span>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Insured Name</p>
                                            <p className="text-xl font-bold tracking-wide">{session?.user?.name || "Rajesh Kumar"}</p>
                                        </div>
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Member ID</p>
                                                <p className="font-mono text-sm tracking-wider">MEM-8829-22</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] uppercase tracking-widest opacity-50 mb-1">Group ID</p>
                                                <p className="font-mono text-sm tracking-wider">{insuranceData.groupNumber}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                                    <span className="text-[10px] font-bold opacity-60">Medicore Network</span>
                                    <CreditCard size={20} className="text-olive-400" />
                                </div>
                            </div>
                        </div>

                        {/* Claims History */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Claims</h3>
                                <button className="text-xs font-bold text-olive-600 hover:underline uppercase tracking-wider">View All History</button>
                            </div>

                            <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50/50 border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-8 py-6">Date</th>
                                            <th className="px-8 py-6">Service / Description</th>
                                            <th className="px-8 py-6">Amount Claimed</th>
                                            <th className="px-8 py-6">Status</th>
                                            <th className="px-8 py-6 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {claims.map((claim, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-6 text-sm font-bold text-slate-500">{claim.date}</td>
                                                <td className="px-8 py-6 text-sm font-bold text-slate-900">{claim.service}</td>
                                                <td className="px-8 py-6 text-sm font-black text-slate-900">{formatCurrency(claim.amount)}</td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${claim.status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            claim.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                                'bg-red-50 text-red-600 border-red-100'
                                                        }`}>
                                                        {claim.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-olive-600 transition-colors">
                                                        <ChevronRight size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Covered Services & Helpers */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                                <h3 className="text-lg font-black text-slate-900 mb-6">What's Covered?</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        "Hospitalization", "Consultations", "Laboratory Tests",
                                        "Imaging (X-Ray/MRI)", "Surgeries", "ICU Charges"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                            <CheckCircle2 size={16} className="text-green-500 shrink-0" /> {item}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 line-through decoration-slate-300">
                                        <XCircle size={16} className="text-slate-300 shrink-0" /> Cosmetic Surgery
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-400 line-through decoration-slate-300">
                                        <XCircle size={16} className="text-slate-300 shrink-0" /> Dental Care
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-slate-50">
                                    <button className="text-xs font-bold text-olive-600 hover:underline uppercase tracking-wider">View Complete Policy Terms</button>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-olive-50 to-white p-8 rounded-[32px] border border-olive-100">
                                <h3 className="text-lg font-black text-olive-900 mb-2">Need Assistance?</h3>
                                <p className="text-sm font-medium text-olive-700/70 mb-6">Contact your insurance provider directly or reach out to our billing desk.</p>

                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl border border-olive-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-olive-100 text-olive-600 rounded-full flex items-center justify-center">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Bajaj Allianz Support</p>
                                            <p className="text-sm font-black text-slate-900">1800-209-5858</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border border-olive-100 flex items-center gap-4">
                                        <div className="w-10 h-10 bg-olive-100 text-olive-600 rounded-full flex items-center justify-center">
                                            <ShieldCheck size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Medicore Billing Desk</p>
                                            <p className="text-sm font-black text-slate-900">1800-MEDICORE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}
