"use client";

import { useSession } from "next-auth/react";
import { User, Mail, Shield, Building } from "lucide-react";

export default function MaintenanceProfilePage() {
    const { data: session } = useSession();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-8">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-olive-100 rounded-full flex items-center justify-center text-olive-600 text-3xl font-black border-4 border-white shadow-lg">
                        {session?.user?.name?.[0] || "U"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{session?.user?.name || "Maintenance Staff"}</h2>
                        <p className="text-sm font-bold text-olive-600 uppercase tracking-widest bg-olive-50 px-3 py-1 rounded-full inline-block mt-2">Maintenance Staff</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                            <p className="text-slate-900 font-medium">{session?.user?.email || "user@hospital.com"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                            <Building size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Department</p>
                            <p className="text-slate-900 font-medium">Facilities & Maintenance</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                            <Shield size={20} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Access Level</p>
                            <p className="text-slate-900 font-medium">Restricted (Level 2)</p>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                    <button className="text-olive-600 font-bold hover:text-olive-700 hover:underline">Change Password</button>
                </div>
            </div>
        </div>
    );
}
