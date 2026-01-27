"use client";

import { Activity, Thermometer, Heart, Wind } from "lucide-react";

export default function TriagePage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Triage & Vitals</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Assessment & Priority</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-8 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Patient</th>
                            <th className="px-8 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Arrival</th>
                            <th className="px-8 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Vitals</th>
                            <th className="px-8 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Priority</th>
                            <th className="px-8 py-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {/* Demo Row */}
                        <tr className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-4">
                                <p className="text-slate-900 font-bold">Doe, John (Trauma)</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Male • 45y</p>
                            </td>
                            <td className="px-8 py-4">
                                <p className="text-slate-900 font-bold">10:42 AM</p>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Ambulance</p>
                            </td>
                            <td className="px-8 py-4">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1 text-red-600">
                                        <Heart size={12} /> <span className="text-xs font-bold">110</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600">
                                        <Wind size={12} /> <span className="text-xs font-bold">94%</span>
                                    </div>
                                </div>
                            </td>
                            <td className="px-8 py-4">
                                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-100">
                                    P1 - Critical
                                </span>
                            </td>
                            <td className="px-8 py-4">
                                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all shadow-lg shadow-slate-900/10">
                                    Assess
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
