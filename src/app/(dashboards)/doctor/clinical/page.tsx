
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    Clipboard,
    FileText,
    Beaker,
    CheckCircle,
    Clock,
    Plus,
    Filter,
    ChevronRight,
    Search,
    Pill
} from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorClinical() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClinicalFeed = async () => {
            try {
                const [labsRes, rxRes] = await Promise.all([
                    fetch('/api/lab/results'),
                    fetch('/api/doctor/prescriptions')
                ]);

                let combinedTasks: any[] = [];

                if (labsRes.ok) {
                    const labs = await labsRes.json();
                    const pendingLabs = labs
                        .filter((l: any) => l.status === 'pending')
                        .map((l: any) => ({
                            id: l._id,
                            title: `Review Lab: ${l.testType}`,
                            patient: `${l.patientId?.firstName} ${l.patientId?.lastName}`,
                            patientId: l.patientId?._id,
                            type: "Laboratory",
                            priority: l.priority === 'urgent' || l.priority === 'stat' ? "Urgent" : "Routine",
                            time: new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            rawDate: new Date(l.createdAt)
                        }));
                    combinedTasks = [...combinedTasks, ...pendingLabs];
                }

                if (rxRes.ok) {
                    const rxs = await rxRes.json();
                    const pendingRxs = rxs
                        .filter((r: any) => r.status === 'pending')
                        .map((r: any) => ({
                            id: r._id,
                            title: `Authorize RX: ${r.medications?.[0]?.drugName || 'Medication'}`,
                            patient: `${r.patientId?.firstName} ${r.patientId?.lastName}`,
                            patientId: r.patientId?._id,
                            type: "Pharmacy",
                            priority: "Routine",
                            time: new Date(r.prescribedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            rawDate: new Date(r.prescribedDate)
                        }));
                    combinedTasks = [...combinedTasks, ...pendingRxs];
                }

                // Sort by date descending
                combinedTasks.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
                setTasks(combinedTasks);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchClinicalFeed();
    }, []);

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Clinical Decision Hub</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Integrated Sentinel Intelligence • Node α-01</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Main Content - Full Width */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Task List */}
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Pending Clinical Actions</h3>
                                <div className="flex bg-slate-100 p-0.5 rounded-xl">
                                    <button className="px-4 py-1.5 bg-white text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm">Real-time Feed</button>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {loading ? (
                                    <div className="p-20 text-center text-slate-300 font-black uppercase animate-pulse tracking-[0.3em]">Querying Clinical Stream...</div>
                                ) : tasks.length === 0 ? (
                                    <div className="p-20 text-center text-slate-300 font-black uppercase tracking-[0.3em] italic">Zero critical actions pending in current queue</div>
                                ) : (
                                    tasks.map((task, idx) => (
                                        <div key={idx} className="p-8 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-inner ${task.priority === 'Urgent' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-olive-50 text-olive-600 border-olive-100'
                                                    }`}>
                                                    {task.type === 'Laboratory' ? <Beaker size={24} /> : <Pill size={24} />}
                                                </div>
                                                <div>
                                                    <h4 className="text-md font-black text-slate-900 tracking-tight italic uppercase leading-none">{task.title}</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{task.patient}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase ${task.priority === 'Urgent' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>{task.priority}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.time}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/doctor/patients/${task.patientId}`}
                                                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-olive-700 transition-all shadow-xl shadow-slate-900/10"
                                            >
                                                Intervene
                                            </Link>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Encounters Mocked for Design but integrated with structure */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-olive-700 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                                <h4 className="text-sm font-black uppercase tracking-widest mb-4 italic">Next Encounter</h4>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black">KM</div>
                                        <div>
                                            <p className="text-lg font-black italic">Kurt Morrison</p>
                                            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Post-Op Review • 14:00</p>
                                        </div>
                                    </div>
                                    <button className="w-full py-3 bg-white text-olive-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Start Virtual Visit</button>
                                </div>
                                <Activity size={180} className="absolute bottom-[-20%] right-[-10%] text-white/5" />
                            </div>
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Clinical Wisdom</h4>
                                <p className="text-sm font-bold text-slate-900 italic mt-4">"Precision in diagnostics is the bedrock of therapeutic excellence. Review lab differentials with chronological context."</p>
                                <div className="mt-6 flex items-center gap-2">
                                    <div className="w-6 h-1 rounded-full bg-olive-500" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-olive-600">Protocol Alpha-9</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column removed */}
                </div>
            </div>
        </DashboardLayout>
    );
}
