"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Plus,
    Trash2,
    Save,
    ArrowLeft,
    Calculator,
    Package
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InventoryItem {
    _id: string;
    name: string;
    sku: string;
    unitCost: number;
}

interface POItem {
    itemId: string;
    itemName: string; // for display
    quantity: number;
    unitCost: number;
    total: number;
}

export default function CreatePOPage() {
    const router = useRouter();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);

    // Form State
    const [supplierId, setSupplierId] = useState(""); // For MVP, we might mock or text input if no supplier API
    const [expectedDate, setExpectedDate] = useState("");
    const [notes, setNotes] = useState("");

    // Items State
    const [items, setItems] = useState<POItem[]>([]);

    // Totals
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.10; // 10% assumption for demo
    const tax = subtotal * taxRate;
    const totalAmount = subtotal + tax;

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch inventory for dropdown
        fetch("/api/pharmacy/inventory")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setInventory(data);
            });
    }, []);

    const addItem = () => {
        setItems([...items, { itemId: "", itemName: "", quantity: 1, unitCost: 0, total: 0 }]);
    };

    const removeItem = (idx: number) => {
        const newItems = [...items];
        newItems.splice(idx, 1);
        setItems(newItems);
    };

    const updateItem = (idx: number, field: keyof POItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[idx] };

        if (field === "itemId") {
            const selectedInv = inventory.find(i => i._id === value);
            if (selectedInv) {
                item.itemId = selectedInv._id;
                item.itemName = selectedInv.name;
                item.unitCost = selectedInv.unitCost;
                item.total = item.quantity * selectedInv.unitCost;
            }
        } else if (field === "quantity" || field === "unitCost") {
            // @ts-ignore
            item[field] = Number(value);
            item.total = item.quantity * item.unitCost;
        }

        newItems[idx] = item;
        setItems(newItems);
    };

    const handleSubmit = async () => {
        if (items.length === 0) return alert("Add at least one item.");
        setLoading(true);

        try {
            const res = await fetch("/api/pharmacy/procurement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    supplierId: null, // Let backend pick Generic for MVP
                    expectedDeliveryDate: expectedDate,
                    notes,
                    items: items.filter(i => i.itemId), // Only valid items
                    tax
                })
            });

            if (res.ok) {
                router.push("/pharmacy/procurement");
            } else {
                alert("Failed to create PO");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating PO");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/pharmacy/procurement" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Purchase Order</h1>
                        <p className="text-slate-500 mt-1 font-medium">Request, approve, and track new stock.</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {/* LEFT: FORM */}
                    <div className="col-span-2 space-y-6">
                        {/* 1. Details */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <Package size={18} className="text-blue-500" />
                                Order Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Supplier</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500"
                                        value={supplierId}
                                        onChange={(e) => setSupplierId(e.target.value)}
                                        disabled // Mocked for MVP
                                    >
                                        <option value="">Generic Supplier (Auto)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Expected Delivery</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500"
                                        value={expectedDate}
                                        onChange={(e) => setExpectedDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Notes</label>
                                <textarea
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 outline-none focus:border-blue-500 h-20 resize-none"
                                    placeholder="Optional remarks..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>
                        </div>

                        {/* 2. Items */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Calculator size={18} className="text-emerald-500" />
                                    Items & Costs
                                </h3>
                                <button onClick={addItem} className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 flex items-center gap-1 transition-all">
                                    <Plus size={14} /> Add Item
                                </button>
                            </div>

                            <div className="space-y-3">
                                {items.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 text-sm">
                                        No items added. Click "Add Item" to start.
                                    </div>
                                )}
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                                        <div className="flex-1">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Medicine</label>
                                            <select
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none"
                                                value={item.itemId}
                                                onChange={(e) => updateItem(idx, "itemId", e.target.value)}
                                            >
                                                <option value="">Select Medicine...</option>
                                                {inventory.map(inv => (
                                                    <option key={inv._id} value={inv._id}>{inv.name} ({inv.sku})</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Qty</label>
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none text-center"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cost</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 outline-none text-right"
                                                value={item.unitCost}
                                                onChange={(e) => updateItem(idx, "unitCost", e.target.value)}
                                            />
                                        </div>
                                        <div className="w-24 text-right pt-6">
                                            <p className="font-mono font-bold text-slate-700">${item.total.toFixed(2)}</p>
                                        </div>
                                        <button onClick={() => removeItem(idx)} className="p-2 mt-4 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: SUMMARY */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-900/20 sticky top-6">
                            <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="font-medium font-mono">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tax (10%)</span>
                                    <span className="font-medium font-mono">${tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                                    <span className="font-bold">Total Payable</span>
                                    <span className="text-3xl font-black tracking-tight">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating..." : <> <Save size={18} /> Confirm Order </>}
                            </button>
                            <p className="text-center text-xs text-slate-500 mt-4">
                                This will generate a formal PO and notify the supplier.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
