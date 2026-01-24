import Link from "next/link";
import {
    LayoutDashboard,
    CalendarClock,
    TestTube2,
    Microscope,
    FileText,
    LogOut,
    Settings,
    Activity
} from "lucide-react";

export default function PathologyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-10">
                {/* Logo Area */}
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-olive-600 rounded-lg flex items-center justify-center shadow-lg shadow-olive-600/20">
                        <Activity className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tight leading-none">Medicore</h1>
                        <p className="text-[10px] font-bold text-olive-400 uppercase tracking-widest mt-1">Pathology</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <div className="mb-6">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Modules</p>

                        <Link href="/pathology/overview" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
                            <LayoutDashboard size={18} className="group-hover:text-olive-400 transition-colors" />
                            <span className="text-sm font-bold">Overview</span>
                        </Link>

                        <Link href="/pathology/test-scheduling" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
                            <CalendarClock size={18} className="group-hover:text-olive-400 transition-colors" />
                            <span className="text-sm font-bold">Test Scheduling</span>
                        </Link>

                        <Link href="/pathology/sample-tracking" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
                            <TestTube2 size={18} className="group-hover:text-olive-400 transition-colors" />
                            <span className="text-sm font-bold">Sample Tracking</span>
                        </Link>

                        <Link href="/pathology/processing-status" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
                            <Microscope size={18} className="group-hover:text-olive-400 transition-colors" />
                            <span className="text-sm font-bold">Processing Status</span>
                        </Link>

                        <Link href="/pathology/digital-reports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-slate-300 hover:text-white group">
                            <FileText size={18} className="group-hover:text-olive-400 transition-colors" />
                            <span className="text-sm font-bold">Digital Reports</span>
                        </Link>
                    </div>
                </nav>

                {/* User Profile / Logout */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-slate-400 hover:text-white group">
                        <Settings size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
                    </Link>
                    <Link href="/logout" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400 group">
                        <LogOut size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
