"use client";

import {
    Search, ShieldCheck, User, Receipt,
    ArrowRight, Loader2, CheckCircle2,
    AlertCircle, FileText, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";

export default function InsuranceTriagePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [billingData, setBillingData] = useState<any>(null);
    const [isLoadingBilling, setIsLoadingBilling] = useState(false);

    const [claimAmount, setClaimAmount] = useState("");
    const [claimReason, setClaimReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Search Patients
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchQuery.length >= 2) {
                performSearch();
            } else {
                setSearchResults([]);
            }
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const performSearch = async () => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/front-desk/patients/search?q=${searchQuery}`);
            const data = await res.json();
            setSearchResults(data.patients || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectPatient = async (patient: any) => {
        setSelectedPatient(patient);
        setSearchResults([]);
        setSearchQuery("");
        setIsLoadingBilling(true);
        try {
            const res = await fetch(`/api/front-desk/patients/${patient._id}/billing`);
            const data = await res.json();
            setBillingData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingBilling(false);
        }
    };

    const handleClaim = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient || !claimAmount) return;

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/patient/insurance/claim", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mrn: selectedPatient.mrn,
                    amount: Number(claimAmount),
                    reason: claimReason
                })
            });

            if (res.ok) {
                alert("Claim processed successfully!");
                setClaimAmount("");
                setClaimReason("");
                // Refresh billing data
                const refreshRes = await fetch(`/api/front-desk/patients/${selectedPatient._id}/billing`);
                const refreshData = await refreshRes.json();
                setBillingData(refreshData);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to process claim");
            }
        } catch (err) {
            alert("Error submitting claim");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);
    };

    return (
        <>
            <div className="space-y-8 max-w-7xl mx-auto pb-20">
                {/* Header & Search Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Insurance Triage</h1>
                        <p className="text-olive-600 text-xs font-black mt-1 uppercase tracking-[0.2em]">Patient Claim Management</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {isSearching ? <Loader2 size={18} className="text-olive-600 animate-spin" /> : <Search size={18} className="text-slate-400" />}
                        </div>
                        <input
                            type="text"
                            placeholder="Search Patient by MRN or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all shadow-sm"
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50">
                                {searchResults.map((p) => (
                                    <button
                                        key={p._id}
                                        onClick={() => selectPatient(p)}
                                        className="w-full px-6 py-4 text-left hover:bg-olive-50 transition-colors flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-sm font-black text-slate-900">{p.firstName} {p.lastName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.mrn}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-olive-600 transform group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Claim Form (Matches Patient Page) */}
                    <div className="lg:col-span-1 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <h3 className="text-xl font-black text-slate-900 mb-2">Process New Claim</h3>
                        <p className="text-sm font-medium text-slate-500 mb-8 italic">Search and select a patient to apply their insurance coverage.</p>

                        <form onSubmit={handleClaim} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Claim Amount (₹)</label>
                                <input
                                    required
                                    disabled={!selectedPatient}
                                    type="number"
                                    value={claimAmount}
                                    onChange={(e) => setClaimAmount(e.target.value)}
                                    placeholder={selectedPatient ? "Enter amount" : "Select patient first"}
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all font-black text-lg text-slate-900 disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Triage Reason / Notes</label>
                                <textarea
                                    required
                                    disabled={!selectedPatient}
                                    value={claimReason}
                                    onChange={(e) => setClaimReason(e.target.value)}
                                    placeholder="e.g. In-patient claim approval, lab reimbursement..."
                                    className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all font-bold text-sm min-h-[140px] disabled:opacity-50"
                                />
                            </div>

                            <button
                                disabled={isSubmitting || !selectedPatient || !claimAmount}
                                className="w-full bg-olive-600 hover:bg-olive-700 text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-olive-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {isSubmitting ? "Processing..." : <>Process Claim <ChevronRight size={18} /></>}
                            </button>
                        </form>
                    </div>

                    {/* Right Column: Dynamic Info Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {isLoadingBilling ? (
                            <div className="bg-white p-20 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center">
                                <Loader2 className="animate-spin text-olive-600 mb-4" size={48} />
                                <p className="text-slate-400 font-bold uppercase tracking-widest">Loading Records...</p>
                            </div>
                        ) : selectedPatient && billingData ? (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                {/* Financial Card */}
                                <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                                        <ShieldCheck size={200} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                                                    <User size={30} />
                                                </div>
                                                <div>
                                                    <h3 className="text-3xl font-black">{billingData.patient.name}</h3>
                                                    <p className="text-[10px] font-base text-slate-400 uppercase tracking-widest mt-1">MRN: {billingData.patient.mrn} • {billingData.patient.insurance?.provider || "Self-Pay"}</p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-2 bg-olive-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Active File</div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-12">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Unpaid Balance</p>
                                                <p className="text-4xl font-black text-red-400">{formatCurrency(billingData.stats.balanceDue)}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Claim Potential</p>
                                                <p className="text-4xl font-black text-olive-400">{formatCurrency(Math.min(billingData.stats.balanceDue, billingData.patient.insurance?.sumInsured || 0))}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Outstanding Invoices */}
                                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Outstanding Invoices</h3>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">PENDING BILLING CYCLE</p>
                                        </div>
                                        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                            {billingData.invoices.filter((i: any) => i.balanceDue > 0).length} Pending
                                        </div>
                                    </div>
                                    <div className="divide-y divide-slate-50 max-h-[400px] overflow-y-auto">
                                        {billingData.invoices.filter((i: any) => i.balanceDue > 0).length === 0 ? (
                                            <div className="p-10 text-center text-slate-400 font-bold italic">No outstanding invoices for this patient.</div>
                                        ) : (
                                            billingData.invoices.filter((i: any) => i.balanceDue > 0).map((inv: any) => (
                                                <div key={inv.id} className="p-8 hover:bg-slate-50/50 transition-colors flex justify-between items-center group">
                                                    <div className="flex items-center gap-6">
                                                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-olive-600 transition-all">
                                                            <Receipt size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">{inv.description}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{inv.id} • {inv.date}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-base font-black text-red-600">{formatCurrency(inv.balanceDue)}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white p-20 rounded-[40px] border border-slate-100 shadow-sm text-center flex flex-col items-center justify-center h-full min-h-[500px]">
                                <div className="w-24 h-24 bg-olive-50 rounded-full flex items-center justify-center text-olive-600 mb-8">
                                    <ShieldCheck size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-4">No Patient Profile Loaded</h2>
                                <p className="text-slate-500 max-w-sm mx-auto font-medium">Please use the search field at the top to select a patient. Their insurance details and pending bills will appear here.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
