"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    UserPlus,
    Stethoscope,
    Ambulance,
    Activity,
    AlertTriangle,
    LogOut,
    Menu
} from "lucide-react";
import { useState } from "react";

export default function EmergencyLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/emergency/dashboard" },
        { name: "Register Patient", icon: <UserPlus size={20} />, path: "/emergency/registration" },
        { name: "Triage & Vitals", icon: <Activity size={20} />, path: "/emergency/triage" },
        { name: "Clinical Workspace", icon: <Stethoscope size={20} />, path: "/emergency/clinical" },
        { name: "Ambulance", icon: <Ambulance size={20} />, path: "/emergency/ambulance" },
        { name: "Alerts", icon: <AlertTriangle size={20} />, path: "/emergency/alerts" },
    ];

    return (
        <div className="min-h-screen bg-slate-900 flex font-sans text-slate-100">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-950 border-r border-slate-800 transition-all duration-300 fixed h-full z-50 flex flex-col`}>
                <div className="p-6 flex items-center justify-between">
                    {sidebarOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <Activity className="text-white" size={20} />
                            </div>
                            <div>
                                <h1 className="text-lg font-black tracking-tight text-white italic">ER PORTAL</h1>
                                <p className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Emergency</p>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                        <Menu size={20} />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? "bg-red-600/20 text-red-500 border border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <div>{item.icon}</div>
                                {sidebarOpen && <span className="font-bold text-sm tracking-wide uppercase">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button onClick={() => signOut()} className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:bg-red-900/20 hover:text-red-500 rounded-xl transition-all group">
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {sidebarOpen && <span className="font-bold text-sm tracking-wide uppercase">Sign Out</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300 min-h-screen bg-slate-900`}>
                <header className="h-16 bg-slate-950/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Operations</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-white">{session?.user?.name || "Dr. Emergency"}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{session?.user?.role || "ER Physician"}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                            <Stethoscope size={20} className="text-slate-400" />
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
