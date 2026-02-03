"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Grid,
    Layers,
    Box,
    AlertCircle,
    ArrowRight,
    Search,
    ChevronRight,
    Database
} from "lucide-react";

interface StorageNode {
    _id: {
        zone: string;
        block: string;
    };
    itemCount: number;
    totalStock: number;
    lowStockItems: number;
}

export default function StoragePage() {
    const [distribution, setDistribution] = useState<StorageNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNode, setSelectedNode] = useState<StorageNode | null>(null);
    const [itemsInNode, setItemsInNode] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/pharmacy/inventory/distribution")
            .then(res => res.json())
            .then(data => {
                setDistribution(data);
                setLoading(false);
            });
    }, []);

    const fetchItemsInBlock = (zone: string, block: string) => {
        // Simple client-side filter for now, or could be a separate API
        fetch("/api/pharmacy/inventory")
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter((i: any) =>
                    i.location?.zone === zone && i.location?.block === block
                );
                setItemsInNode({ zone, block } as any); // just for header
                setItemsInNode(filtered);
            });
    };

    const zones = ["Tablet", "Syrup", "Injection", "Ointment", "Drops", "Surgical", "Others"];

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Grid className="text-olive-600" />
                        Storage & Location Map
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium underline decoration-olive-200 underline-offset-4">
                        Visualizing block-wise stock distribution across the pharmacy floor.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* Zones Sidebar */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <Layers size={14} /> Zones Map
                        </h3>
                        <div className="space-y-2">
                            {zones.map(zone => (
                                <button
                                    key={zone}
                                    className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                                >
                                    <span className="text-sm font-bold text-slate-700 group-hover:text-olive-700">{zone}</span>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-olive-500" />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-olive-900 p-6 rounded-[32px] text-white overflow-hidden relative">
                        <Database className="absolute bottom-[-10px] right-[-10px] text-olive-800 opacity-50 w-24 h-24" />
                        <h4 className="text-xs font-black text-olive-400 uppercase tracking-widest mb-2">Pharmacy Statistics</h4>
                        <div className="relative z-10">
                            <p className="text-3xl font-black">{distribution.reduce((acc, curr) => acc + curr.totalStock, 0)}</p>
                            <p className="text-[10px] font-bold text-olive-300 uppercase mt-1">Total Unit Stock Items</p>
                        </div>
                    </div>
                </div>

                {/* Block Map Grid */}
                <div className="col-span-12 lg:col-span-9 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {loading ? (
                            <div className="col-span-full h-64 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
                                Synchronizing Storage Matrix...
                            </div>
                        ) : distribution.length === 0 ? (
                            <div className="col-span-full h-64 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest bg-slate-50 rounded-[32px]">
                                No storage nodes defined.
                            </div>
                        ) : distribution.map(node => (
                            <div
                                key={`${node._id.zone}-${node._id.block}`}
                                onClick={() => {
                                    setSelectedNode(node);
                                    fetchItemsInBlock(node._id.zone, node._id.block);
                                }}
                                className={`group bg-white p-6 rounded-[32px] border transition-all cursor-pointer relative overflow-hidden ${selectedNode?._id.block === node._id.block ? 'border-olive-600 shadow-xl shadow-olive-600/10' : 'border-slate-100 hover:border-slate-300 hover:shadow-md'}`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{node._id.zone}</p>
                                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-olive-700 transition-colors">Block {node._id.block}</h3>
                                    </div>
                                    <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-olive-50 group-hover:text-olive-600 transition-all">
                                        <Box size={20} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Unique Medicines</p>
                                            <p className="text-lg font-bold text-slate-700">{node.itemCount}</p>
                                        </div>
                                        <div className="space-y-0.5 text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Available Stock</p>
                                            <p className="text-lg font-bold text-slate-700 font-mono">{node.totalStock}</p>
                                        </div>
                                    </div>

                                    {node.lowStockItems > 0 && (
                                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-xl">
                                            <AlertCircle size={14} />
                                            <span className="text-[10px] font-black uppercase tracking-tight">{node.lowStockItems} Items Low On Stock</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Node Details (Items in Block) */}
                    {selectedNode && (
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Stock in Block {selectedNode._id.block}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Zone: {selectedNode._id.zone} • Detailed Movement Log Activity
                                    </p>
                                </div>
                                <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                    View Detailed Ledger <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="p-4 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                            <th className="p-4">Medicine Name</th>
                                            <th className="p-4">SKU</th>
                                            <th className="p-4 text-center">Shelf</th>
                                            <th className="p-4 text-right">Stock</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {itemsInNode.map((item: any) => (
                                            <tr key={item._id} className="group hover:bg-slate-50/50 transition-all">
                                                <td className="p-4">
                                                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">{item.sku}</p>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest border border-slate-200">
                                                        Shelf {item.location?.shelf}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <p className={`text-sm font-black ${item.quantityOnHand <= item.reorderLevel ? 'text-orange-600' : 'text-slate-700'}`}>
                                                        {item.quantityOnHand} {item.unit}s
                                                    </p>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
