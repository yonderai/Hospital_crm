"use client";

import { useState, useEffect } from "react";

import {
    IndianRupee,
    Search,
    CreditCard,
    FileText,
    ArrowUpRight,
    CheckCircle2,
    Plus,
    History,
    ChevronRight,
    ShieldCheck,
    Receipt
} from "lucide-react";

export default function FrontDeskBillingPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("/api/front-desk/transactions");
            const data = await res.json();
            if (data.transactions) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleCollectBalance = async (appointmentId: string) => {
        try {
            const res = await fetch("/api/appointments/collect-balance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId })
            });
            const data = await res.json();
            if (res.ok) {
                alert("Balance collected successfully!");
                fetchTransactions(); // Refresh list
            } else {
                alert(data.error || "Failed to collect balance");
            }
        } catch (error) {
            alert("Error collecting balance");
        }
    };

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Checkout Terminal</h2>
                    <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">FRONT DESK POS & BILLING NODE</p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        Day End Summary
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                        <Plus size={16} /> New Transaction
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <BillingStat label="Today's Collections" value="₹4,820" detail="+12% from avg" icon={IndianRupee} color="text-olive-600" bg="bg-olive-50" />
                <BillingStat label="Pending Payments" value="12" detail="4 high value" icon={ClockIcon} color="text-blue-600" bg="bg-blue-50" />
                <BillingStat label="Claims Verified" value="98%" detail="Eligibility Check" icon={ShieldCheck} color="text-teal-600" bg="bg-teal-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Transaction List */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                        <div className="flex gap-4">
                            <div className="relative">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input className="bg-white border border-slate-200 px-8 py-2 rounded-xl text-[10px] font-bold outline-none w-48" placeholder="Search by name/TXID..." />
                            </div>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {loading ? (
                            [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-50/10 animate-pulse" />)
                        ) : (
                            transactions.map((tx, idx) => (
                                <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                                            <Receipt size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 tracking-tight">{tx.patient}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{tx.id} • {tx.type}</p>
                                        </div>
                                    </div>

                                    {/* Payment Details Column */}
                                    <div className="text-right hidden md:block">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] uppercase font-bold text-slate-400">Total: ₹{tx.totalAmount}</span>
                                            <span className="text-[10px] uppercase font-bold text-olive-600">Pd: ₹{tx.paidAmount}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10 text-right">
                                        <div>
                                            <p className="text-xl font-black text-slate-900 leading-none">₹{tx.dueAmount}</p>
                                            <p className="text-[9px] font-black text-red-500 uppercase mt-1">Pending</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${tx.rawStatus === 'paid' ? 'bg-olive-50 text-olive-600 border-olive-100' :
                                                tx.rawStatus === 'partial' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                {tx.status}
                                            </span>
                                            {tx.rawStatus === 'partial' && (
                                                <button
                                                    onClick={() => handleCollectBalance(tx.id)}
                                                    className="px-3 py-1.5 bg-slate-900 text-white text-[10px] font-bold rounded-lg hover:bg-slate-800 transition-all uppercase tracking-wider"
                                                >
                                                    Collect Rem
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Fast Checkout Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-teal-400" size={24} />
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Fast Checkout</h4>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white/5 p-5 rounded-3xl border border-white/10">
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-3">Card Terminal Status</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                                        <span className="text-xs font-bold">POS Node Alpha Connected</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Active Insurance Check</p>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Payer Entity</span>
                                        <span className="text-white">Blue Cross Elite</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span className="text-slate-400">Coverage</span>
                                        <span className="text-teal-400">Verified (80%)</span>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20">
                                Collect Payment
                            </button>
                        </div>
                        <IndianRupee className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Tasks</h4>
                        <div className="space-y-3">
                            <FinanceTask label="Insurance Verification" icon={ShieldCheck} />
                            <FinanceTask label="Pending Invoices" icon={FileText} />
                            <FinanceTask label="Payment History" icon={History} />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

function BillingStat({ label, value, detail, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
                    <p className="text-[9px] font-bold text-olive-600 uppercase tracking-tight">{detail}</p>
                </div>
            </div>
            <div className={`p-4 ${bg} ${color} rounded-2xl`}>
                <Icon size={20} />
            </div>
        </div>
    );
}

function FinanceTask({ label, icon: Icon }: any) {
    return (
        <button className="w-full flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all group">
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400 group-hover:text-olive-600" />
                <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{label}</span>
            </div>
            <ChevronRight size={14} className="text-slate-300" />
        </button>
    );
}

const ClockIcon = ({ size, className }: { size: number, className: string }) => (
    <History size={size} className={className} />
);
