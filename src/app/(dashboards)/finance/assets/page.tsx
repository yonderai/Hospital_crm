"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, Wrench } from "lucide-react";

export default function AssetsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        assetTag: `AST-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        name: "",
        category: "imaging",
        manufacturer: "",
        modelNumber: "",
        serialNumber: "",
        status: "operational",
        location: {
            department: "General",
            roomNumber: ""
        },
        purchaseDate: new Date().toISOString().split('T')[0],
        warrantyExpiry: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const res = await fetch("/api/finance/assets");
            const data = await res.json();
            setAssets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load assets");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            const res = await fetch("/api/finance/assets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            });
            if (res.ok) {
                setShowModal(false);
                setNewItem({
                    assetTag: `AST-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
                    name: "",
                    category: "imaging",
                    manufacturer: "",
                    modelNumber: "",
                    serialNumber: "",
                    status: "operational",
                    location: {
                        department: "General",
                        roomNumber: ""
                    },
                    purchaseDate: new Date().toISOString().split('T')[0],
                    warrantyExpiry: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                });
                fetchAssets();
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
                        <div className="bg-white rounded-[32px] p-8 w-[800px] shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200 h-[700px] overflow-y-auto">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight italic mb-6 uppercase">Register New Asset</h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Asset Tag</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.assetTag}
                                            onChange={(e) => setNewItem({ ...newItem, assetTag: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Asset Name</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.name}
                                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Category</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.category}
                                            onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                                        >
                                            <option value="imaging">Imaging</option>
                                            <option value="monitoring">Monitoring</option>
                                            <option value="surgical">Surgical</option>
                                            <option value="laboratory">Laboratory</option>
                                            <option value="facility">Facility</option>
                                            <option value="furniture">Furniture</option>
                                            <option value="it-hardware">IT Hardware</option>
                                            <option value="generator">Generator</option>
                                            <option value="vehicle">Vehicle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                                        <select
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.status}
                                            onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                                        >
                                            <option value="operational">Operational</option>
                                            <option value="under-repair">Under Repair</option>
                                            <option value="decommissioned">Decommissioned</option>
                                            <option value="calibration-due">Calibration Due</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Department</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.location.department}
                                            onChange={(e) => setNewItem({ ...newItem, location: { ...newItem.location, department: e.target.value } })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Manufacturer</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.manufacturer}
                                            onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Model Number</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.modelNumber}
                                            onChange={(e) => setNewItem({ ...newItem, modelNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Serial Number</label>
                                        <input
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.serialNumber}
                                            onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Purchase Date</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.purchaseDate}
                                            onChange={(e) => setNewItem({ ...newItem, purchaseDate: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Warranty Expiry</label>
                                        <input
                                            type="date"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 outline-none focus:border-olive-500 transition-all"
                                            value={newItem.warrantyExpiry}
                                            onChange={(e) => setNewItem({ ...newItem, warrantyExpiry: e.target.value })}
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
                                        Register Asset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Asset Management</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Inventory & Maintenance</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#42542B] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all"
                    >
                        <Plus size={16} /> Register Asset
                    </button>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Registered Assets</h3>
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
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Tag / Name</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Department</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Service</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">Loading assets...</td></tr>
                                ) : assets.length === 0 ? (
                                    <tr><td colSpan={5} className="px-8 py-8 text-center font-bold text-slate-500">No assets found.</td></tr>
                                ) : (
                                    assets.map((asset) => (
                                        <tr key={asset._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-black text-slate-900">{asset.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{asset.assetTag}</p>
                                            </td>
                                            <td className="px-8 py-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                                    {asset.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">{asset.location?.department || 'N/A'}</td>
                                            <td className="px-8 py-4">
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${asset.status === 'operational' ? 'bg-green-100 text-green-700' :
                                                    asset.status === 'under-repair' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {asset.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-600">
                                                {asset.nextMaintenanceDate ? new Date(asset.nextMaintenanceDate).toLocaleDateString() : 'N/A'}
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
