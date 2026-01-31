"use client";

import { useState, useEffect } from "react";
import {
    Search, DollarSign, Receipt, User,
    ArrowRight, Loader2, CheckCircle2,
    AlertCircle, FileText, ChevronRight,
    TrendingUp, History, CreditCard, Banknote
} from "lucide-react";

export default function FeeCollectionPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [invoices, setInvoices] = useState<any[]>([]);
    const [todayStats, setTodayStats] = useState<any>({ collectedToday: 0, regFeesCollectedToday: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/front-desk/fees");
            const data = await res.json();
            if (data.success) {
                setInvoices(data.invoices);
                if (data.todayStats) setTodayStats(data.todayStats);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePayment = async (invoiceId: string) => {
        setIsProcessing(invoiceId);
        try {
            // Mock payment processing
            const res = await fetch(`/api/front-desk/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invoiceId,
                    amount: invoices.find(i => i.id === invoiceId).balanceDue,
                    method: 'Cash'
                })
            });

            if (res.ok) {
                alert("Payment collected successfully!");
                fetchInvoices();
            }
        } catch (err) {
            alert("Payment failed");
        } finally {
            setIsProcessing(null);
        }
    };

    const formatCurrency = (amt: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amt);
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        totalPending: invoices.reduce((acc, curr) => acc + curr.balanceDue, 0),
        regFeesCount: invoices.filter(inv => inv.type === 'Registration').length,
        regFeesAmount: invoices.filter(inv => inv.type === 'Registration').reduce((acc, curr) => acc + curr.balanceDue, 0)
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-olive-600 text-white rounded-2xl">
                            <DollarSign size={28} />
                        </div>
                        Fee Collection
                    </h1>
                    <p className="text-olive-600 text-xs font-black mt-2 uppercase tracking-[0.2em]">Revenue & Billing Desk</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Patient, MRN or Invoice #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
                    <h3 className="text-3xl font-black text-slate-900">{formatCurrency(stats.totalPending)}</h3>
                </div>
                <div className="bg-olive-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <TrendingUp size={60} />
                    </div>
                    <p className="text-[10px] font-black text-olive-400 uppercase tracking-widest mb-1">Registration Collected (Today)</p>
                    <h3 className="text-3xl font-black">{formatCurrency(todayStats.regFeesCollectedToday)}</h3>
                    <p className="text-[10px] font-bold text-olive-200 mt-1 uppercase tracking-widest">{stats.regFeesCount} PENDING COLLECTIONS</p>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Collected (Today)</p>
                        <h3 className="text-lg font-black text-slate-900">{formatCurrency(todayStats.collectedToday)}</h3>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all">
                        <History size={20} />
                    </button>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Pending Invoices</h3>
                    <div className="flex gap-2">
                        <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Self-Pay Only</span>
                    </div>
                </div>

                <div className="divide-y divide-slate-50">
                    {isLoading ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center">
                            <Loader2 className="animate-spin text-olive-600 mb-4" size={40} />
                            <p className="text-slate-400 font-bold uppercase tracking-widest">Loading Invoices...</p>
                        </div>
                    ) : filteredInvoices.length === 0 ? (
                        <div className="p-20 text-center">
                            <Receipt size={64} className="mx-auto text-slate-200 mb-6" />
                            <h3 className="text-xl font-black text-slate-900">No Pending Invoices</h3>
                            <p className="text-slate-400 font-medium mt-2">All patients have cleared their dues.</p>
                        </div>
                    ) : (
                        filteredInvoices.map((inv) => (
                            <div key={inv.id} className="p-8 hover:bg-slate-50/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-8 group">
                                <div className="flex items-start gap-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${inv.type === 'Registration' ? 'bg-olive-100 text-olive-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {inv.type === 'Registration' ? <User size={24} /> : <FileText size={24} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h4 className="text-lg font-black text-slate-900">{inv.patientName}</h4>
                                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${inv.type === 'Registration' ? 'bg-olive-50 text-olive-600' : 'bg-blue-50 text-blue-600'}`}>
                                                {inv.type}
                                            </span>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">MRN: {inv.mrn} • {inv.invoiceNumber}</p>
                                        <p className="text-sm text-slate-500 font-medium mt-1 italic">{inv.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12 ml-20 lg:ml-0">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Balance Due</p>
                                        <p className="text-2xl font-black text-slate-900">{formatCurrency(inv.balanceDue)}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handlePayment(inv.id)}
                                            disabled={isProcessing === inv.id}
                                            className="px-6 py-4 bg-olive-600 hover:bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 active:scale-[0.98] transition-all flex items-center gap-2 group/btn"
                                        >
                                            {isProcessing === inv.id ? (
                                                <Loader2 className="animate-spin" size={16} />
                                            ) : (
                                                <>
                                                    <Banknote size={16} />
                                                    Collect Cash
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handlePayment(inv.id)}
                                            disabled={isProcessing === inv.id}
                                            className="p-4 bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-900 rounded-2xl transition-all"
                                        >
                                            <CreditCard size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
