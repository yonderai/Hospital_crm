"use client";

import { useState, useEffect } from "react";
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Building2, UserCircle, Calendar, DollarSign, ArrowRight, Loader2 } from "lucide-react";

export default function InsurancePreAuth() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const [treatmentName, setTreatmentName] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [validity, setValidity] = useState<{ valid: boolean; message: string; color: string } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    // Patient Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length > 2) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleSearch = async () => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/front-desk/patients/search?q=${searchQuery}`);
            const data = await res.json();
            if (data.patients) setSearchResults(data.patients);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const selectPatient = async (patient: any) => {
        setIsLoading(true);
        setSearchResults([]);
        setSearchQuery("");
        try {
            const res = await fetch(`/api/front-desk/patients/${patient._id}/billing`);
            const data = await res.json();
            if (data.patient) {
                setSelectedPatient(data.patient);
                setValidity(null);
                setSubmissionSuccess(false);
            }
        } catch (err) {
            console.error("Fetch patient error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const checkValidity = () => {
        if (!selectedPatient || !selectedPatient.insurance) {
            setValidity({ valid: false, message: "No insurance policy found for this patient.", color: "text-red-600 bg-red-50 border-red-100" });
            return;
        }

        const policy = selectedPatient.insurance;
        const cost = Number(estimatedCost);

        if (!policy.hasInsurance) {
            setValidity({ valid: false, message: "Patient does not have active insurance.", color: "text-red-600 bg-red-50 border-red-100" });
            return;
        }

        const today = new Date();
        const expiryDate = new Date(policy.validUntil);
        if (expiryDate < today) {
            setValidity({ valid: false, message: "Insurance policy has expired.", color: "text-red-600 bg-red-50 border-red-100" });
            return;
        }

        if (cost > (policy.sumInsured || 0)) {
            setValidity({
                valid: false,
                message: `Cost (₹${cost.toLocaleString()}) exceeds Sum Insured (₹${(policy.sumInsured || 0).toLocaleString()}).`,
                color: "text-orange-600 bg-orange-50 border-orange-100"
            });
            return;
        }

        setValidity({
            valid: true,
            message: "Policy is active and covers the estimated cost.",
            color: "text-olive-700 bg-olive-50 border-olive-100"
        });
    };

    useEffect(() => {
        if (selectedPatient && treatmentName && estimatedCost) {
            checkValidity();
        } else {
            setValidity(null);
        }
    }, [treatmentName, estimatedCost, selectedPatient]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validity?.valid) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSubmitting(false);
        setSubmissionSuccess(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column: Patient & Treatment Link */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <ShieldCheck size={120} />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                        <UserCircle className="text-olive-600" />
                        Patient Selection
                    </h3>

                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by MRN or Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-olive-500/10 transition-all"
                        />
                        {isSearching && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <Loader2 className="animate-spin text-olive-600" size={18} />
                            </div>
                        )}

                        {searchResults.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden">
                                {searchResults.map((p) => (
                                    <button
                                        key={p._id}
                                        onClick={() => selectPatient(p)}
                                        className="w-full px-5 py-3 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="text-sm font-black text-slate-900 group-hover:text-olive-700 transition-colors uppercase">{p.firstName} {p.lastName}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.mrn}</p>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-200 group-hover:text-olive-400 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center py-10 text-slate-400 gap-3">
                            <Loader2 className="animate-spin text-olive-600" size={32} />
                            <p className="text-xs font-bold uppercase tracking-widest">Fetching Policy Data...</p>
                        </div>
                    ) : selectedPatient ? (
                        <div className="p-6 bg-olive-50/50 rounded-3xl border border-olive-100 animate-in fade-in slide-in-from-top-2 duration-500">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-olive-100 text-olive-600 rounded-2xl">
                                    <UserCircle size={24} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-olive-400 uppercase tracking-widest">Active Patient</p>
                                    <h4 className="text-lg font-black text-slate-900 uppercase">{selectedPatient.name}</h4>
                                    <p className="text-xs font-bold text-slate-500">{selectedPatient.mrn}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-[32px]">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Patient Selected</p>
                        </div>
                    )}
                </div>

                {selectedPatient && (
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm transition-all animate-in fade-in duration-500">
                        <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                            <ShieldCheck className="text-blue-600" />
                            Treatment Details
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Procedure / Treatment Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Knee Replacement Surgery"
                                    value={treatmentName}
                                    onChange={(e) => setTreatmentName(e.target.value)}
                                    className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Estimated Cost (₹)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={estimatedCost}
                                        onChange={(e) => setEstimatedCost(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Policy Details & Validity */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden h-full flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 border-b border-slate-50 pb-6">
                        <Building2 className="text-blue-500" />
                        Insurance Policy Overview
                    </h3>

                    {!selectedPatient ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <Building2 size={64} className="mb-4 opacity-10" />
                            <p className="text-xs font-bold uppercase tracking-widest">Select patient to view policy</p>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</p>
                                    <p className="text-sm font-black text-slate-900">{selectedPatient.insurance?.provider || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Policy Number</p>
                                    <p className="text-sm font-black text-slate-900">{selectedPatient.insurance?.policyNumber || "N/A"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sum Insured</p>
                                    <p className="text-sm font-black text-olive-600">₹{(selectedPatient.insurance?.sumInsured || 0).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Valid Until</p>
                                    <p className="text-sm font-black text-slate-900 flex items-center gap-1">
                                        <Calendar size={14} className="text-slate-400" />
                                        {selectedPatient.insurance?.validUntil ? new Date(selectedPatient.insurance.validUntil).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                            </div>

                            {/* Validity Status */}
                            {validity && (
                                <div className={`p-6 rounded-[32px] border ${validity.color} mb-8 animate-in zoom-in-95 duration-300`}>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">
                                            {validity.valid ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black uppercase tracking-widest mb-1">
                                                {validity.valid ? "Validity Confirmed" : "Eligibility Issue"}
                                            </h4>
                                            <p className="text-xs font-bold opacity-80">{validity.message}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {submissionSuccess ? (
                                <div className="mt-auto bg-olive-500 text-white p-6 rounded-[32px] text-center animate-in fade-in slide-in-from-bottom-4">
                                    <CheckCircle2 size={40} className="mx-auto mb-3" />
                                    <h4 className="text-lg font-black uppercase tracking-tight">Request Approved</h4>
                                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mt-1">Authorization #ATH-{Date.now().toString().slice(-6)}</p>
                                    <button
                                        onClick={() => {
                                            setSubmissionSuccess(false);
                                            setSelectedPatient(null);
                                            setTreatmentName("");
                                            setEstimatedCost("");
                                        }}
                                        className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Process Another
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-auto pt-6 border-t border-slate-50">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!validity?.valid || isSubmitting}
                                        className={`w-full py-4 rounded-[32px] font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg ${validity?.valid
                                                ? 'bg-olive-600 text-white hover:bg-olive-700 shadow-olive-600/20 active:scale-95'
                                                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin text-white/50" size={20} />
                                                Processing Request...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck size={20} />
                                                Request Authorization
                                            </>
                                        )}
                                    </button>
                                    <p className="text-[10px] font-bold text-slate-400 text-center mt-4 uppercase tracking-[0.2em]">Secure Payer Gateway</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
