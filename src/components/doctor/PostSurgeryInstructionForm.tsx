"use client";

import { useState, useEffect } from "react";
import { X, Heart, Plus, Trash2, Clock, Calendar } from "lucide-react";

interface PostSurgeryInstructionFormProps {
    caseId: string;
    patientId: string;
    patientName: string;
    procedureName: string;
    onClose: () => void;
    onSuccess: () => void;
}

interface Instruction {
    instructionType: string;
    instructions: string;
    frequency?: string;
    duration?: string;
    priority: string;
    assignedTo?: string;
    startTime?: string;
}

export default function PostSurgeryInstructionForm({
    caseId,
    patientId,
    patientName,
    procedureName,
    onClose,
    onSuccess
}: PostSurgeryInstructionFormProps) {
    const [loading, setLoading] = useState(false);
    const [nurses, setNurses] = useState<any[]>([]);
    const [instructions, setInstructions] = useState<Instruction[]>([
        { instructionType: 'vital_monitoring', instructions: '', priority: 'routine' }
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

    const addInstruction = () => {
        setInstructions([...instructions, { instructionType: 'vital_monitoring', instructions: '', priority: 'routine' }]);
    };

    const removeInstruction = (index: number) => {
        if (instructions.length > 1) {
            setInstructions(instructions.filter((_, i) => i !== index));
        }
    };

    const updateInstruction = (index: number, field: keyof Instruction, value: string) => {
        const updatedInstructions = [...instructions];
        updatedInstructions[index] = { ...updatedInstructions[index], [field]: value };
        setInstructions(updatedInstructions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/doctor/surgery/post-instructions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caseId,
                    patientId,
                    instructions
                })
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                alert('Failed to create post-surgery instructions');
            }
        } catch (error) {
            console.error('Error creating instructions:', error);
            alert('Error creating post-surgery instructions');
        } finally {
            setLoading(false);
        }
    };

    const instructionTypeOptions = [
        { value: 'vital_monitoring', label: 'Vital Signs Monitoring' },
        { value: 'wound_care', label: 'Wound Care' },
        { value: 'medication', label: 'Medication Administration' },
        { value: 'mobility', label: 'Mobility & Ambulation' },
        { value: 'diet', label: 'Diet & Nutrition' },
        { value: 'pain_management', label: 'Pain Management' },
        { value: 'other', label: 'Other' }
    ];

    const priorityOptions = [
        { value: 'routine', label: 'Routine', color: 'bg-slate-50 text-slate-600' },
        { value: 'urgent', label: 'Urgent', color: 'bg-orange-50 text-orange-600' },
        { value: 'critical', label: 'Critical', color: 'bg-red-50 text-red-600' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
            <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-600 shadow-sm">
                            <Heart size={28} />
                        </div>
                        <div>
                            <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Post-Surgery Instructions</h4>
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
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
                    {instructions.map((instruction, index) => (
                        <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
                            {/* Instruction Header */}
                            <div className="flex items-center justify-between">
                                <h5 className="text-sm font-black text-slate-900 uppercase tracking-widest">
                                    Instruction #{index + 1}
                                </h5>
                                {instructions.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeInstruction(index)}
                                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Instruction Type */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Instruction Type
                                    </label>
                                    <select
                                        required
                                        value={instruction.instructionType}
                                        onChange={(e) => updateInstruction(index, 'instructionType', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    >
                                        {instructionTypeOptions.map(opt => (
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
                                        value={instruction.priority}
                                        onChange={(e) => updateInstruction(index, 'priority', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    >
                                        {priorityOptions.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Frequency */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Frequency
                                    </label>
                                    <input
                                        type="text"
                                        value={instruction.frequency || ''}
                                        onChange={(e) => updateInstruction(index, 'frequency', e.target.value)}
                                        placeholder="e.g., Every 2 hours, 3 times daily"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Duration */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={instruction.duration || ''}
                                        onChange={(e) => updateInstruction(index, 'duration', e.target.value)}
                                        placeholder="e.g., 24 hours, Until discharge"
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                </div>

                                {/* Assign To Nurse */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Assign To Nurse (Optional)
                                    </label>
                                    <select
                                        value={instruction.assignedTo || ''}
                                        onChange={(e) => updateInstruction(index, 'assignedTo', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    >
                                        <option value="">Any Available Nurse</option>
                                        {nurses.map(nurse => (
                                            <option key={nurse._id} value={nurse._id}>
                                                {nurse.firstName} {nurse.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Start Time */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                        Start Time (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={instruction.startTime || ''}
                                        onChange={(e) => updateInstruction(index, 'startTime', e.target.value)}
                                        className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Detailed Instructions */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                    Detailed Instructions
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={instruction.instructions}
                                    onChange={(e) => updateInstruction(index, 'instructions', e.target.value)}
                                    placeholder="Enter detailed post-surgery care instructions for the nurse..."
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add Instruction Button */}
                    <button
                        type="button"
                        onClick={addInstruction}
                        className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest"
                    >
                        <Plus size={18} />
                        Add Another Instruction
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
                        className="px-12 py-5 bg-emerald-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : `Submit ${instructions.length} Instruction${instructions.length > 1 ? 's' : ''}`}
                    </button>
                </div>
            </div>
        </div>
    );
}
