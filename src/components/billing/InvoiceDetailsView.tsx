"use client";

import { useState, useEffect } from "react";
import { FileText, User, DollarSign, Calendar, ChevronDown, ChevronUp, CreditCard, Receipt, AlertCircle } from "lucide-react";

interface InvoiceItem {
    description: string;
    quantity?: number;
    unitPrice?: number;
    total: number;
}

interface Invoice {
    _id: string;
    invoiceNumber: string;
    patientId: {
        firstName: string;
        lastName: string;
        mrn: string;
    };
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: string;
    items: InvoiceItem[];
    paymentSplit?: Array<{
        method: string;
        amount: number;
        date: Date;
    }>;
    createdAt: string;
    updatedAt: string;
}

export default function InvoiceDetailsView() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/billing/invoices/detailed');
            const data = await res.json();
            if (data.invoices) {
                setInvoices(data.invoices);
            }
        } catch (err) {
            console.error("Failed to fetch invoices:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (invoiceId: string) => {
        setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-olive-50 text-olive-700 border-olive-200';
            case 'partial':
                return 'bg-orange-50 text-orange-700 border-orange-200';
            case 'overdue':
                return 'bg-red-50 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 animate-pulse h-32"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {invoices.length === 0 ? (
                <div className="bg-white p-12 rounded-[40px] border-2 border-dashed border-slate-200 text-center">
                    <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No Invoices Found</p>
                </div>
            ) : (
                invoices.map((invoice) => (
                    <div
                        key={invoice._id}
                        className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md"
                    >
                        {/* Invoice Header */}
                        <div
                            className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            onClick={() => toggleExpand(invoice._id)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="p-4 bg-blue-50 rounded-2xl">
                                        <Receipt className="text-blue-600" size={24} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">
                                                {invoice.invoiceNumber}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(invoice.status)}`}>
                                                {invoice.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                <User size={14} className="text-slate-400" />
                                                {invoice.patientId.firstName} {invoice.patientId.lastName}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="font-mono">{invoice.patientId.mrn}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(invoice.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                                        <p className="text-2xl font-black text-slate-900">₹{invoice.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-olive-400 uppercase tracking-widest mb-1">Amount Paid</p>
                                        <p className="text-2xl font-black text-olive-600">₹{invoice.amountPaid.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Balance Due</p>
                                        <p className="text-2xl font-black text-red-600">₹{invoice.balanceDue.toLocaleString()}</p>
                                    </div>
                                    <div className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                        {expandedInvoice === invoice._id ? (
                                            <ChevronUp className="text-slate-400" size={20} />
                                        ) : (
                                            <ChevronDown className="text-slate-400" size={20} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedInvoice === invoice._id && (
                            <div className="border-t border-slate-100 bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
                                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Line Items */}
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <FileText size={16} className="text-slate-400" />
                                            Invoice Line Items
                                        </h4>
                                        <div className="space-y-2">
                                            {invoice.items && invoice.items.length > 0 ? (
                                                invoice.items.map((item, idx) => (
                                                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-slate-800 text-sm">{item.description}</p>
                                                            {item.quantity && item.unitPrice && (
                                                                <p className="text-xs text-slate-400 font-mono mt-1">
                                                                    {item.quantity} × ₹{item.unitPrice.toLocaleString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <p className="font-black text-slate-900">₹{item.total.toLocaleString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No items recorded</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Payment History */}
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <CreditCard size={16} className="text-slate-400" />
                                            Payment History
                                        </h4>
                                        <div className="space-y-2">
                                            {invoice.paymentSplit && invoice.paymentSplit.length > 0 ? (
                                                invoice.paymentSplit.map((payment, idx) => (
                                                    <div key={idx} className="bg-olive-50 p-4 rounded-2xl border border-olive-100 flex justify-between items-center">
                                                        <div>
                                                            <p className="font-bold text-olive-900 text-sm uppercase tracking-wide">
                                                                {payment.method.replace('_', ' ')}
                                                            </p>
                                                            <p className="text-xs text-olive-600 font-mono mt-1">
                                                                {new Date(payment.date).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <p className="font-black text-olive-700">₹{payment.amount.toLocaleString()}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="bg-white p-6 rounded-2xl border border-dashed border-slate-200 text-center">
                                                    <AlertCircle size={24} className="mx-auto mb-2 text-slate-300" />
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No payments recorded</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Summary */}
                                        <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-600">Subtotal</span>
                                                    <span className="font-black text-slate-900">₹{invoice.totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm border-t border-slate-100 pt-2">
                                                    <span className="font-bold text-olive-600">Total Paid</span>
                                                    <span className="font-black text-olive-700">₹{invoice.amountPaid.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-lg border-t-2 border-slate-200 pt-2">
                                                    <span className="font-black text-slate-900 uppercase tracking-wide">Outstanding</span>
                                                    <span className="font-black text-red-600">₹{invoice.balanceDue.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
