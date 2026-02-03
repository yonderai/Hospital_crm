"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Pill,
    CheckCircle,
    ShoppingBag,
    User,
    AlertTriangle
} from "lucide-react";
import PaymentModal from "@/components/pharmacy/PaymentModal";

interface Medication {
    drugName: string;
    dosage: string;
    quantity: number;
    instructions: string;
}

interface Prescription {
    _id: string;
    prescriptionId: string;
    patientId: { _id: string; firstName: string; lastName: string; mrn: string };
    providerId: { firstName: string; lastName: string };
    medications: Medication[];
    status: string;
    prescribedDate: string;
}

export default function PharmacyDispensing() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [activeTab, setActiveTab] = useState<"queue" | "manual">("queue");
    const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
    const [dispenseItems, setDispenseItems] = useState<any[]>([]);
    const [manualItems, setManualItems] = useState<any[]>([]);
    const [invoice, setInvoice] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [paymentMode, setPaymentMode] = useState<"cash" | "upi" | "card">("cash");
    const [isPaymentLocked, setIsPaymentLocked] = useState(false);

    // ... existing code ...

    // Split handleDispense into two: Pre-check and Final
    const initiateDispense = () => {
        if (activeTab === "manual") {
            // Open Modal for manual
            setIsPaymentLocked(false);
            setIsPaymentModalOpen(true);
        } else {
            // Standard Rx Dispense
            handleDispense(null);
        }
    };

    const handleDispense = async (posData?: any) => {
        setLoading(true);
        setError(null);

        try {
            // Construct Payload based on Mode
            let payload: any = {};

            if (selectedRx) {
                // RX Mode: Include payment details if provided (Pay & Dispense)
                payload = {
                    prescriptionId: selectedRx._id,
                    items: dispenseItems,
                    paymentDetails: posData?.payment
                };
            } else {
                // Manual/POS Mode
                payload = {
                    items: manualItems,
                    patientId: posData?.customer?.patientId || null,
                    customerDetails: posData?.customer,
                    paymentDetails: posData?.payment
                };
            }

            const res = await fetch("/api/pharmacy/dispense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                await fetchData(); // Refresh both lists
                setSelectedRx(null);
                setManualItems([]);
                setDispenseItems([]);
                setIsPaymentModalOpen(false); // Close if open
            } else {
                setError(data.error || "Error dispensing.");
            }
        } catch (err) {
            setError("Connection failed.");
        } finally {
            setLoading(false);
        }
    };

    const fetchPaymentDetails = async (prescriptionId: string) => {
        try {
            const res = await fetch(`/api/pharmacy/payment/verify?prescriptionId=${prescriptionId}`);
            if (res.ok) {
                const data = await res.json();

                // Merge Unit Prices into Dispense Items matching by drugName
                if (data.items) {
                    setDispenseItems(prevItems => prevItems.map(item => {
                        // Match roughly by name
                        const priceInfo = data.items.find((i: any) =>
                            i.drugName?.toLowerCase() === item.drugName.toLowerCase() ||
                            i.description?.toLowerCase().includes(item.drugName.toLowerCase())
                        );
                        return {
                            ...item,
                            unitPrice: priceInfo ? priceInfo.unitPrice : 0
                        };
                    }));
                }

                // If status is not_generated, invoice is null, but we handle that in UI
                setInvoice(data.status === 'not_generated' ? { ...data, status: 'not_generated', totalAmount: data.totalAmount || 0 } : data);
            } else {
                setInvoice(null);
            }
        } catch (err) {
            console.error("Fetch Payment Error", err);
        }
    };

    const fetchData = async () => {
        try {
            const [queueRes] = await Promise.all([
                fetch("/api/pharmacy/queue")
            ]);

            if (queueRes.ok) {
                const data = await queueRes.json();
                setPrescriptions(Array.isArray(data) ? data : []);
            }


        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // 30s auto-refresh
        return () => clearInterval(interval);
    }, []);



    const handleVerifyPayment = async (mode: string) => {
        // Instead of calling verify API directly, Open Payment Modal to trigger Dispense with Payment
        setPaymentMode(mode as any);
        setIsPaymentLocked(true);
        setIsPaymentModalOpen(true);
    };

    // Simple mock inventory fetch for demo, normally would be a search API
    const handleSearch = async (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }
        // Improve this by creating a real search API or caching inventory
        const res = await fetch("/api/pharmacy/inventory");
        const items = await res.json();
        setSearchResults(items.filter((i: any) => i.name.toLowerCase().includes(term.toLowerCase())));
    };

    const addManualItem = (item: any) => {
        if (manualItems.find(i => i.sku === item.sku)) return;
        setManualItems([...manualItems, {
            sku: item.sku,
            drugName: item.name,
            quantity: 1,
            originalQuantity: item.quantityOnHand,  // Just for reference UI
            unitPrice: item.sellingPrice
        }]);
        setSearchTerm("");
        setSearchResults([]);
    };

    const updateManualQty = (sku: string, qty: number) => {
        const newItems = manualItems.map(i => i.sku === sku ? { ...i, quantity: qty } : i);
        setManualItems(newItems);
    };

    const removeManualItem = (sku: string) => {
        setManualItems(manualItems.filter(i => i.sku !== sku));
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6 font-sans">
                {/* Left Panel: Navigation */}
                <div className="w-1/3 flex flex-col gap-6 bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Dispensing</h3>
                        <span className="text-[10px] font-black bg-teal-50 text-teal-600 px-3 py-1 rounded-full uppercase tracking-widest border border-teal-100">
                            Live Stream
                        </span>
                    </div>

                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[20px]">
                        <button
                            onClick={() => { setActiveTab("queue"); setSelectedRx(null); }}
                            className={`flex-1 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'queue' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Rx Queue ({prescriptions.length})
                        </button>

                        <button
                            onClick={() => { setActiveTab("manual"); setSelectedRx(null); }}
                            className={`flex-1 py-3 rounded-[14px] text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <span className="flex items-center justify-center gap-1">
                                <ShoppingBag size={12} /> Manual
                            </span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {prescriptions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 opacity-40">
                                <Pill size={40} className="mb-3 text-slate-300" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Empty State</p>
                            </div>
                        ) : prescriptions.map(rx => (
                            <div
                                key={rx._id}
                                onClick={() => {
                                    setSelectedRx(rx);
                                    setDispenseItems(rx.medications.map(m => ({ ...m, originalQuantity: m.quantity })));
                                    setError(null);
                                    fetchPaymentDetails(rx._id);
                                }}
                                className={`p-6 rounded-[28px] border cursor-pointer transition-all duration-300 relative overflow-hidden group ${selectedRx?._id === rx._id ? 'border-teal-500 bg-teal-50 shadow-xl shadow-teal-500/5' : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-teal-200'}`}
                            >
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-widest ${selectedRx?._id === rx._id ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                                            Ref: {rx.prescriptionId.slice(-8)}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-bold">{new Date(rx.prescribedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <h4 className="font-black text-slate-900 tracking-tight uppercase group-hover:text-teal-600 transition-colors">
                                        {rx.patientId?.firstName} {rx.patientId?.lastName}
                                    </h4>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider block">
                                        {rx.medications.length} items • Dr. {rx.providerId?.lastName}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Rx Details */}
                <div className="flex-1 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <ShoppingBag size={200} />
                    </div>

                    {activeTab === "manual" ? (
                        <div className="h-full flex flex-col z-10">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic mb-6">Manual Point of Sale</h2>

                            {/* Search */}
                            <div className="relative mb-6 z-50">
                                <input
                                    type="text"
                                    placeholder="Search Inventory..."
                                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-teal-500"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 bg-white shadow-xl border border-slate-100 rounded-2xl mt-2 max-h-60 overflow-y-auto p-2">
                                        {searchResults.map(item => (
                                            <div
                                                key={item._id}
                                                onClick={() => addManualItem(item)}
                                                className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer flex justify-between items-center"
                                            >
                                                <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 px-2 py-1 rounded-md">
                                                    Stock: {item.quantityOnHand}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cart */}
                            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                                {manualItems.length === 0 && (
                                    <div className="text-center py-10 opacity-40">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Cart is empty</p>
                                    </div>
                                )}
                                {manualItems.map((item) => (
                                    <div key={item.sku} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-black text-slate-900 uppercase">{item.drugName}</p>
                                            <p className="text-[10px] bg-white px-2 py-0.5 rounded-md inline-block mt-1 text-slate-500 font-bold border border-slate-200">SKU: {item.sku}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-16 px-2 py-1 bg-white border border-slate-200 rounded-lg text-center font-bold outline-none"
                                                value={item.quantity}
                                                onChange={(e) => updateManualQty(item.sku, Number(e.target.value))}
                                            />
                                            <button onClick={() => removeManualItem(item.sku)} className="text-slate-400 hover:text-red-500">
                                                <div className="bg-white p-2 rounded-lg border border-slate-200 hover:border-red-200 transition-colors">✕</div>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <div className="text-xl font-black text-slate-900">
                                    Total: {manualItems.reduce((acc, i) => acc + i.quantity, 0)} items
                                </div>
                                <button
                                    onClick={initiateDispense}
                                    disabled={manualItems.length === 0 || loading}
                                    className="px-8 py-4 bg-slate-900 text-teal-400 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.95] transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    {loading ? "Processing..." : "Complete Sale"}
                                </button>
                            </div>
                        </div>
                    ) : !selectedRx ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                                <ShoppingBag size={40} className="opacity-20" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.4em] italic text-slate-400">Target Selection Pending</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-teal-400">
                                            <User size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic leading-none">
                                                {selectedRx.patientId?.firstName} {selectedRx.patientId?.lastName}
                                            </h2>
                                            <p className="text-[10px] font-black text-teal-600 uppercase tracking-[0.3em] mt-2">Active Clinical Profile • {selectedRx.patientId?.mrn}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prescribed By</p>
                                    <div className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                                        <p className="text-sm font-black text-slate-700">Dr. {selectedRx.providerId?.firstName} {selectedRx.providerId?.lastName}</p>
                                    </div>
                                    <p className="text-[9px] font-bold text-slate-400 px-1 italic italic">Authorized on {new Date(selectedRx.prescribedDate).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-6 custom-scrollbar">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <div className="w-1.5 h-6 bg-teal-500 rounded-full" />
                                        Prescription List
                                    </h3>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedRx.medications.length} items to process</span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {dispenseItems.map((med, idx) => (
                                        <div key={idx} className={`flex justify-between items-center p-6 rounded-[28px] border transition-all group ${med.quantity < med.originalQuantity ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50/50 border-slate-100'}`}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white rounded-xl border border-slate-100 flex items-center justify-center text-teal-600 shadow-sm group-hover:scale-110 transition-transform">
                                                    <Pill size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-slate-900 uppercase tracking-tight">{med.drugName}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                        {med.dosage} • <span className="italic normal-case">{med.instructions}</span>
                                                    </div>
                                                    {med.quantity < med.originalQuantity && (
                                                        <div className="flex items-center gap-1 mt-1 text-yellow-600">
                                                            <AlertTriangle size={10} />
                                                            <span className="text-[9px] font-black uppercase tracking-widest">Partial Dispense</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Qty</p>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={med.originalQuantity}
                                                        className="w-20 px-3 py-2 bg-white border border-slate-200 rounded-xl text-center font-black text-slate-900 outline-none focus:ring-2 focus:ring-teal-500"
                                                        value={med.quantity}
                                                        onChange={(e) => {
                                                            const newItems = [...dispenseItems];
                                                            newItems[idx].quantity = Number(e.target.value);
                                                            setDispenseItems(newItems);
                                                        }}
                                                    />
                                                </div>
                                                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">/ {med.originalQuantity}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {error && (
                                <div className="my-6 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-600 animate-bounce">
                                    <AlertTriangle size={24} />
                                    <span className="text-xs font-black uppercase tracking-widest">{error}</span>
                                </div>
                            )}

                            <div className="mt-8 pt-8 border-t border-slate-100">
                                {activeTab === "queue" ? (
                                    <>
                                        <div className="flex items-center gap-4 bg-teal-50/50 p-6 rounded-[28px] border border-teal-100/50 mb-8">
                                            <div className="flex-1">
                                                <p className="text-[10px] font-black text-teal-800 uppercase tracking-[0.2em] mb-1">Payment Status</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {invoice ? (
                                                        <>
                                                            <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {invoice.status === 'paid' ? 'PAID' : 'PAYMENT PENDING'}
                                                            </div>
                                                            <div className="text-xl font-black text-slate-900 ml-2">
                                                                ₹{invoice.status === 'paid' ? invoice.totalAmount : dispenseItems.reduce((acc, item) => acc + (item.quantity * (item.unitPrice || 0)), 0)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-slate-400 font-medium italic">Fetching invoice...</span>
                                                    )}
                                                </div>
                                            </div>
                                            {invoice && invoice.status !== 'paid' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleVerifyPayment('cash')}
                                                        disabled={loading}
                                                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                                    >
                                                        Accept Cash
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerifyPayment('upi')}
                                                        disabled={loading}
                                                        className="px-4 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
                                                    >
                                                        Verify UPI
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => setSelectedRx(null)}
                                                className="px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                                            >
                                                Abort
                                            </button>
                                            <button
                                                onClick={initiateDispense}
                                                disabled={loading || !invoice || invoice.status !== 'paid'}
                                                className={`px-12 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center gap-3 ${loading || !invoice || invoice.status !== 'paid'
                                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                                                    : 'bg-slate-900 text-teal-400 shadow-slate-900/30 hover:scale-[1.02] active:scale-[0.98]'
                                                    }`}
                                            >
                                                {loading ? "Processing..." : <> <CheckCircle size={18} /> Finalize & Dispense </>}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100 text-center">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">This prescription was successfully dispensed and billed.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onConfirm={handleDispense}
                initialPaymentMode={paymentMode}
                lockPaymentMode={isPaymentLocked}
                totalAmount={activeTab === 'manual'
                    ? manualItems.reduce((acc, i) => acc + (i.quantity * i.unitPrice), 0)
                    : (invoice?.status === 'paid'
                        ? invoice.totalAmount
                        : dispenseItems.reduce((acc, i) => acc + (i.quantity * (i.unitPrice || 0)), 0))
                }
                initialData={selectedRx ? {
                    name: `${selectedRx.patientId.firstName} ${selectedRx.patientId.lastName}`,
                    patientId: selectedRx.patientId._id, // Ensure this exists in your Type or backend population
                    isRegistered: true
                } : undefined}
            />
        </DashboardLayout>
    );
}
