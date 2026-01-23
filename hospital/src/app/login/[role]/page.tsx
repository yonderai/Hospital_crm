"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
    Heart,
    ShieldCheck,
    ArrowRight,
    Mail,
    Lock,
    Activity,
    Dna,
    CheckCircle2
} from "lucide-react";

export default function LoginPage() {
    const params = useParams();
    const router = useRouter();
    const role = Array.isArray(params.role) ? params.role[0] : params.role || "doctor";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Capitalize role for display
    const displayRole = role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setLoading(false);
                alert("Invalid credentials"); // Simple alert for now, can be improved to UI state
                return;
            }

            if (result?.ok) {
                // Redirect to role specific dashboard
                router.push(`/${role}/dashboard`);
                router.refresh();
            }
        } catch (error) {
            console.error("Login failed", error);
            setLoading(false);
            alert("An error occurred during login");
        }
    };

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            {/* LEFT SIDE: Branding & Stats (Dark Navy #0F172A) */}
            <div className="hidden lg:flex w-[40%] bg-[#0F172A] p-16 flex-col justify-between relative overflow-hidden">
                {/* Abstract Background Decoration */}
                <div className="absolute top-[-10%] right-[-10%] opacity-10 pointer-events-none">
                    <Activity size={400} className="text-olive-400 rotate-12" />
                </div>
                <div className="absolute bottom-[-5%] left-[-5%] opacity-5 pointer-events-none">
                    <Dna size={300} className="text-olive-500" />
                </div>

                <div className="relative z-10 space-y-12">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-tr from-olive-600 to-olive-400 rounded-xl flex items-center justify-center shadow-lg shadow-olive-600/20">
                            <Heart className="text-white" size={28} fill="currentColor" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">Medicore</h1>
                            <p className="text-[10px] font-bold text-olive-400 tracking-[0.4em] uppercase mt-1">Enterprise Clinical</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-6xl font-black bg-gradient-to-r from-white via-white to-olive-400 bg-clip-text text-transparent leading-none">
                            Control<br />Center
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Secure, centralized orchestration for modern healthcare institutions.
                            Optimized for high-performance clinical throughput.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                        <div>
                            <p className="text-3xl font-black text-white">12k+</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Managed Beds</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">99.9%</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">System Uptime</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">V2.4.1</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-olive-500/10 border border-olive-500/20 rounded-full">
                            <ShieldCheck size={12} className="text-olive-400" />
                            <span className="text-[10px] font-bold text-olive-400 uppercase tracking-widest">HIPAA Compliant</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Yonder sentinel prtcl</span>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form (White) */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-zinc-50/30">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login to Portal</h3>
                        <p className="text-slate-500 text-sm font-medium">Please enter your credentials to initialize session.</p>
                    </div>

                    {/* Role Indicator Cards */}
                    <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-olive-100 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="text-olive-700" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authenticated Role</p>
                                <p className="text-sm font-bold text-slate-900">{displayRole}</p>
                            </div>
                        </div>
                        <CheckCircle2 className="text-olive-500" size={24} />
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Professional Email</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-600 transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="doctor.name@medicore.net"
                                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all text-sm font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secure Password</label>
                                <button type="button" className="text-[10px] font-black text-olive-700 hover:underline uppercase tracking-widest">Forgot?</button>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-600 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all text-sm font-medium text-slate-900"
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full bg-[#6B8E23] hover:bg-[#556B2F] text-white p-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-olive-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Initialize Session <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="pt-10 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-40">
                            <ShieldCheck size={14} className="text-slate-900" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Secured by Yonder Sentinel</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-4 max-w-[200px] text-center leading-relaxed font-medium">
                            Protected by military-grade encryption and biometric verification nodes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
