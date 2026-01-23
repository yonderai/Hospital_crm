"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { LayoutGrid, CheckCircle, Clock, Trash2, ArrowRightLeft, UserPlus, Info } from "lucide-react";

const BedDashboard = () => {
    const [wards, setWards] = useState([
        { id: "1", name: "General Ward A", floor: "1st Floor", wing: "North", type: "General" },
        { id: "2", name: "Intensive Care Unit", floor: "2nd Floor", wing: "West", type: "ICU" },
        { id: "3", name: "Surgical Ward", floor: "1st Floor", wing: "South", type: "Surgical" },
    ]);

    const [selectedWard, setSelectedWard] = useState(wards[0].id);

    // Mock data for beds
    const [beds, setBeds] = useState([
        { id: "101", number: "B-101", status: "occupied", patient: "Alice Winston", type: "Standard" },
        { id: "102", number: "B-102", status: "available", patient: null, type: "Standard" },
        { id: "103", number: "B-103", status: "cleaning", patient: null, type: "Standard" },
        { id: "104", number: "B-104", status: "occupied", patient: "Robert Miller", type: "Standard" },
        { id: "105", number: "V-101", status: "available", patient: null, type: "Ventilator" },
        { id: "106", number: "B-105", status: "maintenance", patient: null, type: "Standard" },
        { id: "107", number: "B-106", status: "available", patient: null, type: "Standard" },
        { id: "108", number: "B-107", status: "occupied", patient: "Grace Lee", type: "Standard" },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "available": return "bg-olive-50 text-olive-700 border-olive-200 stroke-olive-600";
            case "occupied": return "bg-olive-100 text-olive-900 border-olive-200 stroke-olive-800";
            case "cleaning": return "bg-amber-50 text-amber-700 border-amber-200 stroke-amber-600";
            case "maintenance": return "bg-red-50 text-red-700 border-red-200 stroke-red-600";
            default: return "bg-slate-50 text-slate-700 border-slate-200 stroke-slate-600";
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Facility Occupancy</h2>
                        <p className="text-slate-500 font-medium">Real-time bed management & ADT workflow</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {wards.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => setSelectedWard(w.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${selectedWard === w.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {w.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Legend & Stats */}
                <div className="flex gap-8 border-b border-slate-100 pb-6">
                    {[
                        { label: "Available", count: "4", color: "bg-olive-500" },
                        { label: "Occupied", count: "3", color: "bg-olive-800" },
                        { label: "Cleaning", count: "1", color: "bg-amber-500" },
                        { label: "Maintenance", count: "1", color: "bg-red-500" },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                            <span className="text-sm font-bold text-slate-500">{item.label}</span>
                            <span className="bg-slate-100 px-2 py-0.5 rounded-lg text-xs font-black text-slate-900">{item.count}</span>
                        </div>
                    ))}
                </div>

                {/* Bed Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {beds.map((bed) => (
                        <div
                            key={bed.id}
                            className={`p-6 rounded-3xl border-2 transition-all hover:scale-[1.02] cursor-pointer group ${getStatusColor(bed.status)}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase font-black tracking-widest opacity-60">{bed.type}</p>
                                    <h3 className="text-2xl font-black">{bed.number}</h3>
                                </div>
                                <div className="p-2 bg-white/50 rounded-xl">
                                    <LayoutGrid size={20} />
                                </div>
                            </div>

                            <div className="min-h-12 flex flex-col justify-center">
                                {bed.patient ? (
                                    <div className="space-y-1">
                                        <p className="text-[10px] uppercase font-bold opacity-60">Patient</p>
                                        <p className="font-bold text-sm">{bed.patient}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium opacity-60 capitalize">{bed.status}</p>
                                )}
                            </div>

                            {/* Actions Overlay (Hover) */}
                            <div className="mt-6 pt-4 border-t border-black/5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                {bed.status === 'available' && (
                                    <button className="flex-1 py-2 bg-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm">
                                        <UserPlus size={14} /> Adm
                                    </button>
                                )}
                                {bed.status === 'occupied' && (
                                    <>
                                        <button className="flex-1 py-2 bg-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm">
                                            <ArrowRightLeft size={14} /> Trn
                                        </button>
                                        <button className="flex-1 py-2 bg-white rounded-xl text-xs font-black flex items-center justify-center gap-1 shadow-sm">
                                            <Trash2 size={14} /> Disc
                                        </button>
                                    </>
                                )}
                                <button className="p-2 bg-white rounded-xl shadow-sm">
                                    <Info size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BedDashboard;
