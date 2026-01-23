"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    DollarSign,
    FileText,
    CreditCard,
    TrendingUp,
    Plus,
    Activity,
    ShieldCheck,
    BarChart,
    AlertTriangle,
    X,
    Save,
    Search
} from "lucide-react";

export default function BillingDashboard() {
    const [stats] = useState([
        { title: "Today's Collections", value: "$12,450", icon: DollarSign, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Pending Claims", value: "84", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Outstanding Invoices", value: "32", icon: FileText, color: "text-orange-500", bg: "bg-orange-50" },
        { title: "Revenue Growth", value: "+12.5%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    ]);

    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);

    useEffect(() => {
        fetchInvoices();
        fetchPatients();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch("/api/invoices");
            const data = await res.json();
            if (data.invoices) setInvoices(data.invoices);
            setLoading(false);
        } catch (e) { console.error(e); }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch("/api/patients");
            const data = await res.json();
            if (data.patients) setPatients(data.patients);
        } catch (e) { console.error(e); }
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Operations</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">BILLING MGR. WARREN BUFFETT • REVENUE CYCLE</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Invoice
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Transactions</h3>
                            <div className="flex gap-2">
                                <button className="text-[10px] font-black text-olive-600 uppercase tracking-[0.2em] hover:text-olive-700">Export CSV</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-4">Invoice / Patient</th>
                                        <th className="px-8 py-4">Total Amount</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4">Due Date</th>
                                        <th className="px-8 py-4 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan={5} className="px-8 py-8 text-center text-slate-400">Loading invoices...</td></tr>
                                    ) : invoices.length === 0 ? (
                                        <tr><td colSpan={5} className="px-8 py-8 text-center text-slate-400">No invoices found.</td></tr>
                                    ) : invoices.map((inv, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group/row">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                                        {inv.invoiceNumber?.split('-')[1] || '---'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900">{inv.patientId?.firstName} {inv.patientId?.lastName}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Ref: {inv.invoiceNumber}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-black text-slate-900 font-mono">${inv.totalAmount?.toLocaleString()}</td>
                                            <td className="px-8 py-5">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase border ${inv.status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' :
                                                        inv.status === 'sent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-red-50 text-red-600 border-red-100'
                                                    }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-slate-500 font-medium">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                            <td className="px-8 py-5 text-right pr-8">
                                                <button className="p-2 text-slate-400 hover:text-olive-700 bg-slate-50 rounded-lg border border-slate-200 transition-all">
                                                    <CreditCard size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            {/* ... Insurance Portal Section ... */}
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Insurance Portal</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <ShieldCheck className="text-olive-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">12 Claims Submitted</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-black">Awaiting Response</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <AlertTriangle className="text-red-400" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-red-100">2 Denied Claims</p>
                                            <p className="text-[10px] text-red-300 mt-0.5 uppercase tracking-widest font-black underline">Requires Appeal</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Financial Tools</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <BarChart size={20} className="text-olive-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Reports</span>
                                </button>
                                <button className="flex flex-col items-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-olive-400 transition-all">
                                    <TrendingUp size={20} className="text-olive-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Ledger</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900">Create New Invoice</h3>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <InvoiceForm patients={patients} close={() => setShowModal(false)} refresh={fetchInvoices} />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function InvoiceForm({ patients, close, refresh }: any) {
    const [formData, setFormData] = useState({
        patientId: "",
        itemDescription: "Consultation Charge",
        amount: 150,
        dueDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch("/api/invoices", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: formData.patientId,
                    items: [{
                        description: formData.itemDescription,
                        quantity: 1,
                        unitPrice: formData.amount,
                        total: formData.amount
                    }],
                    dueDate: new Date(formData.dueDate)
                })
            });
            refresh();
            close();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Bill To Patient</label>
                <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold text-slate-700"
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                    value={formData.patientId}
                >
                    <option value="">-- Select Patient --</option>
                    {patients.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (MRN: {p.mrn})</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Service Description</label>
                <input
                    required
                    value={formData.itemDescription}
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                    onChange={e => setFormData({ ...formData, itemDescription: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Amount ($)</label>
                    <input
                        type="number"
                        required
                        value={formData.amount}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, amount: Number(e.target.value) })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Due Date</label>
                    <input
                        type="date"
                        required
                        value={formData.dueDate}
                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 transition-all flex items-center justify-center gap-2">
                {loading ? "Processing..." : <><DollarSign size={16} /> Generate Invoice</>}
            </button>
        </form>
    );
}
