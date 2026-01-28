"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    CreditCard,
    FileText,
    CheckCircle,
    DollarSign,
    User
} from "lucide-react";

interface InvoiceItem {
    description: string;
    total: number;
}

interface Invoice {
    _id: string;
    invoiceNumber: string;
    patientId: { firstName: string; lastName: string; mrn: string };
    items: InvoiceItem[];
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: string;
    updatedAt: string;
}

export default function BillingDashboard() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("/api/billing/invoices")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setInvoices(data);
                } else {
                    console.error("Failed to fetch invoices:", data);
                    setInvoices([]);
                }
            })
            .catch(err => {
                console.error(err);
                setInvoices([]);
            });
    }, []);

    const handlePayment = async () => {
        if (!selectedInvoice) return;
        setLoading(true);

        const res = await fetch("/api/billing/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId: selectedInvoice._id, paymentMethod: "cash" })
        });

        if (res.ok) {
            alert("Payment Successful! Invoice Closed.");
            setInvoices(invoices.filter(i => i._id !== selectedInvoice._id));
            setSelectedInvoice(null);
        } else {
            alert("Payment failed.");
        }
        setLoading(false);
    };

    return (
        <DashboardLayout>
            <div className="flex h-[calc(100vh-100px)] gap-6">
                {/* Left Panel: Outstanding Invoices */}
                <div className="w-1/3 flex flex-col gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="text-emerald-500" />
                        Billing Queue
                        <span className="text-xs font-medium text-slate-400 ml-auto bg-slate-50 px-2 py-1 rounded-full">{invoices.length} Due</span>
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {invoices.length === 0 ? (
                            <p className="text-slate-400 text-center text-sm py-10">No pending invoices.</p>
                        ) : invoices.map(inv => (
                            <div
                                key={inv._id}
                                onClick={() => setSelectedInvoice(inv)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedInvoice?._id === inv._id ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold uppercase text-slate-500">
                                        #{inv.invoiceNumber}
                                    </span>
                                    <span className="text-[10px] font-black uppercase bg-red-100 text-red-600 px-2 py-0.5 rounded-full">DUE</span>
                                </div>
                                <h4 className="font-bold text-slate-800">{inv.patientId.firstName} {inv.patientId.lastName}</h4>
                                <div className="flex justify-between items-end mt-2">
                                    <p className="text-xs text-slate-400">{new Date(inv.updatedAt).toLocaleDateString()}</p>
                                    <p className="text-sm font-black text-emerald-600">₹{inv.balanceDue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Panel: Payment Terminal */}
                <div className="flex-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
                    {!selectedInvoice ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <CreditCard size={48} className="mb-4 opacity-20" />
                            <p>Select an invoice to process payment</p>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col">
                            <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100">
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Due</div>
                                    <h2 className="text-4xl font-black text-slate-900">₹{selectedInvoice.balanceDue.toLocaleString()}</h2>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase">Patient</div>
                                    <div className="font-medium text-slate-700">{selectedInvoice.patientId.firstName} {selectedInvoice.patientId.lastName}</div>
                                    <div className="text-xs text-slate-400 mt-1">MRN: {selectedInvoice.patientId.mrn}</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4">
                                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-widest">Line Items</h3>
                                <div className="space-y-2">
                                    {selectedInvoice.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 border-b border-slate-50 last:border-0">
                                            <span className="text-sm text-slate-600 font-medium">{item.description}</span>
                                            <span className="text-sm font-bold text-slate-900">₹{item.total}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-auto">
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <button className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 font-bold transition-all flex flex-col items-center gap-2">
                                        <CreditCard size={20} />
                                        Credit Card
                                    </button>
                                    <button className="p-4 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 font-bold transition-all flex flex-col items-center gap-2 ring-2 ring-emerald-100">
                                        <DollarSign size={20} />
                                        Cash / UPI
                                    </button>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button onClick={() => setSelectedInvoice(null)} className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50">
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 flex items-center gap-2 w-full justify-center"
                                    >
                                        {loading ? "Processing..." : <> <CheckCircle size={18} /> Confirm Payment </>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
