"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Wrench, Calendar } from "lucide-react";

export default function MaintenancePage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [assets, setAssets] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        assetId: "",
        maintenanceType: "preventive",
        description: "",
        technicianName: "",
        status: "scheduled",
        performedAt: new Date().toISOString().split('T')[0],
        nextScheduledDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        cost: 0
    });

    useEffect(() => {
        fetchLogs();
        fetchAssets();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch("/api/finance/maintenance");
            const data = await res.json();
            setLogs(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load maintenance logs");
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/finance/assets");
            if (res.ok) {
                const data = await res.json();
                setAssets(data);
                if (data.length > 0) {
                    setNewItem(prev => ({ ...prev, assetId: data[0]._id }));
                }
            }
        } catch (error) {
            console.error("Failed to load assets");
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/finance/maintenance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({
                    assetId: assets.length > 0 ? assets[0]._id : "",
                    maintenanceType: "preventive",
                    description: "",
                    technicianName: "",
                    status: "scheduled",
                    performedAt: new Date().toISOString().split('T')[0],
                    nextScheduledDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    cost: 0
                });
                fetchLogs();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 relative">
                {/* Modal Overlay */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white rounded-[32px] p-8 w-[600px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 h-[650px] overflow-y-auto">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">Log Maintenance</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Asset</label>
                                    <select
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                        value={newItem.assetId}
                                        onChange={(e) => setNewItem({ ...newItem, assetId: e.target.value })}
                                    >
                                        {assets.map(asset => (
                                            <option key={asset._id} value={asset._id}>{asset.name} ({asset.assetTag})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Type</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.maintenanceType}
                                            onChange={(e) => setNewItem({ ...newItem, maintenanceType: e.target.value })}
                                        >
                                            <option value="preventive">Preventive</option>
                                            <option value="corrective">Corrective</option>
                                            <option value="calibration">Calibration</option>
                                            <option value="inspection">Inspection</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.status}
                                            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Description</label>
                                    <textarea
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all resize-none"
                                        placeholder="Details about the maintenance..."
                                        value={newItem.description}
                                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Technician</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.technicianName}
                                            onChange={(e) => setNewItem({ ...newItem, technicianName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cost ($)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.cost}
                                            onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Performed / Start Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.performedAt}
                                            onChange={(e) => setNewItem({ ...newItem, performedAt: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Next Due Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.nextScheduledDate}
                                            onChange={(e) => setNewItem({ ...newItem, nextScheduledDate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-4 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                                    >
                                        Log Maintenance
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Maintenance & AMC</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Equipment & Facility Upkeep</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                    >
                        <Plus size={16} /> Log Maintenance
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Maintenance Schedule</h3>
                        <div className="flex gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl">
                                <Search size={16} className="text-slate-400" />
                                <input type="text" placeholder="Search..." className="bg-transparent text-sm font-bold outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Technician</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Due</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">Loading logs...</td></tr>
                                ) : logs.length === 0 ? (
                                    <tr><td colSpan={6} className="px-8 py-8 text-center font-bold text-slate-500">No maintenance records found.</td></tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-black text-slate-900">{log.assetId?.name || "Unknown Asset"}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.assetId?.assetTag}</p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {log.maintenanceType}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600 max-w-xs truncate">{log.description}</td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-900">{log.technicianName}</td>
                                            <td className="px-8 py-4 text-sm font-black text-slate-700">
                                                {log.nextScheduledDate ? new Date(log.nextScheduledDate).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${log.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        log.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {log.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
