"use client";

import { Beaker, Package, AlertCircle, ShoppingCart, Truck, Activity, Search, Pill, CheckCircle, Clock } from "lucide-react";

export default function PharmacyDashboard() {
    return (
        <div className="flex flex-col h-screen bg-olive-50 font-sans">
            {/* Pharmacy Header */}
            <header className="bg-white border-b border-olive-200 h-16 flex items-center justify-between px-8 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-olive-700 p-2 rounded-lg">
                        <Beaker className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold text-olive-900 font-serif">Central Pharmacy Management</h1>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-400" />
                        <input
                            type="text"
                            placeholder="Search drugs/inventory..."
                            className="pl-10 pr-4 py-2 bg-olive-50 border border-olive-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-olive-500 w-64"
                        />
                    </div>
                    <button className="bg-olive-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-olive-900 shadow-md flex items-center gap-2">
                        <ShoppingCart size={16} /> New Stock Order
                    </button>
                </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto space-y-8">
                {/* Status Row */}
                <div className="grid grid-cols-4 gap-6">
                    <PharmacyStat title="Pending Prescriptions" value="42" color="text-olive-400" bg="bg-olive-50/50" icon={<Activity size={20} />} />
                    <PharmacyStat title="Out of Stock Items" value="12" color="text-red-600" bg="bg-red-50" icon={<AlertCircle size={20} />} />
                    <PharmacyStat title="Items to Expire (30d)" value="08" color="text-orange-600" bg="bg-orange-50" icon={<Clock size={20} />} />
                    <PharmacyStat title="Procurements In-Route" value="03" color="text-olive-500" bg="bg-olive-50" icon={<Truck size={20} />} />
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* Dispensing Queue */}
                    <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-olive-200 overflow-hidden">
                        <div className="p-6 border-b border-olive-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-olive-900 flex items-center gap-2">
                                <Pill className="text-olive-600" size={20} /> Dispensing Queue
                            </h2>
                            <div className="flex gap-2">
                                <span className="text-xs bg-olive-100 text-olive-700 font-bold px-3 py-1 rounded-full uppercase">Priority: STAT (4)</span>
                            </div>
                        </div>
                        <div className="p-0">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-olive-50/50 text-olive-500 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="px-6 py-4">Patient / Ward</th>
                                        <th className="px-6 py-4">Medication</th>
                                        <th className="px-6 py-4">Dosage</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive-100">
                                    {[
                                        { patient: "John Doe", ward: "ICU-204", med: "Heparin", dose: "5000 units", status: "STAT" },
                                        { patient: "Jane Smith", ward: "PED-102", med: "Amoxicillin", dose: "250mg Susp", status: "Routine" },
                                        { patient: "Bob Marley", ward: "OPD-Desk 4", med: "Metformin", dose: "500mg Tab", status: "Routine" },
                                        { patient: "Alice Cooper", ward: "EMR-Bed 3", med: "Epinephrine", dose: "0.3mg Auto", status: "STAT" },
                                        { patient: "Charlie Brown", ward: "GEN-305", med: "Lisinopril", dose: "10mg Tab", status: "Routine" },
                                    ].map((item, idx) => (
                                        <tr key={idx} className="hover:bg-olive-50/20 group transition-all">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-olive-900">{item.patient}</div>
                                                <div className="text-[10px] text-olive-500 font-medium uppercase tracking-tighter">{item.ward}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-olive-800">{item.med}</td>
                                            <td className="px-6 py-4 text-sm text-olive-600">{item.dose}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.status === 'STAT' ? 'bg-red-50 text-red-700 border-red-100 pulse' : 'bg-olive-50 text-olive-700 border-olive-100'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-white bg-olive-600 hover:bg-olive-700 px-3 py-1 rounded text-xs font-bold transition-all shadow-sm">
                                                    Dispense
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Inventory Alerts Sidebar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-olive-200 p-6 flex-1">
                            <h2 className="text-lg font-bold text-olive-900 mb-6 flex items-center gap-2">
                                <Package className="text-olive-600" size={20} /> Low Stock Alerts
                            </h2>
                            <div className="space-y-4">
                                <InventoryAlert item="Insulin Glargine" stock="4 units" reorder="20 units" level="critical" />
                                <InventoryAlert item="Paracetamol 500mg" stock="120 tabs" reorder="500 tabs" level="warning" />
                                <InventoryAlert item="Surgical Gloves (M)" stock="15 boxes" reorder="50 boxes" level="warning" />
                                <InventoryAlert item="Normal Saline 1L" stock="5 bags" reorder="100 bags" level="critical" />
                            </div>
                            <button className="w-full mt-6 py-3 border border-olive-200 text-olive-700 rounded-xl text-sm font-bold hover:bg-olive-50 transition-colors">
                                Generate Reorder List
                            </button>
                        </div>

                        <div className="bg-olive-900 rounded-2xl p-6 text-white overflow-hidden relative">
                            <div className="relative z-10">
                                <h3 className="font-bold flex items-center gap-2 mb-2">
                                    <CheckCircle size={18} className="text-olive-400" />
                                    Compliance Check
                                </h3>
                                <p className="text-[11px] text-olive-300 leading-relaxed">
                                    All Narcotic logs have been signed for the previous shift. Next audit in 4h 20m.
                                </p>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                                <Beaker size={80} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-8 bg-olive-950 text-olive-400 px-6 flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                <div className="flex gap-4">
                    <span>Pharmacy Station A-01</span>
                    <span>Batch Scanning: Active</span>
                </div>
                <span>System Time: 00:35:12</span>
            </footer>

            <style jsx>{`
        .pulse {
          animation: pulse-animation 2s infinite;
        }
        @keyframes pulse-animation {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
}

function PharmacyStat({ title, value, color, bg, icon }: any) {
    return (
        <div className={`p-6 rounded-2xl shadow-sm border border-olive-200 bg-white hover:border-olive-400 transition-all cursor-default flex items-center justify-between`}>
            <div>
                <h3 className="text-xs font-bold text-olive-500 uppercase tracking-widest mb-1">{title}</h3>
                <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
            <div className={`p-4 ${bg} rounded-2xl ${color}`}>
                {icon}
            </div>
        </div>
    );
}

function InventoryAlert({ item, stock, reorder, level }: any) {
    return (
        <div className="flex items-start gap-3 p-3 hover:bg-olive-50 rounded-xl transition-colors">
            <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${level === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <div className="flex-1">
                <p className="text-sm font-bold text-olive-900">{item}</p>
                <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-olive-500 font-medium">Stock: <span className="text-olive-900">{stock}</span></span>
                    <span className="text-[10px] text-olive-400">Reorder: {reorder}</span>
                </div>
            </div>
        </div>
    );
}
