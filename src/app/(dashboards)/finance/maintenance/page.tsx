"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Wrench, Calendar } from "lucide-react";

export default function MaintenancePage() {
    const [activeTab, setActiveTab] = useState("schedule");
    const [tickets, setTickets] = useState<any[]>([]);

    // Original State
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
        fetchTickets();
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

    const fetchTickets = async () => {
        try {
            const res = await fetch("/api/maintenance/tickets");
            const data = await res.json();
            if (Array.isArray(data)) setTickets(data);
        } catch (error) {
            console.error("Failed to load tickets");
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

    const handleApproval = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/maintenance/actions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus })
            });
            if (res.ok) fetchTickets();
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
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Cost (₹)</label>
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
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Maintenance & Approvals</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Facility Upkeep & Requests</p>
                    </div>
                    {activeTab === 'schedule' && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                        >
                            <Plus size={16} /> Log Maintenance
                        </button>
                    )}
                </div>

                {/* Tabs */}
                {/* Fixed Tab Layout - ensured consistent styling */}
                <div className="flex gap-8 border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('schedule')}
                        className={`pb-4 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${activeTab === 'schedule' ? 'text-olive-700' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Scheduled Maintenance
                        {activeTab === 'schedule' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-olive-600 rounded-t-full"></div>}
                    </button>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setActiveTab('requests')}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.1em] transition-all relative ${activeTab === 'requests' ? 'text-olive-700' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Staff Requests
                            {activeTab === 'requests' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-olive-600 rounded-t-full"></div>}
                        </button>
                        {tickets.filter(t => t.status === 'Open').length > 0 && (
                            <div className="mb-4 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-sm animate-pulse">
                                {tickets.filter(t => t.status === 'Open').length} NEW
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                    {activeTab === 'schedule' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Technician</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Due</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {loading ? (
                                        <tr><td colSpan={6} className="px-8 py-12 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Loading system logs...</td></tr>
                                    ) : logs.length === 0 ? (
                                        <tr><td colSpan={6} className="px-8 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No maintenance records found</td></tr>
                                    ) : (
                                        logs.map((log) => (
                                            <tr key={log._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-slate-900 group-hover:text-olive-800 transition-colors">{log.assetId?.name || "Unknown Asset"}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{log.assetId?.assetTag}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                                        {log.maintenanceType}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-600 max-w-xs truncate">{log.description}</td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-900">{log.technicianName}</td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-600 font-mono">
                                                    {log.nextScheduledDate ? new Date(log.nextScheduledDate).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${log.status === 'completed' ? 'bg-green-500' :
                                                            log.status === 'scheduled' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                                        <span className={`text-[10px] font-black uppercase tracking-wider ${log.status === 'completed' ? 'text-green-700' :
                                                            log.status === 'scheduled' ? 'text-blue-700' : 'text-orange-700'}`}>
                                                            {log.status}
                                                        </span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Request Details</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Priority</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Cost</th>
                                        <th className="px-8 py-5 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {tickets.length === 0 ? (
                                        <tr><td colSpan={6} className="px-8 py-12 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">No staff requests found</td></tr>
                                    ) : (
                                        tickets.map((t) => (
                                            <tr key={t._id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-black text-slate-900 group-hover:text-olive-800 transition-colors">{t.title}</span>
                                                        <span className="text-xs text-slate-500 truncate max-w-[240px]">{t.description}</span>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                                                {t.requestedBy?.firstName?.[0] || 'U'}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-slate-400">
                                                                {t.requestedBy ? `${t.requestedBy.firstName} ${t.requestedBy.lastName}` : 'Unknown Staff'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-bold text-slate-600">{t.category}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider border ${t.priority === 'High' || t.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-200'
                                                        }`}>
                                                        {t.priority}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-xs font-black text-slate-900 font-mono">₹{t.estimatedCost?.toLocaleString() || 0}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${t.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                                        t.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {t.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    {(t.status === 'Open' || t.status === 'Pending Approval') ? (
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleApproval(t._id, 'Approved')}
                                                                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-olive-600 shadow-lg shadow-slate-200 hover:shadow-olive-600/20 transition-all active:scale-95"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleApproval(t._id, 'Rejected')}
                                                                className="px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95"
                                                            >
                                                                Deny
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                                            {t.status === 'Approved' ? 'Authorized' : 'Closed'}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
