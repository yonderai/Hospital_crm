"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    Droplets,
    Activity,
    CheckCircle2,
    Plus,
    Clock,
    Thermometer,
    ClipboardList,
    FileText,
    X,
    Save
} from "lucide-react";

export default function NurseDashboard() {
    const [stats] = useState([
        { title: "Patients Under Care", value: "28", icon: Users, color: "text-olive-600", bg: "bg-olive-50" },
        { title: "Medications Due", value: "15", icon: Droplets, color: "text-olive-500", bg: "bg-olive-50" },
        { title: "Vital Signs Pending", value: "09", icon: Activity, color: "text-olive-400", bg: "bg-olive-50/50" },
        { title: "Tasks Completed", value: "67%", icon: CheckCircle2, color: "text-olive-600", bg: "bg-olive-50" },
    ]);

    const [vitalsQueue, setVitalsQueue] = useState<any[]>([]);
    const [loadingVitals, setLoadingVitals] = useState(true);
    const [showVitalsModal, setShowVitalsModal] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [patients, setPatients] = useState<any[]>([]); // For dropdown

    useEffect(() => {
        fetchVitals();
        fetchPatients();
    }, []);

    const fetchVitals = async () => {
        try {
            const res = await fetch("/api/vitals");
            const data = await res.json();
            if (data.records) setVitalsQueue(data.records);
            setLoadingVitals(false);
        } catch (e) { console.error(e); }
    };

    const fetchPatients = async () => {
        try {
            const res = await fetch("/api/patients");
            const data = await res.json();
            if (data.patients) setPatients(data.patients);
        } catch (e) { console.error(e); }
    };

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nursing Station</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">NURSE PORTAL • ACUTE CARE</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Handover Notes
                        </button>
                        <button
                            onClick={() => setShowVitalsModal(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">
                            <Plus size={16} /> New Record
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-olive-400 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{s.value}</p>
                            </div>
                            <div className={`p-4 ${s.bg} ${s.color} rounded-2xl`}>
                                <s.icon size={24} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Live Vitals Feed */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Vitals & Observations</h3>
                                <Activity size={20} className="text-olive-600" />
                            </div>
                            <div className="p-0">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                            <th className="px-8 py-4">Patient</th>
                                            <th className="px-8 py-4">BP</th>
                                            <th className="px-8 py-4">HR</th>
                                            <th className="px-8 py-4">SpO2</th>
                                            <th className="px-8 py-4">Temp</th>
                                            <th className="px-8 py-4 text-right">Recorded</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {loadingVitals ? (
                                            <tr><td colSpan={6} className="px-8 py-8 text-center text-slate-400">Loading vitals flow...</td></tr>
                                        ) : vitalsQueue.length === 0 ? (
                                            <tr><td colSpan={6} className="px-8 py-8 text-center text-slate-400">No recent vitals recorded.</td></tr>
                                        ) : vitalsQueue.map((v, idx) => (
                                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5">
                                                    <p className="text-sm font-bold text-slate-900">{v.patientId?.firstName} {v.patientId?.lastName}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase">MRN: {v.patientId?.mrn}</p>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-600">{v.data?.bp || "--"}</td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-600">{v.data?.hr || "--"} bpm</td>
                                                <td className="px-8 py-5">
                                                    <span className={`text-xs font-bold ${Number(v.data?.spo2) < 95 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {v.data?.spo2 || "--"}%
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-sm font-medium text-slate-600">{v.data?.temp || "--"}°F</td>
                                                <td className="px-8 py-5 text-right text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                                    {new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Tasks & Procedures */}
                    <div className="space-y-8">
                        <div className="bg-olive-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-xl font-black tracking-tight">Shift Tasks</h4>
                                <p className="text-[10px] text-olive-400 font-bold uppercase tracking-widest leading-none">Priority Actions</p>
                                <div className="space-y-4">
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <ClipboardList className="text-olive-400" size={20} />
                                        <div className="text-sm font-bold">Wound Care: Room 402</div>
                                    </div>
                                    <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <Droplets className="text-olive-400" size={20} />
                                        <div className="text-sm font-bold">IV Round: Sector 7G</div>
                                    </div>
                                </div>
                            </div>
                            <Activity className="absolute bottom-[-10%] right-[-10%] text-white/5" size={200} />
                        </div>

                        <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm space-y-4">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quick Actions</h4>
                            <NurseAction icon={Activity} label="Record Vitals" onClick={() => setShowVitalsModal(true)} />
                            <NurseAction icon={Droplets} label="Administer Med" />
                            <NurseAction icon={FileText} label="Clinical Note" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Record Vitals Modal */}
            {showVitalsModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black text-slate-900">Record Vitals</h3>
                            <button onClick={() => setShowVitalsModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                        </div>
                        <VitalsForm
                            patients={patients}
                            close={() => setShowVitalsModal(false)}
                            refresh={fetchVitals}
                        />
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

function NurseAction({ icon: Icon, label, onClick }: any) {
    return (
        <button onClick={onClick} className="w-full flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-olive-400 hover:bg-white transition-all group">
            <div className="p-3 bg-white rounded-xl text-olive-600 shadow-sm border border-slate-100 group-hover:bg-olive-600 group-hover:text-white transition-all">
                <Icon size={18} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">{label}</span>
        </button>
    );
}

function VitalsForm({ patients, close, refresh }: any) {
    const [formData, setFormData] = useState({
        patientId: "",
        bp: "",
        hr: "",
        spo2: "",
        temp: "",
        resp: ""
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch("/api/vitals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: formData.patientId,
                    vitals: {
                        bp: formData.bp,
                        hr: formData.hr,
                        spo2: formData.spo2,
                        temp: formData.temp,
                        resp: formData.resp
                    }
                })
            });
            refresh();
            close();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Patient</label>
                <select
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold text-slate-700"
                    onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                    value={formData.patientId}
                >
                    <option value="">-- Choose Patient --</option>
                    {patients.map((p: any) => (
                        <option key={p._id} value={p._id}>{p.firstName} {p.lastName} (MRN: {p.mrn})</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">BP (mmHg)</label>
                    <input placeholder="120/80" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, bp: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Heart Rate</label>
                    <input placeholder="bpm" type="number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, hr: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SpO2 (%)</label>
                    <input placeholder="98" type="number" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, spo2: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Temp (°F)</label>
                    <input placeholder="98.6" type="number" step="0.1" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none text-sm font-bold"
                        onChange={e => setFormData({ ...formData, temp: e.target.value })}
                    />
                </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-olive-700 hover:bg-olive-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 transition-all flex items-center justify-center gap-2">
                {loading ? "Saving..." : <><Save size={16} /> Save Vitals Record</>}
            </button>
        </form>
    );
}
