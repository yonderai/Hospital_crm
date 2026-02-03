"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import SurgeryTaskCard from "@/components/nurse/SurgeryTaskCard";
import { Activity, Filter, ClipboardList, Heart, AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function SurgeryTasksPage() {
    const [loading, setLoading] = useState(true);
    const [preSurgeryOrders, setPreSurgeryOrders] = useState<any[]>([]);
    const [postSurgeryInstructions, setPostSurgeryInstructions] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [activeTab, setActiveTab] = useState<'pre' | 'post'>('pre');

    useEffect(() => {
        fetchTasks();
    }, [statusFilter]);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/nurse/surgery-tasks?status=${statusFilter}`);
            if (res.ok) {
                const data = await res.json();
                setPreSurgeryOrders(data.preSurgeryOrders || []);
                setPostSurgeryInstructions(data.postSurgeryInstructions || []);
            }
        } catch (error) {
            console.error('Failed to fetch surgery tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTask = async (taskId: string, notes: string, type: 'pre' | 'post') => {
        try {
            const endpoint = type === 'pre'
                ? '/api/doctor/surgery/pre-orders'
                : '/api/doctor/surgery/post-instructions';

            const bodyKey = type === 'pre' ? 'orderId' : 'instructionId';

            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    [bodyKey]: taskId,
                    status: 'completed',
                    nurseNotes: notes
                })
            });

            if (res.ok) {
                // Refresh tasks
                fetchTasks();
            } else {
                alert('Failed to complete task');
            }
        } catch (error) {
            console.error('Error completing task:', error);
            alert('Error completing task');
        }
    };

    const pendingPreOrders = preSurgeryOrders.filter(o => o.status === 'pending').length;
    const pendingPostInstructions = postSurgeryInstructions.filter(i => i.status === 'pending').length;
    const completedPreOrders = preSurgeryOrders.filter(o => o.status === 'completed').length;
    const completedPostInstructions = postSurgeryInstructions.filter(i => i.status === 'completed').length;

    const currentTasks = activeTab === 'pre' ? preSurgeryOrders : postSurgeryInstructions;

    return (
        <DashboardLayout>
            <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen font-sans">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-olive-700 font-bold uppercase tracking-widest text-[10px]">
                            <Activity size={12} />
                            Surgery Coordination
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Surgery Tasks</h1>
                        <p className="text-slate-500 text-sm font-medium">
                            Pre-operative and post-operative care instructions from doctors
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm focus:ring-2 focus:ring-olive-500/20 outline-none"
                        >
                            <option value="pending">Pending Only</option>
                            <option value="completed">Completed Only</option>
                            <option value="all">All Tasks</option>
                        </select>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                        { label: "Pending Pre-Op", val: pendingPreOrders, icon: ClipboardList, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Pending Post-Op", val: pendingPostInstructions, icon: Heart, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Completed Pre-Op", val: completedPreOrders, icon: CheckCircle2, color: "text-olive-600", bg: "bg-olive-50" },
                        { label: "Completed Post-Op", val: completedPostInstructions, icon: CheckCircle2, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center`}>
                                <stat.icon size={22} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100 bg-slate-50/50">
                        <button
                            onClick={() => setActiveTab('pre')}
                            className={`flex-1 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'pre'
                                    ? 'text-blue-600 bg-white'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <ClipboardList size={16} className="inline mr-2" />
                            Pre-Surgery Orders ({preSurgeryOrders.length})
                            {activeTab === 'pre' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('post')}
                            className={`flex-1 px-8 py-5 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === 'post'
                                    ? 'text-emerald-600 bg-white'
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <Heart size={16} className="inline mr-2" />
                            Post-Surgery Instructions ({postSurgeryInstructions.length})
                            {activeTab === 'post' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-600 rounded-t-full" />
                            )}
                        </button>
                    </div>

                    {/* Tasks List */}
                    <div className="p-8">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 border-4 border-olive-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Tasks...</p>
                                </div>
                            </div>
                        ) : currentTasks.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    {activeTab === 'pre' ? (
                                        <ClipboardList size={32} className="text-slate-300" />
                                    ) : (
                                        <Heart size={32} className="text-slate-300" />
                                    )}
                                </div>
                                <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
                                    No {activeTab === 'pre' ? 'Pre-Surgery Orders' : 'Post-Surgery Instructions'}
                                </p>
                                <p className="text-xs text-slate-400 mt-2">
                                    {statusFilter === 'pending' ? 'All tasks are completed!' : 'No tasks found for this filter.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentTasks.map((task) => (
                                    <SurgeryTaskCard
                                        key={task._id}
                                        task={task}
                                        type={activeTab === 'pre' ? 'pre-order' : 'post-instruction'}
                                        onComplete={(taskId, notes) => handleCompleteTask(taskId, notes, activeTab)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Help Section */}
                <div className="bg-gradient-to-br from-olive-600 to-olive-700 p-8 rounded-[40px] text-white shadow-2xl shadow-olive-600/30">
                    <div className="flex items-start gap-6">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                            <AlertCircle size={24} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-xl font-black tracking-tight">Surgery Task Guidelines</h3>
                            <ul className="space-y-2 text-sm text-olive-100 leading-relaxed">
                                <li>• <strong>Pre-Surgery Orders:</strong> Complete all tasks before the scheduled surgery time</li>
                                <li>• <strong>Post-Surgery Instructions:</strong> Follow frequency and duration as prescribed</li>
                                <li>• <strong>Priority Levels:</strong> STAT/Critical tasks require immediate attention</li>
                                <li>• <strong>Documentation:</strong> Add detailed notes when completing tasks for continuity of care</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
