"use client";

import { useState } from "react";
import { CheckCircle2, Clock, AlertCircle, User, Calendar, FileText } from "lucide-react";

interface SurgeryTaskCardProps {
    task: any;
    type: 'pre-order' | 'post-instruction';
    onComplete: (taskId: string, notes: string) => void;
}

export default function SurgeryTaskCard({ task, type, onComplete }: SurgeryTaskCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [nurseNotes, setNurseNotes] = useState('');
    const [isCompleting, setIsCompleting] = useState(false);

    const handleComplete = async () => {
        setIsCompleting(true);
        await onComplete(task._id, nurseNotes);
        setIsCompleting(false);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'stat':
            case 'critical':
                return 'bg-red-50 border-red-200 text-red-700';
            case 'urgent':
                return 'bg-orange-50 border-orange-200 text-orange-700';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-700';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            case 'in-progress':
                return 'text-blue-600 bg-blue-50 border-blue-100';
            case 'cancelled':
            case 'discontinued':
                return 'text-slate-600 bg-slate-50 border-slate-100';
            default:
                return 'text-orange-600 bg-orange-50 border-orange-100';
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isCompleted = task.status === 'completed';

    return (
        <div className={`bg-white rounded-3xl border-2 shadow-sm overflow-hidden transition-all ${isCompleted ? 'border-emerald-100 opacity-75' : 'border-slate-100'
            }`}>
            {/* Card Header */}
            <div
                className="p-6 cursor-pointer hover:bg-slate-50/50 transition-all"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all ${isCompleted
                                ? 'bg-emerald-600 border-emerald-600'
                                : 'border-slate-300 hover:border-olive-600'
                            }`}>
                            {isCompleted && <CheckCircle2 size={16} className="text-white" />}
                        </div>

                        {/* Task Info */}
                        <div className="flex-1 space-y-3">
                            {/* Patient Info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-olive-50 rounded-full flex items-center justify-center text-olive-600">
                                    <User size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900">
                                        {task.patientId?.firstName} {task.patientId?.lastName}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                                        MRN: {task.patientId?.mrn}
                                    </p>
                                </div>
                            </div>

                            {/* Surgery Info */}
                            <div className="flex items-center gap-2 text-xs">
                                <FileText size={14} className="text-slate-400" />
                                <span className="font-bold text-slate-700">
                                    {task.caseId?.procedureName || 'Surgery'}
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">
                                    {task.caseId?.orRoomId}
                                </span>
                            </div>

                            {/* Task Type */}
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${type === 'pre-order' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                                    }`}>
                                    {type === 'pre-order' ? task.orderType?.replace('_', ' ') : task.instructionType?.replace('_', ' ')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getPriorityColor(task.priority)}`}>
                                    {task.priority}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                            </div>

                            {/* Instructions Preview */}
                            <p className="text-sm text-slate-600 line-clamp-2">
                                {task.instructions}
                            </p>
                        </div>
                    </div>

                    {/* Time Info */}
                    <div className="text-right space-y-2">
                        {task.scheduledFor && (
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Clock size={12} />
                                <span>{formatDate(task.scheduledFor)}</span>
                            </div>
                        )}
                        {type === 'post-instruction' && task.frequency && (
                            <div className="text-[10px] font-bold text-olive-600 bg-olive-50 px-2 py-1 rounded-lg">
                                {task.frequency}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/30 p-6 space-y-6">
                    {/* Full Instructions */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Detailed Instructions
                        </label>
                        <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-2xl">
                            {task.instructions}
                        </p>
                    </div>

                    {/* Additional Info for Post-Surgery */}
                    {type === 'post-instruction' && (
                        <div className="grid grid-cols-2 gap-4">
                            {task.frequency && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Frequency
                                    </label>
                                    <p className="text-sm font-bold text-slate-700 bg-white p-3 rounded-xl">
                                        {task.frequency}
                                    </p>
                                </div>
                            )}
                            {task.duration && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Duration
                                    </label>
                                    <p className="text-sm font-bold text-slate-700 bg-white p-3 rounded-xl">
                                        {task.duration}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Prescribed By */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-xl">
                        <User size={14} />
                        <span>
                            Prescribed by: Dr. {task.prescribedBy?.firstName} {task.prescribedBy?.lastName}
                        </span>
                    </div>

                    {/* Completion Section */}
                    {!isCompleted && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Nurse Notes (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={nurseNotes}
                                    onChange={(e) => setNurseNotes(e.target.value)}
                                    placeholder="Add any notes about completing this task..."
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-olive-500/20 outline-none transition-all resize-none"
                                />
                            </div>
                            <button
                                onClick={handleComplete}
                                disabled={isCompleting}
                                className="w-full px-6 py-4 bg-olive-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-olive-700 transition-all shadow-lg shadow-olive-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isCompleting ? (
                                    'Marking Complete...'
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} />
                                        Mark as Complete
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {/* Completed Info */}
                    {isCompleted && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <CheckCircle2 size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Completed</span>
                            </div>
                            <p className="text-xs text-emerald-600">
                                Completed on {formatDate(task.completedAt)} by {task.completedBy?.firstName} {task.completedBy?.lastName}
                            </p>
                            {task.nurseNotes && (
                                <div className="mt-3 pt-3 border-t border-emerald-200">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Notes:</p>
                                    <p className="text-sm text-emerald-700">{task.nurseNotes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
