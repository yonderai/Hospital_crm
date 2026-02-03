"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Search,
    Plus,
    Filter,
    MoreHorizontal,
    Package,
    AlertTriangle,
    AlertCircle,
    X,
    CheckCircle
} from "lucide-react";

interface InventoryItem {
    _id: string;
    sku: string;
    name: string;
    category: string;
    description?: string;
    quantityOnHand: number;
    reorderLevel: number;
    unit: string;
    unitCost: number;
    sellingPrice: number;
    lotNumber: string;
    expiryDate: string;
    location?: {
        block: string;
        shelf: string;
        drawer?: string;
        zone: string;
    };
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        sku: "",
        name: "",
        category: "medication",
        unit: "",
        quantityOnHand: 0,
        reorderLevel: 10,
        unitCost: 0,
        sellingPrice: 0,
        lotNumber: "",
        expiryDate: "",
        location: {
            block: "",
            shelf: "",
            drawer: "",
            zone: "Tablet"
        }
    });

    const resetForm = () => {
        setFormData({
            _id: "",
            sku: "",
            name: "",
            category: "medication",
            unit: "",
            quantityOnHand: 0,
            reorderLevel: 10,
            unitCost: 0,
            sellingPrice: 0,
            lotNumber: "",
            expiryDate: "",
            location: {
                block: "",
                shelf: "",
                drawer: "",
                zone: "Tablet"
            }
        });
    };

    const fetchInventory = () => {
        setLoading(true);
        fetch("/api/pharmacy/inventory")
            .then(res => res.json())
            .then(data => {
                const inventoryData = Array.isArray(data) ? data : [];
                setItems(inventoryData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching inventory:', err);
                setItems([]);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const isEditing = !!formData._id;
            // Remove empty _id for new items to avoid Mongoose CastError
            const payload = { ...formData };
            if (!isEditing) delete (payload as any)._id;

            const res = await fetch("/api/pharmacy/inventory", {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchInventory();
            } else {
                const err = await res.json();
                alert(err.error || `Failed to ${isEditing ? 'update' : 'add'} item`);
            }
        } catch (error) {
            console.error(`Error saving item:`, error);
            alert("Error saving item");
        } finally {
            setSubmitting(false);
        }
    };

    const handleEditClick = (item: InventoryItem) => {
        setFormData({
            _id: item._id,
            sku: item.sku,
            name: item.name,
            category: item.category,
            unit: item.unit,
            quantityOnHand: item.quantityOnHand,
            reorderLevel: item.reorderLevel,
            unitCost: item.unitCost,
            sellingPrice: item.sellingPrice,
            lotNumber: item.lotNumber || "",
            expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
            location: {
                block: item.location?.block || "",
                shelf: item.location?.shelf || "",
                drawer: item.location?.drawer || "",
                zone: item.location?.zone || "Tablet"
            }
        });
        setShowModal(true);
    };

    const filteredItems = items.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Inventory Management</h1>
                    <p className="text-slate-500 mt-2 font-medium">Track stock levels, prices, and batches.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="px-6 py-3 bg-olive-600 text-white font-bold rounded-xl shadow-lg shadow-olive-600/20 hover:bg-olive-700 transition-all flex items-center gap-2"
                >
                    <Plus size={18} />
                    Add New Item
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl w-96">
                        <Search size={18} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by Name or SKU..."
                            className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-full placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-2">
                            <Filter size={14} /> Filter
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100/80">
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Item Details</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Stock Level</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Unit Cost</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Selling Price</th>
                                <th className="p-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">Loading inventory...</td></tr>
                            ) : filteredItems.length === 0 ? (
                                <tr><td colSpan={6} className="p-10 text-center text-slate-400">No items found.</td></tr>
                            ) : filteredItems.map(item => (
                                <tr key={item._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-xs">
                                                {item.sku.slice(0, 3)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">SKU: {item.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600 uppercase">
                                            {item.category}
                                        </span>
                                        {item.location?.block ? (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                <span className="text-[9px] font-black text-white bg-olive-600 px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                                                    <Package size={10} /> {item.location.zone}
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md uppercase tracking-wide">
                                                    Block {item.location.block} | Shelf {item.location.shelf}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mt-2">
                                                <span className="text-[9px] font-black text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wide flex items-center gap-1">
                                                    <AlertCircle size={10} /> Location Not Assigned
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-6 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            {item.quantityOnHand <= item.reorderLevel && (
                                                <AlertTriangle size={14} className="text-orange-500" />
                                            )}
                                            <span className={`text-sm font-bold ${item.quantityOnHand <= item.reorderLevel ? 'text-orange-600' : 'text-slate-700'}`}>
                                                {item.quantityOnHand} {item.unit}s
                                            </span>
                                        </div>
                                        {item.quantityOnHand <= item.reorderLevel && (
                                            <p className="text-[9px] text-orange-400 font-bold uppercase mt-1">Reorder Level: {item.reorderLevel}</p>
                                        )}
                                    </td>
                                    <td className="p-6 text-right font-mono text-sm text-slate-500">
                                        ₹{item.unitCost?.toFixed(2)}
                                    </td>
                                    <td className="p-6 text-right font-mono text-sm font-bold text-slate-900">
                                        ₹{item.sellingPrice?.toFixed(2)}
                                    </td>
                                    <td className="p-6 text-center">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="p-2 text-slate-400 hover:text-olive-600 hover:bg-olive-50 rounded-lg transition-all"
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    {formData._id ? "Edit Inventory Item" : "Add New Inventory Item"}
                                </h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Pharmacy Node Synchronization</p>
                            </div>
                            <button
                                onClick={() => { setShowModal(false); resetForm(); }}
                                className="w-10 h-10 flex items-center justify-center bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Amoxicillin 500mg"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Code *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. MED001"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 font-mono"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="medication">Medication</option>
                                        <option value="supply">Supply</option>
                                        <option value="equipment">Equipment</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Tablet, Bottle"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Stock</label>
                                    <input
                                        type="number"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.quantityOnHand}
                                        onChange={(e) => setFormData({ ...formData, quantityOnHand: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-50 relative">
                                <span className="absolute -top-2 left-4 bg-white px-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">Storage Location (Mandatory)</span>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Block *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. B1"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-olive-500 uppercase"
                                        value={formData.location.block}
                                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, block: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Shelf *</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. S2"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-olive-500 uppercase"
                                        value={formData.location.shelf}
                                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, shelf: e.target.value } })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zone *</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.location.zone}
                                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, zone: e.target.value } })}
                                    >
                                        <option value="Tablet">Tablet</option>
                                        <option value="Syrup">Syrup</option>
                                        <option value="Injection">Injection</option>
                                        <option value="Ointment">Ointment</option>
                                        <option value="Drops">Drops</option>
                                        <option value="Surgical">Surgical</option>
                                        <option value="Others">Others</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Drawer (Opt)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. D1"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-olive-500 uppercase"
                                        value={formData.location.drawer}
                                        onChange={(e) => setFormData({ ...formData, location: { ...formData.location, drawer: e.target.value } })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Cost (₹) *</label>
                                    <input
                                        required
                                        type="number"
                                        step="0.01"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 font-mono"
                                        value={formData.unitCost}
                                        onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Selling Price (₹)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 font-mono"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lot / Batch Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. LOT-12345"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 font-mono"
                                        value={formData.lotNumber}
                                        onChange={(e) => setFormData({ ...formData, lotNumber: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500"
                                        value={formData.expiryDate}
                                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-5 mt-4 bg-olive-700 text-white rounded-[24px] font-black text-sm uppercase tracking-[0.3em] shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                            >
                                {submitting ? "Synchronizing..." : formData._id ? <>Update Item <CheckCircle size={18} /></> : <>Register Item <CheckCircle size={18} /></>}
                            </button>
                        </form>
                    </div>
                </div >
            )
            }
        </DashboardLayout >
    );
}
