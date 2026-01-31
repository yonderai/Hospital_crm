"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Heart,
    Mail,
    Lock,
    ArrowRight,
    ShieldCheck,
    Activity,
    Dna,
    AlertCircle
} from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid credentials. Please verify your access.");
                setLoading(false);
            } else {
                // Successful login
                // Force a hard navigation to trigger middleware and fresh session fetch
                window.location.href = "/";
            }
        } catch (err) {
            setError("Connection failed. Try again.");
            setLoading(false);
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
                            System<br />Login
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                            Secure, centralized access control for all hospital personnel.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-800">
                        <div>
                            <p className="text-3xl font-black text-white">Strict</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">RBAC Protocol</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black text-white">256-bit</p>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Encryption</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-slate-500 tracking-widest">V2.5.0</span>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-olive-500/10 border border-olive-500/20 rounded-full">
                            <ShieldCheck size={12} className="text-olive-400" />
                            <span className="text-[10px] font-bold text-olive-400 uppercase tracking-widest">Secure Node</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">Yonder sentinel prtcl</span>
                </div>
            </div>

            {/* RIGHT SIDE: Login Form (White) */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-zinc-50/30">
                <div className="w-full max-w-md space-y-10">
                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">Personnel Authentication</h3>
                        <p className="text-slate-500 text-sm font-medium">Please verify your identity to access clinical portals.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="text-red-500" size={20} />
                            <p className="text-xs font-bold text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure ID / Email</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-600 transition-colors" />
                                <input
                                    required
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@medicore.net"
                                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Passcode</label>
                            </div>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-olive-600 transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full bg-white border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-4 focus:ring-olive-600/5 focus:border-olive-600 transition-all text-sm font-medium text-slate-900 placeholder:text-slate-300"
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
                                    Authenticate <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-2">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-[#fcfcfc] px-2 text-slate-400 font-bold tracking-widest">or</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">New Patient?</h4>
                            <a
                                href="/register"
                                className="block w-full py-4 border-2 border-olive-600/30 hover:border-olive-600 text-olive-700 hover:text-olive-800 rounded-xl font-bold uppercase tracking-wider transition-all bg-olive-50/50 hover:bg-olive-50 flex items-center justify-center gap-2 group"
                            >
                                Register as New Patient
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                        </div>
                    </div>

                    <div className="pt-10 flex flex-col items-center gap-6">
                        <div className="flex items-center gap-1.5 opacity-40">
                            <ShieldCheck size={14} className="text-slate-900" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Secured by Yonder Sentinel</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
