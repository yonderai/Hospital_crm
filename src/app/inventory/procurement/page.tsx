"use client";

import { ShoppingCart, Truck, Package, Clipboard, Search, Plus, Filter, ArrowUpRight, CheckCircle, FileText, Globe } from "lucide-react";

export default function ProcurementPage() {
    return (
        <div className="flex flex-col h-screen bg-olive-50">
            {/* Procurement Header */}
            <header className="bg-white border-b border-olive-200 h-16 flex items-center justify-between px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-olive-900 p-2 rounded-lg">
                        <Truck className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-olive-900 font-serif">Supply Chain & Procurement</h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" />
                        <input
                            type="text"
                            placeholder="Search POs, Suppliers..."
                            className="pl-10 pr-4 py-2 bg-olive-50 border border-olive-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-olive-500 w-64"
                        />
                    </div>
                    <button className="bg-olive-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-olive-900 shadow-md flex items-center gap-2">
                        <Plus size={16} /> Create Purchase Order
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto space-y-8">
                {/* KPI Row */}
                <div className="grid grid-cols-4 gap-6">
                    <ProcurementStat title="Open POs" value="14" sub="7 Urgent" icon={<FileText className="text-olive-600" />} />
                    <ProcurementStat title="Total Spend (MTD)" value="$84,200" sub="+12% from last month" icon={<ShoppingCart className="text-blue-600" />} />
                    <ProcurementStat title="Pending Receipts" value="09" sub="3 expected today" icon={<Package className="text-orange-600" />} />
                    <ProcurementStat title="Active Suppliers" value="48" sub="3 new this quarter" icon={<Globe className="text-green-600" />} />
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Purchase Orders Table */}
                    <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-olive-200 overflow-hidden">
                        <div className="p-6 border-b border-olive-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-olive-900">Recent Purchase Orders</h2>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-olive-50 rounded-lg text-olive-400"><Filter size={18} /></button>
                                <button className="text-xs font-bold text-olive-600 uppercase border-b border-olive-600">Download Report</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-olive-50/50 text-olive-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="px-6 py-4">PO Number</th>
                                        <th className="px-6 py-4">Supplier</th>
                                        <th className="px-6 py-4">Total Amount</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Expected Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive-100">
                                    {[
                                        { id: "PO-2026-001", supplier: "Medline Industries", amount: "$12,400", status: "In Transit", date: "Jan 24, 2026" },
                                        { id: "PO-2026-002", supplier: "Pfizer Pharmaceuticals", amount: "$34,200", status: "Processing", date: "Jan 28, 2026" },
                                        { id: "PO-2026-003", supplier: "Global Med Supplies", amount: "$2,100", status: "Delivered", date: "Jan 20, 2026" },
                                        { id: "PO-2026-004", supplier: "Steris Corp", amount: "$8,900", status: "Draft", date: "Feb 02, 2026" },
                                        { id: "PO-2026-005", supplier: "Thermo Fisher", amount: "$1,450", status: "Approved", date: "Jan 26, 2026" },
                                    ].map((po) => (
                                        <tr key={po.id} className="hover:bg-olive-50/20 group">
                                            <td className="px-6 py-4 text-sm font-bold text-olive-900 underline decoration-olive-200 cursor-pointer hover:decoration-olive-600">{po.id}</td>
                                            <td className="px-6 py-4 text-sm text-olive-700">{po.supplier}</td>
                                            <td className="px-6 py-4 text-sm font-bold text-olive-900">{po.amount}</td>
                                            <td className="px-6 py-4">
                                                <POStatusBadge status={po.status} />
                                            </td>
                                            <td className="px-6 py-4 text-xs font-medium text-olive-500 italic">{po.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Supplier Catalog Quick View */}
                    <div className="bg-white rounded-2xl shadow-sm border border-olive-200 p-6 flex flex-col">
                        <h2 className="text-lg font-bold text-olive-900 mb-6 flex items-center gap-2">
                            <Clipboard className="text-olive-600" size={20} /> Top Suppliers
                        </h2>
                        <div className="space-y-6 flex-1">
                            <SupplierItem name="Medline Industries" score="98%" category="Consumables" />
                            <SupplierItem name="Pfizer" score="94%" category="Pharmaceuticals" />
                            <SupplierItem name="GE Healthcare" score="91%" category="Assets" />
                            <SupplierItem name="Cardinal Health" score="88%" category="Wholesale" />
                        </div>
                        <div className="mt-8 p-4 bg-olive-900 rounded-xl text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-olive-400 uppercase tracking-widest mb-1">Stock Optimization</p>
                                <h3 className="text-sm font-bold mb-2">Automated re-order enabled.</h3>
                                <p className="text-[10px] text-olive-200">12 items auto-added to draft POs based on current burn rate.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Inventory Flow Diagram Section */}
                <div className="bg-olive-100 rounded-3xl p-10 flex items-center justify-between">
                    <div className="space-y-4 max-w-sm">
                        <h2 className="text-2xl font-bold text-olive-950 font-serif">Strategic Inventory Insights</h2>
                        <p className="text-sm text-olive-700 leading-relaxed">Our predictive ordering system identifies potential stockouts before they happen, saving an average of 14% on emergency procurement costs.</p>
                        <button className="bg-white text-olive-900 px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center gap-2 group hover:gap-3 transition-all">
                            Generate Optimization Audit <ArrowUpRight size={16} />
                        </button>
                    </div>
                    <div className="flex gap-8 items-center">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Truck className="text-olive-600" />
                        </div>
                        <div className="w-8 h-[2px] bg-olive-300"></div>
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                            <Package className="text-olive-600" />
                        </div>
                        <div className="w-8 h-[2px] bg-olive-300"></div>
                        <div className="w-16 h-16 rounded-full bg-olive-900 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform cursor-pointer">
                            <CheckCircle className="text-white" size={32} />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-8 bg-olive-950 text-olive-500 px-6 flex items-center justify-between text-[10px] uppercase font-black tracking-tighter">
                <span>LOGISTICS NODE: SOUTHEAST REGIONAL HUB</span>
                <span>SECURE SUPPLY CHAIN (ISO 27001)</span>
            </footer>
        </div>
    );
}

function ProcurementStat({ title, value, sub, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-olive-200 flex items-center gap-4 group hover:border-olive-400 transition-all">
            <div className="p-4 bg-olive-50 rounded-xl group-hover:bg-olive-100 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="text-xs font-bold text-olive-500 uppercase tracking-widest">{title}</h3>
                <p className="text-2xl font-black text-olive-950">{value}</p>
                <p className="text-[10px] text-olive-400 font-medium italic">{sub}</p>
            </div>
        </div>
    );
}

function POStatusBadge({ status }: { status: string }) {
    const styles: any = {
        'In Transit': 'bg-blue-50 text-blue-700 border-blue-100',
        'Processing': 'bg-yellow-50 text-yellow-700 border-yellow-100',
        'Delivered': 'bg-green-50 text-green-700 border-green-100',
        'Draft': 'bg-olive-50 text-olive-500 border-olive-100',
        'Approved': 'bg-purple-50 text-purple-700 border-purple-100',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status]}`}>
            {status}
        </span>
    );
}

function SupplierItem({ name, score, category }: any) {
    return (
        <div className="flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-olive-50 flex items-center justify-center text-olive-600 font-bold text-xs uppercase group-hover:bg-olive-100 transition-colors">
                    {name[0]}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-olive-900 group-hover:underline">{name}</h4>
                    <p className="text-[10px] text-olive-400 font-medium">{category}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-xs font-black text-olive-900">{score}</p>
                <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">Rating</p>
            </div>
        </div>
    );
}
