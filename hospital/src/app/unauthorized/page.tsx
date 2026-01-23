
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-md w-full border border-slate-100">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={40} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Access Denied</h1>
                <p className="text-slate-500 font-medium mb-8">
                    You do not have the required permissions to access this area. Please contact your administrator.
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20"
                    >
                        Return to Login
                    </button>
                    <Link href="/" className="block w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                        Go Home
                    </Link>
                </div>

                <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    MediCore Security Protocol
                </p>
            </div>
        </div>
    );
}
