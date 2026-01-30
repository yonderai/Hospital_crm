"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Printer } from "lucide-react";


export default function QRStandPage() {
    const [qrValue, setQrValue] = useState("");
    const [qrImage, setQrImage] = useState("");

    useEffect(() => {
        // Generate QR Code for the specific check-in URL
        const checkInUrl = `${window.location.protocol}//${window.location.host}/check-in`;
        setQrValue(checkInUrl);
        QRCode.toDataURL(checkInUrl, { width: 400, margin: 2, color: { dark: '#0F172A', light: '#FFFFFF' } })
            .then(url => setQrImage(url))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic uppercase">Contactless Entry</h1>
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Scan to Self-Register</p>
            </div>

            <div className="p-8 bg-white rounded-[48px] shadow-2xl border border-slate-100 relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-[56px] opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                {qrImage ? (
                    <img src={qrImage} alt="QR Code" className="w-80 h-80 rounded-3xl relative z-10" />
                ) : (
                    <div className="w-80 h-80 bg-slate-50 animate-pulse rounded-3xl" />
                )}
            </div>

            <div className="flex gap-4">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">
                    <Printer size={16} /> Print Standee
                </button>
                <button onClick={() => { navigator.clipboard.writeText(qrValue); alert("Link Copied!"); }} className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    <Copy size={16} /> Copy Link
                </button>
            </div>

            <p className="text-[10px] font-bold text-slate-300 font-mono">{qrValue}</p>
        </div>
    );
}
