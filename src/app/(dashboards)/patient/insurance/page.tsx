"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, Calendar, CheckCircle2, Info, ArrowRight, X } from "lucide-react";

export default function PatientInsurancePage() {
    const [loading, setLoading] = useState(true);
    const [insurance, setInsurance] = useState<any>(null);
    const [showClaimModal, setShowClaimModal] = useState(false);
    const [claimAmount, setClaimAmount] = useState("");
    const [claimNotes, setClaimNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchInsurance();
    }, []);

    const fetchInsurance = () => {
        fetch('/api/patient/insurance')
            .then(res => res.json())
            .then(json => {
                setInsurance(json.data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleFileClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch('/api/patient/insurance/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    claimAmount: parseFloat(claimAmount),
                    notes: claimNotes
                })
            });

            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: 'Claim filed and applied to your billing successfully!' });
                setShowClaimModal(false);
                setClaimAmount("");
                setClaimNotes("");
                // Refresh data could go here if needed
                setTimeout(() => setMessage(null), 5000);
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to file claim' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An error occurred while submitting' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-12 pb-20">
                {/* Status Message */}
                {message && (
                    <div className={`fixed top-24 right-8 z-50 p-4 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-4 duration-300 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
                        }`}>
                        <div className="flex items-center gap-3">
                            {message.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
                            <p className="text-sm font-bold">{message.text}</p>
                        </div>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">INSURANCE</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-2 uppercase tracking-[0.4em]">POLICY & COVERAGE DETAILS</p>
                    </div>
                    <button
                        onClick={() => setShowClaimModal(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-olive-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-olive-700 hover:shadow-lg transition-all"
                    >
                        <ShieldCheck size={16} />
                        File New Claim
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                        <div className="h-64 bg-slate-50 rounded-[40px]"></div>
                        <div className="h-64 bg-slate-50 rounded-[40px]"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Main Insurance Card */}
                        <div className="bg-gradient-to-br from-olive-600 to-olive-800 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                            {/* Decorative background element */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start mb-16">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                            <ShieldCheck size={32} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black tracking-tight">{insurance.provider}</h3>
                                            <p className="text-white/60 text-xs font-bold uppercase tracking-widest">{insurance.coverageType}</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/80">Valid Until</p>
                                        <p className="text-sm font-black">{insurance.expiryDate}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Policy Number</p>
                                        <p className="text-xl font-bold font-mono tracking-wider">{insurance.policyNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Group ID</p>
                                        <p className="text-xl font-bold font-mono tracking-wider">{insurance.groupNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Benefit Tier</p>
                                        <p className="text-xl font-bold tracking-tight">Platinum Plus</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-xl font-bold tracking-tight">{insurance.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Secondary Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Coverage Summary */}
                            <div className="md:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <CreditCard size={20} />
                                    </div>
                                    <h4 className="font-black text-slate-800 tracking-tight">Coverage Breakdown</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "OPD Consultation", value: "100% Covered" },
                                        { label: "Lab Investigations", value: "90% Covered" },
                                        { label: "Radiology / Scans", value: "90% Covered" },
                                        { label: "IPD / Inpatient", value: "80% Covered" },
                                        { label: "Pharmacy / Meds", value: "50% Covered" },
                                        { label: "Emergency Services", value: "100% Covered" }
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
                                            <span className="text-xs font-black text-olive-700">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* TPA Support */}
                            <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-olive-50 rounded-xl flex items-center justify-center text-olive-600">
                                            <Info size={20} />
                                        </div>
                                        <h4 className="font-black text-slate-800 tracking-tight">Need Help?</h4>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed">
                                        Contact your dedicated insurance desk for pre-authorization or claim queries.
                                    </p>
                                </div>
                                <button className="mt-8 group flex items-center justify-between w-full px-6 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-olive-700 transition-all">
                                    Insurance Desk
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Claim Modal */}
                {showClaimModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-300">
                            <div className="p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">File Insurance Claim</h3>
                                    <p className="text-olive-600 text-[10px] font-black uppercase tracking-widest mt-1">Submit Clinical Expenses</p>
                                </div>
                                <button
                                    onClick={() => setShowClaimModal(false)}
                                    className="p-3 hover:bg-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleFileClaim} className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Claim Amount (USD)</label>
                                    <div className="relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                                        <input
                                            required
                                            type="number"
                                            value={claimAmount}
                                            onChange={(e) => setClaimAmount(e.target.value)}
                                            placeholder="0.00"
                                            className="w-full pl-10 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:bg-white transition-all font-bold text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Claim Reason / Notes</label>
                                    <textarea
                                        value={claimNotes}
                                        onChange={(e) => setClaimNotes(e.target.value)}
                                        placeholder="Briefly describe the clinical service or reason for this claim..."
                                        rows={4}
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-olive-500 focus:bg-white transition-all font-medium text-slate-700 resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={submitting}
                                        type="submit"
                                        className="w-full py-5 bg-olive-600 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-olive-600/20 hover:bg-olive-700 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        {submitting ? "Processing..." : (
                                            <>
                                                <ShieldCheck size={20} />
                                                Submit Claim to Billing
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
