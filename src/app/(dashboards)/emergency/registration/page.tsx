"use client";

import { UserPlus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EmergencyRegistration() {
    const router = useRouter();
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("Unknown");
    const [submitting, setSubmitting] = useState(false);
    const [tempName, setTempName] = useState("TRAUMA-X-PENDING");

    useEffect(() => {
        // Generate random ID on mount
        const randomId = Math.floor(1000 + Math.random() * 9000);
        setTempName(`TRAUMA-X-2026-${randomId}`);
    }, []);

    const handleRegister = async () => {
        setSubmitting(true);
        try {
            const res = await fetch("/api/emergency/cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tempName,
                    age: Number(age) || 0,
                    gender,
                    arrivalMode: "ambulance",
                    chiefComplaint: "Level 1 Trauma - Rapid Entry",
                    triageLevel: "P1",
                    status: "triage"
                })
            });

            if (res.ok) {
                router.push("/emergency/dashboard");
            } else {
                alert("Failed to register case");
            }
        } catch (error) {
            console.error("Registration failed", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">Patient Registration</h2>
                <p className="text-slate-500 text-[10px] font-black mt-1 uppercase tracking-[0.4em]">Fast-Track Entry</p>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="bg-slate-950 border border-slate-800 rounded-[32px] p-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                        <UserPlus className="text-red-500" /> New Unknown Patient
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-900/10 border border-red-900/20 rounded-2xl">
                            <p className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">Auto-Generated Alias</p>
                            <p className="text-2xl font-black text-white">{tempName}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Approx Age</label>
                                <input
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-red-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-2">Gender</label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-red-500 transition-all"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Unknown">Unknown</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleRegister}
                            disabled={submitting}
                            className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-900/20 mt-4 disabled:opacity-50"
                        >
                            {submitting ? "Registering..." : "Quick Register (Trauma)"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
