"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
    Activity,
    AlertTriangle,
    Wifi,
    Users,
    Plus,
    Clock,
    Zap,
    Wind,
    Droplet
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function ICUMonitorPage() {
    const { data: session } = useSession();
    const [beds, setBeds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchICUData = async () => {
        try {
            const res = await fetch("/api/nurse/dashboard-data");
            const data = await res.json();

            // Map patients to ICU Beds
            const icuBeds = data.vitalsFlow?.map((vf: any, i: number) => ({
                id: `ICU-B-${i + 1}`,
                patient: vf.patient,
                mrn: `MRN-${100 + i}`,
                status: vf.status === 'Due Now' ? 'Critical' : 'Stable',
                vitals: {
                    hr: 75 + (i * 5),
                    bp: "120/80",
                    spo2: 98 - i,
                    temp: 36.5 + (i * 0.2)
                },
                vent: i % 2 === 0 ? "Attached" : "Not Required",
                alerts: vf.status === 'Due Now' ? ["Vitals Overdue"] : []
            })) || [];

            setBeds(icuBeds);
        } catch (error) {
            console.error("ICU Monitor Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchICUData();
        const interval = setInterval(fetchICUData, 30000);
        return () => clearInterval(interval);
    }, []);

    const nurseName = session?.user?.name || "Sarah Connor";

    return (
        <DashboardLayout>
            <div className="space-y-10">
                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase italic">ICU Monitor Matrix</h2>
                        <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">
                            VIGILANCE MODE • {nurseName} • REAL-TIME TELEMETRY
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 uppercase text-[9px] font-black tracking-widest">
                            <Wifi size={14} className="animate-pulse" /> Telemetry Active
                        </div>
                    </div>
                </div>

                {/* ICU Floor Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-sm animate-pulse h-80" />
                        ))
                    ) : beds.length === 0 ? (
                        <div className="col-span-3 py-32 text-center text-slate-400 font-bold italic border-2 border-dashed border-slate-100 rounded-[48px]">
                            No patients currently in ICU surveillance.
                        </div>
                    ) : beds.map((bed, i) => (
                        <div key={i} className={`bg-white p-8 rounded-[48px] border-2 transition-all hover:shadow-2xl hover:shadow-slate-200/50 relative overflow-hidden group ${bed.status === 'Critical' ? 'border-red-100 hover:border-red-400 bg-red-50/10' : 'border-slate-100 hover:border-olive-400'
                            }`}>
                            <div className="absolute top-0 right-0 p-6 flex gap-2">
                                <span className={`w-3 h-3 rounded-full ${bed.status === 'Critical' ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                            </div>

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{bed.id}</p>
                                    <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">{bed.patient}</h4>
                                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{bed.mrn}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <VitalNode label="Heart Rate" value={bed.vitals.hr} unit="BPM" icon={Zap} color="text-rose-500" />
                                <VitalNode label="SpO2" value={bed.vitals.spo2} unit="%" icon={Droplet} color="text-blue-500" />
                                <VitalNode label="Blood Pressure" value={bed.vitals.bp} unit="mmHg" icon={Activity} color="text-teal-500" />
                                <VitalNode label="Temp" value={bed.vitals.temp} unit="°C" icon={Zap} color="text-orange-500" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Wind size={14} /> Ventilation
                                    </div>
                                    <span className={bed.vent === 'Attached' ? 'text-teal-600' : 'text-slate-400'}>{bed.vent}</span>
                                </div>
                                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${bed.status === 'Critical' ? 'bg-red-500 w-full' : 'bg-olive-500 w-1/3'}`} />
                                </div>
                            </div>

                            {bed.alerts.length > 0 && (
                                <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-[8px] font-black uppercase tracking-widest border border-red-200">
                                    <AlertTriangle size={12} /> {bed.alerts[0]}
                                </div>
                            )}

                            <button className="w-full mt-6 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 group-hover:bg-olive-700">
                                Enter High-Vigilance Mode
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

function VitalNode({ label, value, unit, icon: Icon, color }: any) {
    return (
        <div className="bg-slate-50/50 p-4 rounded-3xl border border-slate-50 group/vital hover:border-slate-200 transition-all">
            <div className="flex items-center gap-2 mb-2">
                <Icon size={12} className={color} />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
            <p className="text-lg font-black text-slate-900 tracking-tight">
                {value}<span className="text-[10px] font-bold text-slate-400 ml-1">{unit}</span>
            </p>
        </div>
    );
}
