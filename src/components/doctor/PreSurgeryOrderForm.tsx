"use client";

import { useState, useEffect } from "react";
import { X, ClipboardList, Plus, Trash2, User, Calendar, AlertCircle } from "lucide-react";

interface PreSurgeryOrderFormProps {
    caseId: string;
    patientId: string;
    patientName: string;
    procedureName: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface Order {
    orderType: string;
    instructions: string;
    priority: string;
    assignedTo?: string;
    scheduledFor?: string;
}

export default function PreSurgeryOrderForm({
    caseId,
    patientId,
    patientName,
    procedureName,
    onClose,
    onSuccess
}: PreSurgeryOrderFormProps) {
    const [loading, setLoading] = useState(false);
    const [nurses, setNurses] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([
        { orderType: 'vital_signs', instructions: '', priority: 'routine' }
    ]);

    useEffect(() => {
        // Fetch available nurses
        const fetchNurses = async () => {
            try {
                const res = await fetch('/api/staff?role=nurse');
                if (res.ok) {
                    const data = await res.json();
                    setNurses(data);
                }
            } catch (error) {
                console.error('Failed to fetch nurses:', error);
            }
        };
        fetchNurses();
    }, []);

    const addOrder = () => {
        setOrders([...orders, { orderType: 'vital_signs', instructions: '', priority: 'routine' }]);
    };

    const removeOrder = (index: number) => {
        if (orders.length > 1) {
            setOrders(orders.filter((_, i) => i !== index));
        }
    };

    const updateOrder = (index: number, field: keyof Order, value: string) => {
        const updatedOrders = [...orders];
        updatedOrders[index] = { ...updatedOrders[index], [field]: value };
        setOrders(updatedOrders);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/doctor/surgery/pre-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId,
                    patientId,
                    orders
                })
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Failed to create pre-surgery orders');
            }
        } catch (error) {
            console.error('Error creating orders:', error);
            alert('Error creating pre-surgery orders');
        } finally {
            setLoading(false);
        }
    };

    const orderTypeOptions = [
        { value: 'vital_signs', label: 'Vital Signs Monitoring' },
        { value: 'npo_status', label: 'NPO Status' },
        { value: 'medication', label: 'Pre-Op Medication' },
        { value: 'lab_work', label: 'Lab Work' },
        { value: 'imaging', label: 'Imaging' },
        { value: 'consent', label: 'Consent Form' },
        { value: 'other', label: 'Other' }
    ];

    const priorityOptions = [
        { value: 'routine', label: 'Routine', color: 'bg-slate-50 text-slate-600' },
        { value: 'urgent', label: 'Urgent', color: 'bg-orange-50 text-orange-600' },
        { value: 'stat', label: 'STAT', color: 'bg-red-50 text-red-600' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm">
                            <ClipboardList size={28} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Pre-Surgery Orders</h4>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">
                                {patientName} • {procedureName}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-14 h-14 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 bg-slate-50/30 space-y-6">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                            {/* Order Header */}
                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Order #{index + 1}
                                </h5>
                                {orders.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeOrder(index)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Order Type */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Order Type
                                    </label>
                                    <select
                                        required
                                        value={order.orderType}
                                        onChange={(e) => updateOrder(index, 'orderType', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    >
                                        {orderTypeOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Priority
                                    </label>
                                    <select
                                        required
                                        value={order.priority}
                                        onChange={(e) => updateOrder(index, 'priority', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    >
                                        {priorityOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Assign To Nurse */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Assign To Nurse (Optional)
                                    </label>
                                    <select
                                        value={order.assignedTo || ''}
                                        onChange={(e) => updateOrder(index, 'assignedTo', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    >
                                        <option value="">Any Available Nurse</option>
                                        {nurses.map(nurse => (
                                            <option key={nurse._id} value={nurse._id}>
                                                {nurse.firstName} {nurse.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Scheduled For */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Scheduled For (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={order.scheduledFor || ''}
                                        onChange={(e) => updateOrder(index, 'scheduledFor', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Instructions */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Detailed Instructions
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={order.instructions}
                                    onChange={(e) => updateOrder(index, 'instructions', e.target.value)}
                                    placeholder="Enter detailed instructions for the nurse..."
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Order Button */}
                    <button
                        type="button"
                        onClick={addOrder}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        Add Another Order
                    </button>
                </form>

                {/* Footer */}
                <div className="p-10 border-t border-slate-100 bg-white flex justify-end gap-4 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-10 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit}
                        className="px-12 py-5 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : `Submit ${orders.length} Order${orders.length > 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
