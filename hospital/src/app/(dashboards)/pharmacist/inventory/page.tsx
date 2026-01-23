"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { Package, Search, Plus, AlertTriangle } from "lucide-react";

export default function PharmacistInventory() {
    return (
        <DashboardLayout>
            <div className="space-y-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Drug Inventory</h2>
                        <p className="text-slate-500 text-sm font-medium mt-1 uppercase tracking-widest">STOCK ANALYSIS • CONTROLLED SUBSTANCES</p>
                    </div>
                </div>
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-olive-50 text-olive-600 rounded-3xl flex items-center justify-center mx-auto">
                        <Package size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">Pharmacy Stock Ledger</h3>
                    <p className="text-slate-500 max-w-md mx-auto">Track medication stock levels, expiry dates, and automated reorder triggers.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
