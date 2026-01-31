"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Download, ArrowRight, QrCode, Loader2 } from "lucide-react";
import { Suspense } from "react";

function RegistrationSuccessContent() {
    const params = useSearchParams();
    const mrn = params.get("mrn");

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-lg w-full text-center p-10 space-y-8 animate-in zoom-in-95 duration-500">

                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-green-600" />
                </div>

                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Registration Successful!</h1>
                    <p className="text-slate-500">Welcome to Medicore. Your account has been created.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Medical Record Number (MRN)</p>
                    <p className="text-3xl font-black text-olive-600 tracking-tight">{mrn || "Generating..."}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 transition cursor-pointer">
                        <QrCode size={32} className="text-slate-700" />
                        <span className="text-xs font-bold text-slate-600">Download QR</span>
                    </div>
                    <div className="p-4 border border-slate-200 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-50 transition cursor-pointer">
                        <Download size={32} className="text-slate-700" />
                        <span className="text-xs font-bold text-slate-600">Welcome Kit</span>
                    </div>
                </div>

                <div className="pt-4">
                    <Link href="/login" className="block w-full bg-olive-600 hover:bg-olive-700 text-white py-4 rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-olive-600/20 transition-all">
                        Login to Portal
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default function RegistrationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="text-center">
                    <Loader2 className="animate-spin mx-auto mb-4" size={40} />
                    <p className="text-slate-500 font-medium">Loading...</p>
                </div>
            </div>
        }>
            <RegistrationSuccessContent />
        </Suspense>
    );
}
