"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Activity, LayoutGrid, Search, Filter } from "lucide-react";

interface ModulePageProps {
    title: string;
    subtitle: string;
    description: string;
    icon: any;
}

export default function GenericModulePage({ title, subtitle, description, icon: Icon }: ModulePageProps) {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{title}</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">{subtitle}</p>
                    </div>
                </div>
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-16 text-center space-y-8">
                    <div className="w-24 h-24 bg-olive-50 text-olive-600 rounded-[32px] flex items-center justify-center mx-auto shadow-sm">
                        <Icon size={48} />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-2xl font-black text-slate-900">{title} System Active</h3>
                        <p className="text-slate-500 max-w-lg mx-auto leading-relaxed">{description}</p>
                    </div>
                    <div className="pt-4 flex justify-center gap-4">
                        <button className="px-8 py-3 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">Export Data</button>
                        <button className="px-8 py-3 bg-olive-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-olive-600/20 hover:bg-olive-800 transition-all">Configure Link</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
