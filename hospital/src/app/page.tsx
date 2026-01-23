"use client";

import {
  Stethoscope,
  UserCircle,
  ShieldCheck,
  Users,
  Beaker,
  Store,
  Wallet,
  UserCog,
  Box,
  User,
  Heart,
  LayoutGrid
} from "lucide-react";
import Link from "next/link";

export default function LoginRoleSelection() {
  const roles = [
    { name: "Doctor", icon: Stethoscope, href: "/login/doctor", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Nurse", icon: UserCircle, href: "/login/nurse", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Admin", icon: ShieldCheck, href: "/login/admin", color: "text-olive-700", bg: "bg-olive-100" },
    { name: "Lab Tech", icon: Beaker, href: "/login/lab-tech", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Pharmacist", icon: Store, href: "/login/pharmacist", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Front Desk", icon: Users, href: "/login/front-desk", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Billing", icon: Wallet, href: "/login/billing", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "HR Manager", icon: UserCog, href: "/login/hr", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Inventory", icon: Box, href: "/login/inventory", color: "text-olive-600", bg: "bg-olive-50" },
    { name: "Patient", icon: User, href: "/login/patient", color: "text-olive-600", bg: "bg-olive-50" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="py-12 px-8 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center">
            <Heart className="text-olive-400" size={28} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Medicore</h1>
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Select Portal</h2>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.2em]">Authorized Access Only</p>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {roles.map((r, i) => (
            <Link key={i} href={r.href} className="group">
              <div className="h-full bg-white border border-slate-100 p-8 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-olive-400 transition-all flex flex-col items-center text-center group-hover:-translate-y-2">
                <div className={`w-16 h-16 ${r.bg} ${r.color} rounded-[24px] flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  <r.icon size={28} />
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{r.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-2 tracking-widest">Portal Access</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-12 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <LayoutGrid size={14} className="text-slate-300" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Medicore Cloud Infrastructure</span>
        </div>
      </footer>
    </div>
  );
}
