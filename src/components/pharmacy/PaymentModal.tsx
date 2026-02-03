"use client";

import { useState, useEffect } from "react";
import { X, User, CreditCard, Banknote, Smartphone, Check, Search, Loader2 } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: any) => void;
    initialData?: {
        name: string;
        phone?: string;
        patientId?: string;
        isRegistered?: boolean;
    };
    initialPaymentMode?: "cash" | "upi" | "card";
    lockPaymentMode?: boolean;
    totalAmount: number;
}

export default function PaymentModal({ isOpen, onClose, onConfirm, totalAmount, initialData, initialPaymentMode = "cash", lockPaymentMode = false }: PaymentModalProps) {
    const [step, setStep] = useState<"customer" | "payment">("customer");
    const [customerType, setCustomerType] = useState<"walk-in" | "registered">("walk-in");

    // Customer Data
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");

    // Search Data
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    // Payment Data
    const [paymentMode, setPaymentMode] = useState<"cash" | "upi" | "card">("cash");
    const [amountPaid, setAmountPaid] = useState<string>(totalAmount.toString());

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                // If context provided (Rx Mode), auto-fill and skip to Payment
                setCustomerName(initialData.name);
                setCustomerPhone(initialData.phone || "");
                setSelectedPatientId(initialData.patientId || null);
                setCustomerType(initialData.isRegistered ? "registered" : "walk-in");
                setStep("payment");
            } else {
                setStep("customer");
                setCustomerName("");
                setCustomerPhone("");
                setCustomerType("walk-in");
                setSelectedPatientId(null);
            }

            setPaymentMode(initialPaymentMode);
            setSearchTerm("");
            setSearchResults([]);
            setAmountPaid(totalAmount.toString());
        }
    }, [isOpen, totalAmount, initialData, initialPaymentMode]);

    // Search Effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchTerm.length >= 2 && customerType === "registered") {
                setIsSearching(true);
                try {
                    const res = await fetch(`/api/patients?search=${encodeURIComponent(searchTerm)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSearchResults(data.patients || []);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults([]);
            }
        }, 500); // Debounce 500ms
        return () => clearTimeout(timer);
    }, [searchTerm, customerType]); // Correct dependency

    if (!isOpen) return null;

    const handleSelectPatient = (p: any) => {
        setCustomerName(`${p.firstName} ${p.lastName}`);
        setCustomerPhone(p.contact?.phone || ""); // Assuming contact.phone structure from API
        setSelectedPatientId(p._id);
        setSearchTerm(""); // Clear search to show selected state implies we found them
        setSearchResults([]);
    };

    const handleNext = () => {
        if (step === "customer") {
            if (!customerName) return; // Simple validation
            setAmountPaid(totalAmount.toString()); // Reset to total
            setStep("payment");
        } else {
            // Final Confirm
            onConfirm({
                customer: {
                    name: customerName,
                    phone: customerPhone,
                    type: customerType,
                    patientId: selectedPatientId
                },
                payment: {
                    mode: paymentMode,
                    amount: Number(amountPaid),
                    status: Number(amountPaid) >= totalAmount ? "paid" : "partial"
                }
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-[500px] rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
                            {step === "customer" ? "Customer Details" : "Payment Gateway"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                            Step {step === "customer" ? "1" : "2"} of 2 • Manual Sale
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                <div className="p-8 flex-1 overflow-y-auto">
                    {step === "customer" ? (
                        <div className="space-y-6">
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                <button
                                    onClick={() => {
                                        setCustomerType("walk-in");
                                        setSelectedPatientId(null);
                                        setCustomerName("");
                                        setCustomerPhone("");
                                    }}
                                    className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${customerType === 'walk-in' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                                >
                                    Walk-in Customer
                                </button>
                                <button
                                    onClick={() => {
                                        setCustomerType("registered");
                                        setCustomerName("");
                                        setCustomerPhone("");
                                    }}
                                    className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${customerType === 'registered' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                                >
                                    Registered Patient
                                </button>
                            </div>

                            {customerType === "walk-in" ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Full Name <span className="text-red-500">*</span></label>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-teal-500 transition-colors">
                                            <User size={16} className="text-slate-400" />
                                            <input
                                                type="text"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                placeholder="Enter customer name"
                                                className="bg-transparent outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                                        <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-teal-500 transition-colors">
                                            <Smartphone size={16} className="text-slate-400" />
                                            <input
                                                type="tel"
                                                value={customerPhone}
                                                maxLength={10}
                                                onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                placeholder="Enter phone number"
                                                className="bg-transparent outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!selectedPatientId ? (
                                        <>
                                            <div>
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Search Patient</label>
                                                <div className="relative">
                                                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-teal-500 transition-colors">
                                                        <Search size={16} className="text-slate-400" />
                                                        <input
                                                            type="text"
                                                            value={searchTerm}
                                                            onChange={(e) => setSearchTerm(e.target.value)}
                                                            placeholder="Search by name, MRN..."
                                                            className="bg-transparent outline-none w-full text-sm font-bold text-slate-900 placeholder:text-slate-300"
                                                            autoFocus
                                                        />
                                                        {isSearching && <Loader2 size={16} className="text-teal-500 animate-spin" />}
                                                    </div>

                                                    {/* Results Dropdown */}
                                                    {searchResults.length > 0 && (
                                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-xl overflow-hidden max-h-60 overflow-y-auto z-10">
                                                            {searchResults.map(p => (
                                                                <div
                                                                    key={p._id}
                                                                    onClick={() => handleSelectPatient(p)}
                                                                    className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0"
                                                                >
                                                                    <div>
                                                                        <p className="text-sm font-bold text-slate-900">{p.firstName} {p.lastName}</p>
                                                                        <p className="text-[10px] text-slate-400 font-bold">{p.mrn}</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <span className="text-[9px] font-black bg-teal-50 text-teal-600 px-2 py-1 rounded-md uppercase tracking-widest">Select</span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {searchTerm.length > 2 && !isSearching && searchResults.length === 0 && (
                                                        <div className="text-center py-4 text-xs font-bold text-slate-400 italic">No patients found.</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-100 flex items-start gap-3">
                                                <div className="p-1 bg-teal-100 rounded-full text-teal-600 mt-0.5">
                                                    <Search size={12} />
                                                </div>
                                                <p className="text-[10px] text-teal-800 font-medium leading-relaxed">
                                                    Search for a registered patient to link this sale to their medical record.
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl relative overflow-hidden">
                                            <button
                                                onClick={() => setSelectedPatientId(null)}
                                                className="absolute top-4 right-4 text-teal-400 hover:text-teal-700 text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Change
                                            </button>
                                            <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Linked Patient</p>
                                            <h4 className="text-lg font-black text-teal-900 uppercase">{customerName}</h4>
                                            <p className="text-xs font-bold text-teal-600 mt-1">{customerPhone || "No Phone"}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount Due</p>
                                <p className="text-4xl font-black text-slate-900">₹{totalAmount.toLocaleString()}</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block">Payment Mode</label>
                                {lockPaymentMode ? (
                                    <div className="p-4 rounded-xl border flex items-center justify-center gap-3 bg-teal-50 border-teal-500 text-teal-900 shadow-sm">
                                        {paymentMode === 'cash' && <Banknote size={24} className="text-teal-600" />}
                                        {paymentMode === 'upi' && <Smartphone size={24} className="text-teal-600" />}
                                        {paymentMode === 'card' && <CreditCard size={24} className="text-teal-600" />}
                                        <span className="text-sm font-black uppercase tracking-widest">{paymentMode} Selected</span>
                                        <Check size={16} className="text-teal-500 ml-2" />
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            onClick={() => setPaymentMode("cash")}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMode === 'cash' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                        >
                                            <Banknote size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Cash</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMode("upi")}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMode === 'upi' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                        >
                                            <Smartphone size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">UPI</span>
                                        </button>
                                        <button
                                            onClick={() => setPaymentMode("card")}
                                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMode === 'card' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                        >
                                            <CreditCard size={24} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Card</span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Amount Received</label>
                                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-teal-500 transition-colors">
                                    <span className="font-bold text-slate-400">₹</span>
                                    <input
                                        type="number"
                                        value={amountPaid}
                                        onChange={(e) => setAmountPaid(e.target.value)}
                                        className="bg-transparent outline-none w-full text-lg font-black text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
                    {step === "payment" && (
                        <button
                            onClick={() => setStep("customer")}
                            className="px-6 py-3 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-100 transition-colors uppercase tracking-widest"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={step === "customer" && !customerName}
                        className="px-8 py-3 bg-slate-900 text-teal-400 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                        {step === "customer" ? "Proceed to Pay" : "Complete Sale"}
                    </button>
                </div>
            </div>
        </div>
    );
}
