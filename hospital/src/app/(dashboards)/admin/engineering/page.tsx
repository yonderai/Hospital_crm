"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Wrench,
    Zap,
    Wind,
    Activity,
    AlertTriangle,
    ShieldCheck,
    Clock,
    Settings,
    HardHat,
    Droplets
} from "lucide-react";

export default function EngineeringPage() {
    const [systems, setSystems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setSystems([
                { name: "Main HVAC Chillers", status: "Operational", efficiency: "94%", health: "Good", id: "HVAC-01" },
                { name: "Emergency Bio-Power", status: "Standby", efficiency: "100%", health: "Optimal", id: "PWR-BKP" },
                { name: "Medical Gas Node 4", status: "Warning", efficiency: "82%", health: "Service Due", id: "GAS-04" },
                { name: "Water Filtration", status: "Operational", efficiency: "98%", health: "Good", id: "H2O-SYS" },
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Facilities & Infrastructure</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">CENTRAL ENGINEERING • CAMPUS A</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all">
                            Maintenance Logs
                        </button>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-olive-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Wrench size={16} /> Schedule Service
                        </button>
                    </div>
                </div>

                {/* Critical Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatusWidget label="Grid Power" value="Active" icon={Zap} color="text-yellow-500" bg="bg-yellow-50" />
                    <StatusWidget label="Bio-Hazard HVAC" value="Nominal" icon={Wind} color="text-blue-500" bg="bg-blue-50" />
                    <StatusWidget label="Medical O2 Level" value="98.2%" icon={Droplets} color="text-teal-500" bg="bg-teal-50" />
                    <StatusWidget label="Security Nodes" value="Secure" icon={ShieldCheck} color="text-olive-600" bg="bg-olive-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* System Monitoring */}
                    <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Active System Nodes</h3>
                            <div className="flex gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Telemetry</span>
                            </div>
                        </div>
                        <div className="p-8 space-y-6">
                            {loading ? (
                                [...Array(4)].map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-3xl animate-pulse" />)
                            ) : (
                                systems.map((sys, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:bg-white hover:border-olive-200 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                                                <Activity size={20} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{sys.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sys.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-10 text-right">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Efficiency</p>
                                                <p className="text-sm font-black text-slate-900">{sys.efficiency}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase border ${sys.status === 'Operational' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'}`}>
                                                    {sys.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Maintenance Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#0F172A] rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Maintenance Alerts</h4>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <AlertTriangle className="text-orange-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold">Hephaestus-04 Boiler</p>
                                            <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">Requires Descaling</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <Settings className="text-red-400 shrink-0" size={20} />
                                        <div>
                                            <p className="text-sm font-bold text-red-100">Bio-Vent Filter Expired</p>
                                            <p className="text-[10px] text-red-300 mt-1 uppercase tracking-widest font-black underline">Isolation Ward 2</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-1">Engineering Resources</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <ResourceLink icon={HardHat} label="Safety Pcl" />
                                <ResourceLink icon={Clock} label="Shift Roster" />
                                <ResourceLink icon={Wrench} label="Tools Lib" />
                                <ResourceLink icon={Activity} label="Schema V2" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function StatusWidget({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:border-olive-400 transition-all">
            <div className={`p-4 ${bg} ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
            </div>
        </div>
    );
}

function ResourceLink({ icon: Icon, label }: any) {
    return (
        <button className="flex flex-col items-center gap-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-300 transition-all font-sans">
            <Icon size={18} className="text-slate-400" />
            <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">{label}</span>
        </button>
    );
}
