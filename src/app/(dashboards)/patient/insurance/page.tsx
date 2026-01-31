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
    const [claiming, setClaiming] = useState(false);
    const [claimAmount, setClaimAmount] = useState("");
    const [policyDetails, setPolicyDetails] = useState("");

    const fetchData = async () => {
        setLoading(true);
        try {
            const billingRes = await fetch("/api/patient/billing");
            const billingData = await billingRes.json();

            setInsuranceData({
                provider: "Bajaj Allianz",
                policyNumber: "POL123456789",
                groupNumber: "GRP987654",
                coverageType: "Family Floater",
                sumInsured: 500000,
                balance: 500000 - (billingData.stats?.insuranceCovered || 0),
                validUntil: "2025-12-31",
                hasInsurance: true,
                utilization: Math.min(100, Math.round(((billingData.stats?.insuranceCovered || 0) / 500000) * 100))
            });

            const insuranceClaims = billingData.invoices
                .filter((inv: any) => inv.insuranceCoverage > 0)
                .map((inv: any) => ({
                    date: inv.date,
                    service: inv.description,
                    amount: inv.insuranceCoverage,
                    status: inv.status === 'paid' ? 'Approved' : 'Pending'
                }));

            setClaims(insuranceClaims);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        setClaiming(true);
        try {
            const res = await fetch("/api/patient/insurance/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: Number(claimAmount),
                    policyNumber: insuranceData.policyNumber,
                    reason: policyDetails
                })
            });

            if (res.ok) {
                alert("Claim submitted successfully!");
                setClaimAmount("");
                setPolicyDetails("");
                fetchData(); // Refresh data
            } else {
                const err = await res.json();
                alert(err.error || "Claim submission failed");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setClaiming(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Direct Claims Portal</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Patient Insurance Dashboard</p>
                    </div>
                    {insuranceData && (
                        <div className="bg-olive-50 px-6 py-4 rounded-2xl border border-olive-100 flex items-center gap-4">
                            <div>
                                <p className="text-[10px] font-black text-olive-600 uppercase tracking-widest mb-0.5">Available Limit</p>
                                <p className="text-xl font-black text-olive-900">{formatCurrency(insuranceData.balance)}</p>
                            </div>
                            <div className="w-10 h-10 bg-olive-100 rounded-xl flex items-center justify-center text-olive-600">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="h-96 flex items-center justify-center">
                        <Activity className="animate-spin text-olive-600" size={48} />
                    </div>
                ) : (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Claim Form - Always Visible */}
                            <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-500">
                                <h3 className="text-xl font-black text-slate-900 mb-2">New Claim Application</h3>
                                <p className="text-sm font-medium text-slate-500 mb-8 italic">Apply for a claim to reduce your unpaid hospital balance.</p>

                                <form onSubmit={handleClaim} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Claim Amount (₹)</label>
                                        <input
                                            required
                                            type="number"
                                            value={claimAmount}
                                            onChange={(e) => setClaimAmount(e.target.value)}
                                            placeholder="Enter amount"
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all font-black text-lg text-slate-900"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reason for Claim</label>
                                        <textarea
                                            required
                                            value={policyDetails}
                                            onChange={(e) => setPolicyDetails(e.target.value)}
                                            placeholder="e.g. Consultation, Labs, Surgery..."
                                            className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all font-bold text-sm min-h-[120px]"
                                        />
                                    </div>

                                    <button
                                        disabled={claiming}
                                        className="w-full bg-olive-600 hover:bg-olive-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-olive-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                                    >
                                        {claiming ? "Processing..." : <>Process Claim <ChevronRight size={18} /></>}
                                    </button>
                                </form>
                            </div>

                            {/* Summary Card */}
                            <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden h-full">
                                    <div className="absolute top-0 right-0 p-10 opacity-10">
                                        <ShieldCheck size={200} />
                                    </div>
                                    <div className="relative z-10 flex flex-col h-full justify-between">
                                        <div>
                                            <div className="flex justify-between items-start mb-8">
                                                <div>
                                                    <h3 className="text-3xl font-black text-white">{insuranceData.provider}</h3>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Policy ID: {insuranceData.policyNumber}</p>
                                                </div>
                                                <div className="px-5 py-2 bg-olive-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-olive-500/20">Active Coverage</div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-12 mb-10">
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Sum Insured</p>
                                                    <p className="text-4xl font-black">{formatCurrency(insuranceData.sumInsured)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Used Limit</p>
                                                    <p className="text-4xl font-black text-olive-400">{formatCurrency(insuranceData.sumInsured - insuranceData.balance)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                                                <span>Utilization Percentage</span>
                                                <span>{insuranceData.utilization}%</span>
                                            </div>
                                            <div className="h-4 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5">
                                                <div
                                                    className="h-full bg-olive-500 rounded-full transition-all duration-1500"
                                                    style={{ width: `${insuranceData.utilization}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight ml-2">Claim History</h3>
                            <div className="bg-white rounded-[40px] border border-slate-100 overflow-hidden shadow-sm">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-8 py-6">Date</th>
                                            <th className="px-8 py-6">Service Type</th>
                                            <th className="px-8 py-6">Amount</th>
                                            <th className="px-8 py-6">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {claims.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-bold italic text-sm">No claims found.</td>
                                            </tr>
                                        ) : (
                                            claims.map((claim, idx) => (
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">{claim.date}</td>
                                                    <td className="px-8 py-6 text-sm font-black text-slate-900">{claim.service}</td>
                                                    <td className="px-8 py-6 text-sm font-black text-emerald-600">{formatCurrency(claim.amount)}</td>
                                                    <td className="px-8 py-6">
                                                        <span className="px-4 py-1.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                                            {claim.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
