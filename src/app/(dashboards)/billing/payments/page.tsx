"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    IndianRupee,
    Activity,
    Search,
    Filter,
    ArrowUpRight,
    CreditCard,
    Banknote,
    Wallet
} from "lucide-react";
import { useState, useEffect } from "react";

import { AppointmentReceipt } from "@/components/AppointmentReceipt";
import { X, Printer } from "lucide-react";

export default function BillingPaymentsPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterMethod, setFilterMethod] = useState<"all" | "cash" | "digital">("all");
    const [activeStat, setActiveStat] = useState<string>("total");

    // Receipt Logic
    const [showReceipt, setShowReceipt] = useState(false);
    const [selectedReceiptData, setSelectedReceiptData] = useState<any>(null);

    const handleViewReceipt = (item: any) => {
        // Map item data to receipt format
        const receiptData = {
            appointmentId: item.id,
            patientName: item.name,
            patientPhone: "N/A", // API might not return this, using placeholder or derived
            doctorName: "Dr. Assigned", // Placeholder if not in listing
            department: "General",
            date: item.date,
            time: "10:00 AM", // Placeholder
            paymentMethod: item._raw?.method || "Unknown",
            amount: item.value,
            status: "Success"
        };
        setSelectedReceiptData(receiptData);
        setShowReceipt(true);
    };

    // Fetch Data
    useEffect(() => {
        setLoading(true);
        fetch("/api/billing/payments")
            .then(res => res.json())
            .then(json => {
                if (json.data) setData(json.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch payments", err);
                setLoading(false);
            });
    }, []);

    // Derived Stats
    const totalCollected = data.reduce((acc, curr) => {
        // Parse value like "₹1,200" -> 1200
        const val = parseFloat(curr.value.replace(/[^0-9.-]+/g, ""));
        return acc + (isNaN(val) ? 0 : val);
    }, 0);

    const stats = [
        {
            id: "total",
            label: "Total Collected",
            value: `₹${totalCollected.toLocaleString()}`,
            change: "Live",
            icon: IndianRupee,
            color: activeStat === 'total' ? "text-white" : "text-emerald-600",
            bg: activeStat === 'total' ? "bg-emerald-600" : "bg-emerald-50",
            interactive: true,
            onClick: () => {
                setFilterMethod('all');
                setActiveStat('total');
            }
        },
        {
            id: "transactions",
            label: "Transactions",
            value: data.length.toString(),
            change: "Updated",
            icon: Activity,
            color: activeStat === 'transactions' ? "text-white" : "text-blue-600",
            bg: activeStat === 'transactions' ? "bg-blue-600" : "bg-blue-50",
            interactive: true,
            onClick: () => {
                setFilterMethod('all');
                setActiveStat('transactions');
            }
        },
        {
            id: "cash",
            label: "Cash Payments",
            value: "View List",
            change: "Filter",
            icon: Banknote,
            color: activeStat === 'cash' ? "text-white" : "text-green-600",
            bg: activeStat === 'cash' ? "bg-green-600" : "bg-green-50",
            interactive: true,
            onClick: () => {
                setFilterMethod(prev => prev === 'cash' ? 'all' : 'cash');
                setActiveStat(prev => prev === 'cash' ? 'total' : 'cash'); // Toggle back to total if clicked again
            }
        },
        {
            id: "digital",
            label: "Card / UPI",
            value: "View List",
            change: "Filter",
            icon: CreditCard,
            color: activeStat === 'digital' ? "text-white" : "text-purple-600",
            bg: activeStat === 'digital' ? "bg-purple-600" : "bg-purple-50",
            interactive: true,
            onClick: () => {
                setFilterMethod(prev => prev === 'digital' ? 'all' : 'digital');
                setActiveStat(prev => prev === 'digital' ? 'total' : 'digital'); // Toggle back to total if clicked again
            }
        }
    ];

    // Filter Logic
    const displayData = data.filter(item => {
        // Search
        const search = searchTerm.toLowerCase();
        const matchesSearch = !search || (
            item.name.toLowerCase().includes(search) ||
            item.id.toLowerCase().includes(search) ||
            item.value.toLowerCase().includes(search)
        );

        // Payment Method Filter
        let matchesMethod = true;
        if (filterMethod !== 'all') {
            const method = item._raw?.method;
            if (filterMethod === 'cash') {
                matchesMethod = method === 'cash';
            } else {
                matchesMethod = method !== 'cash'; // Assumes !cash is digital
            }
        }

        return matchesSearch && matchesMethod;
    });

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">PAYMENTS</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">BILLING PORTAL</p>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {loading ? [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm animate-pulse h-24"></div>
                    )) : stats.map((s, i) => {
                        const IconComponent = s.icon;
                        const isActive = s.id === activeStat;

                        return (
                            <div
                                key={i}
                                onClick={s.interactive ? s.onClick : undefined}
                                className={`
                                    bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between
                                    group transition-all relative overflow-hidden
                                    ${s.interactive ? 'cursor-pointer hover:border-olive-400 hover:shadow-md' : 'cursor-default'}
                                    ${isActive ? 'ring-2 ring-olive-500 border-olive-500' : ''}
                                `}
                            >
                                <div className="relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className={`text-xl font-black tracking-tighter ${isActive ? 'text-black' : 'text-slate-900'}`}>{s.value}</p>
                                    <div className="mt-2 flex items-center gap-1">
                                        <span className={`text-[10px] font-bold ${s.change === 'Filter' ? 'text-slate-500' : (s.change?.startsWith('+') ? 'text-olive-600' : 'text-emerald-600')}`}>
                                            {s.change}
                                        </span>
                                        {s.change !== 'Filter' && <ArrowUpRight size={10} className="text-emerald-600" />}
                                    </div>
                                </div>
                                <div className={`p-4 ${s.bg} ${s.color} rounded-2xl relative z-10 transition-colors`}>
                                    <IconComponent size={24} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Main Content Area */}
                <div className="w-full bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Transaction History</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {filterMethod === 'all' ? 'All Transactions' : filterMethod === 'cash' ? 'Cash Only' : 'Card & UPI Only'}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search transactions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/10 w-64 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        {loading ? (
                            <div className="p-8 space-y-4">
                                {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-6">ID / Ref</th>
                                        <th className="px-8 py-6">Payer Name</th>
                                        <th className="px-8 py-6">Method</th>
                                        <th className="px-8 py-6">Date</th>
                                        <th className="px-8 py-6 text-right pr-12">Amount</th>
                                        <th className="px-8 py-6 text-right pr-8">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayData.length > 0 ? displayData.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-sm font-black text-slate-900">{item.id}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item._raw?.method === 'cash'
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-purple-50 text-purple-600 border-purple-100'
                                                    }`}>
                                                    {item._raw?.method || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-slate-500">{item.date}</td>
                                            <td className="px-8 py-6 text-right pr-12">
                                                <span className="text-sm font-black text-slate-900">{item.value}</span>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-8">
                                                <button
                                                    onClick={() => handleViewReceipt(item)}
                                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    Receipt
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-bold text-sm">
                                                No transactions found using this filter.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            {/* Receipt Modal */}
            {showReceipt && selectedReceiptData && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto print:p-0 print:bg-white print:static">
                    <div className="bg-white rounded-[32px] w-full max-w-2xl relative shadow-2xl print:shadow-none print:w-full print:max-w-none print:p-0">
                        {/* Close Button - Hidden in Print */}
                        <button
                            onClick={() => setShowReceipt(false)}
                            className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-all print:hidden"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-2 print:p-0">
                            <AppointmentReceipt data={selectedReceiptData} />
                        </div>

                        {/* Actions - Hidden in Print */}
                        <div className="p-6 border-t border-slate-100 flex justify-end gap-4 print:hidden">
                            <button
                                onClick={() => setShowReceipt(false)}
                                className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="px-6 py-3 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200"
                            >
                                <Printer size={18} />
                                Print Receipt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
