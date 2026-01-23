"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Package,
    Search,
    Plus,
    AlertTriangle,
    CheckCircle2,
    Truck,
    Archive,
    History,
    ChevronRight,
    Activity,
    MousePointer2
} from "lucide-react";

export default function InventoryMainPage() {
    const [stock, setStock] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setStock([
                { id: "INV-001", name: "Surgical Gloves (Size 7.5)", category: "Consumables", qty: 1200, status: "Normal", min: 500 },
                { id: "INV-002", name: "Propofol 10mg/mL Vial", category: "Pharmacy", qty: 45, status: "Critical", min: 50 },
                { id: "INV-003", name: "N95 Respirators", category: "PPE", qty: 850, status: "Stable", min: 200 },
                { id: "INV-004", name: "IV Catheter 20G", category: "Medical Supplies", qty: 240, status: "Normal", min: 100 },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase font-serif">Supply Chain</h2>
                        <p className="text-slate-500 text-sm font-bold mt-1 uppercase tracking-[0.3em]">HOSPITAL INVENTORY & LOGISTICS</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Procurement Log
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> Add Item
                        </button>
                    </div>
                </div>

                {/* Logistics Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <InvKPI label="Total SKUs" value="1,248" icon={Package} />
                    <InvKPI label="Critical Stock" value="12" icon={AlertTriangle} color="text-red-500" bg="bg-red-50" />
                    <InvKPI label="Incoming Shipments" value="05" icon={Truck} color="text-teal-600" bg="bg-teal-50" />
                    <InvKPI label="Active Requisitions" value="28" icon={Archive} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Stock Table */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Stock Inventory</h3>
                            <div className="flex gap-4">
                                <div className="relative">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input className="bg-white border border-slate-200 px-8 py-2 rounded-xl text-[10px] font-bold outline-none w-48" placeholder="Search inventory..." />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                        <th className="px-8 py-6">Item / ID</th>
                                        <th className="px-8 py-6">Category</th>
                                        <th className="px-8 py-6">In Stock</th>
                                        <th className="px-8 py-6">Status</th>
                                        <th className="px-8 py-6 text-right pr-12">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        [...Array(4)].map((_, i) => <tr key={i}><td colSpan={5} className="h-20 animate-pulse bg-slate-50/30" /></tr>)
                                    ) : (
                                        stock.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/10 transition-all group">
                                                <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tight">
                                                    {item.name}
                                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{item.id}</p>
                                                </td>
                                                <td className="px-8 py-6 text-xs text-slate-500 font-bold uppercase">{item.category}</td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-black text-slate-900">{item.qty}</p>
                                                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Min: {item.min}</p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border ${item.status === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'}`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right pr-8">
                                                    <button className="p-2 text-slate-300 hover:text-olive-700 transition-all opacity-0 group-hover:opacity-100">
                                                        <ChevronRight size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Logistics Alerts & Tools */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[400px]">
                            <div className="relative z-10 space-y-8">
                                <h4 className="text-xl font-black tracking-tight leading-none uppercase italic border-l-2 border-teal-500 pl-4">Logistics Hub</h4>
                                <div className="space-y-6">
                                    <LogisticsRow title="Supplier Audit" desc="McKesson Corp (Scheduled)" />
                                    <LogisticsRow title="Cold Chain Check" desc="All sensors normal (4.2°C)" />
                                    <LogisticsRow title="Drug Reclamation" desc="12 expired vials pending" />
                                </div>
                                <button className="w-full py-4 bg-teal-500 text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-400 transition-all">
                                    Release PO Queue
                                </button>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5 pointer-events-none" size={240} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function InvKPI({ label, value, icon: Icon, color = "text-olive-600", bg = "bg-white" }: any) {
    return (
        <div className={`p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all ${bg}`}>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <Icon size={24} className={color} />
        </div>
    );
}

function LogisticsRow({ title, desc }: any) {
    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
            <p className="text-xs font-bold text-white">{title}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{desc}</p>
        </div>
    );
}
