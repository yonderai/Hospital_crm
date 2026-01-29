"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Beaker,
    ClipboardCheck,
    AlertTriangle,
    Clock,
    Search,
    ChevronRight,
    Activity,
    FlaskConical,
    RefreshCw
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function NurseLaboratoryPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/lab/pending-orders");
            if (res.ok) {
                const data = await res.json();
                setOrders(data.map((o: any) => ({
                    id: o.orderId,
                    patient: `${o.patientId?.firstName} ${o.patientId?.lastName}`,
                    mrn: o.patientId?.mrn,
                    test: o.tests.join(", "),
                    room: `Ward ${Math.floor(Math.random() * 5) + 1}`, // Simulation
                    status: o.status,
                    priority: o.priority.toUpperCase()
                })));
            }
        } catch (error) {
            console.error("Nurse Lab Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const filteredOrders = orders.filter(o =>
        o.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.test.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">Specimen Logistics</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            NURSING LAB WORKFLOW • UNIT 7G • {nurseName}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <LabMetric label="Needs Collection" value={orders.filter(o => o.status === 'ordered').length} icon={FlaskConical} color="text-orange-600" bg="bg-orange-50" />
                    <LabMetric label="STAT Requisitions" value={orders.filter(o => o.priority === 'STAT').length} icon={AlertTriangle} color="text-red-500" bg="bg-red-50" />
                    <LabMetric label="In Processing" value={orders.filter(o => o.status === 'collected').length} icon={ClipboardCheck} color="text-teal-600" bg="bg-teal-50" />
                </div>

                <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 italic uppercase">Active Lab Requisitions</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Sample Tracking</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="relative group">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-500 transition-colors" />
                                <input
                                    className="bg-white border border-slate-200 pl-10 pr-6 py-3 rounded-2xl text-xs font-black uppercase outline-none focus:border-olive-500 transition-all w-64 shadow-sm"
                                    placeholder="Search Orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] border-b border-slate-50">
                                <th className="px-10 py-6">Patient / Clinical Node</th>
                                <th className="px-10 py-6">Requisition / Tests</th>
                                <th className="px-10 py-6">Priority</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right pr-16">Intelligence</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-slate-300 font-bold uppercase tracking-[0.2em] text-xs">
                                        <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
                                        Syncing Lab Stream...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-32 text-center text-slate-400 font-bold italic">
                                        No active lab requisitions found for Unit 7G.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((o, idx) => (
                                    <tr key={idx} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-10 py-8">
                                            <p className="text-sm font-black text-slate-900 uppercase italic group-hover:text-olive-700 transition-colors">{o.patient}</p>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{o.mrn}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xs font-black text-slate-700 uppercase italic">{o.test}</span>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">ID: {o.id}</p>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${o.priority === 'STAT' ? 'text-red-600 underline' :
                                                    o.priority === 'URGENT' ? 'text-orange-600' : 'text-slate-500'
                                                }`}>
                                                {o.priority}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border shadow-sm ${o.status === 'ordered' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    o.status === 'collected' ? 'bg-teal-50 text-teal-600 border-teal-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {o.status === 'ordered' ? 'Needs Collection' : o.status}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-right pr-12">
                                            <button className="px-6 py-3 bg-slate-900 text-teal-400 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95">
                                                Collect Sample
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}

function LabMetric({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
            </div>
            <div className={`p-4 ${bg} ${color} rounded-[20px] group-hover:scale-110 transition-transform shadow-sm`}>
                <Icon size={24} />
            </div>
        </div>
    );
}
