"use client";

import { ShieldCheck, Cpu, HardDrive, Layout, AlertCircle, TrendingUp, History, Info, Users, Zap, Eye, RefreshCcw } from "lucide-react";

export default function AIGovernancePage() {
    return (
        <div className="flex flex-col h-screen bg-[#0d0e0d] text-olive-100 selection:bg-olive-500 selection:text-white">
            {/* Dark Futuristic Header */}
            <header className="bg-black/50 backdrop-blur-md border-b border-olive-900/50 h-20 flex items-center justify-between px-10">
                <div className="flex items-center gap-4">
                    <div className="bg-olive-600/20 p-2 rounded-lg border border-olive-500/30">
                        <Cpu className="text-olive-400 animate-pulse" size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-widest uppercase">AI Governance Console</h1>
                        <p className="text-[10px] text-olive-500 font-bold tracking-[0.2em]">OVERSIGHT & MODEL REGISTRY</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-olive-900/20 rounded-full border border-olive-800/50">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        <span className="text-[10px] font-bold text-olive-400">ACTIVE MODELS: 14</span>
                    </div>
                    <button className="bg-olive-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-olive-500 transition-all shadow-[0_0_20px_rgba(128,135,82,0.3)]">
                        Deploy Version 4.2
                    </button>
                </div>
            </header>

            <main className="flex-1 p-10 overflow-y-auto space-y-10">
                {/* Model Metrics */}
                <div className="grid grid-cols-4 gap-8">
                    <MetricCard title="Total Suggestions" value="124,082" sub="Last 24 hours" icon={<Layout className="text-olive-400" />} />
                    <MetricCard title="Clinician Acceptance" value="88.2%" sub="+3.1% weekly" icon={<TrendingUp className="text-blue-400" />} />
                    <MetricCard title="Safety Flags" value="03" sub="Requires Review" icon={<AlertCircle className="text-red-400" />} trend="critical" />
                    <MetricCard title="Avg Latency" value="240ms" sub="P95 Response" icon={<Zap className="text-yellow-400" />} />
                </div>

                <div className="grid grid-cols-3 gap-10">
                    {/* Model Registry & Status */}
                    <div className="col-span-2 bg-black/40 border border-olive-900/50 rounded-3xl overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-olive-900/50 flex justify-between items-center">
                            <h2 className="text-lg font-bold flex items-center gap-3">
                                <HardDrive className="text-olive-500" size={22} /> Live Model Registry
                            </h2>
                            <button className="text-[10px] font-bold text-olive-500 hover:text-white transition-colors flex items-center gap-2">
                                <RefreshCcw size={12} /> REFRESH REGISTRY
                            </button>
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-olive-950/20 text-olive-600 text-[10px] font-bold uppercase tracking-widest">
                                        <th className="px-8 py-5">Instance Name</th>
                                        <th className="px-8 py-5">Health</th>
                                        <th className="px-8 py-5">Explainability</th>
                                        <th className="px-8 py-5">Audit Log</th>
                                        <th className="px-8 py-5">Override Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-olive-900/30">
                                    {[
                                        { name: "Clinical-Triage-LLM", version: "V2.2", health: "Healthy", exp: "94/100", audit: "3 alerts", rate: "2.1%" },
                                        { name: "Med-Dose-Optimizer", version: "V4.1", health: "Optimizing", exp: "98/100", audit: "None", rate: "0.8%" },
                                        { name: "ICU-Sepsis-Predict", version: "V1.8", health: "Critical", exp: "82/100", audit: "1 flag", rate: "12.4%" },
                                        { name: "Image-Radiology-Net", version: "V3.0", health: "Healthy", exp: "78/100", audit: "None", rate: "4.5%" },
                                        { name: "Scheduling-Bot-V2", version: "V2.0", health: "Healthy", exp: "N/A", audit: "None", rate: "1.2%" },
                                    ].map((row, idx) => (
                                        <tr key={idx} className="hover:bg-olive-800/10 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-white mb-0.5">{row.name}</div>
                                                <div className="text-[10px] text-olive-600 font-mono">{row.version}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`flex items-center gap-2 text-xs font-bold ${row.health === 'Critical' ? 'text-red-400' : 'text-green-400'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${row.health === 'Critical' ? 'bg-red-400' : 'bg-green-400 animate-pulse'}`}></div>
                                                    {row.health}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="w-24 bg-olive-900/50 h-1.5 rounded-full overflow-hidden">
                                                    <div className="bg-olive-400 h-full" style={{ width: row.exp.split('/')[0] + '%' }}></div>
                                                </div>
                                                <div className="text-[10px] text-olive-500 mt-1 font-bold">{row.exp} SHAP/Grad-CAM</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="flex items-center gap-2 text-[10px] font-bold text-olive-400 hover:text-white px-3 py-1 bg-olive-900/30 rounded border border-olive-800/50">
                                                    <History size={12} /> View Log
                                                </button>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-olive-200">{row.rate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Human-in-the-Loop Override Center */}
                    <div className="flex flex-col gap-10">
                        <div className="bg-gradient-to-br from-olive-900/40 to-black border border-olive-500/20 rounded-3xl p-8 flex flex-col items-center text-center">
                            <ShieldCheck size={48} className="text-olive-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Ethics & Governance</h3>
                            <p className="text-xs text-olive-400 leading-relaxed mb-6">
                                Automated monitoring of model bias across demographics. Current parity score is within approved range.
                            </p>
                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-olive-500 uppercase">
                                    <span>Fairness Index</span>
                                    <span className="text-green-400">0.96</span>
                                </div>
                                <div className="w-full h-2 bg-black border border-olive-900 rounded-full overflow-hidden">
                                    <div className="bg-green-500 h-full w-[96%]"></div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-950/20 border border-red-900/30 rounded-3xl p-8 flex flex-col gap-4">
                            <h3 className="text-lg font-bold text-red-100 flex items-center gap-3">
                                <Users className="text-red-400" size={20} /> Override Required
                            </h3>
                            <p className="text-[11px] text-red-200/60 leading-relaxed italic">
                                "High divergence detected in Sepsis Predictor (Instance ICU-09). Clinician override rate &gt; 12% in last hour."
                            </p>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-red-900/50 text-red-100 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-700/50 hover:bg-red-800/50 transition-all">
                                    Investigate Drift
                                </button>
                                <button className="p-3 bg-black border border-red-900/50 text-red-400 rounded-xl">
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="h-10 bg-black border-t border-olive-900/50 px-10 flex items-center justify-between text-[10px] uppercase font-bold tracking-[0.3em] overflow-hidden">
                <div className="flex gap-10">
                    <span className="text-olive-700">CORE ANALYTICS ENGINE: V5.0</span>
                    <span className="text-olive-700">ENCRYPTION: AES-256-QUANTUM</span>
                </div>
                <div className="animate-pulse text-olive-400">
                    SECURE ACCESS AUTHORIZED - ROOT USER: DR. YUVRAJ SINGH
                </div>
            </footer>
        </div>
    );
}

function MetricCard({ title, value, sub, icon, trend }: any) {
    return (
        <div className={`bg-black/40 border border-olive-900/50 rounded-3xl p-8 hover:border-olive-500/50 transition-all cursor-crosshair group ${trend === 'critical' ? 'ring-1 ring-red-500/20' : ''}`}>
            <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-olive-950/50 rounded-2xl group-hover:bg-olive-800/30 transition-colors">
                    {icon}
                </div>
                <Info size={16} className="text-olive-800 cursor-help hover:text-olive-400" />
            </div>
            <div>
                <h3 className="text-xs font-bold text-olive-600 uppercase tracking-widest mb-1">{title}</h3>
                <p className="text-3xl font-black text-white">{value}</p>
                <p className="text-[11px] text-olive-500 font-medium mt-1 italic">{sub}</p>
            </div>
        </div>
    );
}
