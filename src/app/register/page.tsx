import SelfRegistrationForm from "@/components/SelfRegistrationForm";
import { Cross } from "lucide-react";

export default function PublicRegistrationPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden">
                {/* Brand Header */}
                <div className="bg-slate-900 p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="p-2 bg-olive-500 rounded-lg">
                            <Cross className="text-white rotate-45" size={20} />
                        </div>
                        <h1 className="text-xl font-black text-white tracking-tight">MEDICORE</h1>
                    </div>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Patient Portal</p>
                </div>

                {/* Form Container */}
                <div className="p-8">
                    <SelfRegistrationForm />
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">© 2026 Medicore Hospital. <br />Need help? Call +1-800-MEDICORE</p>
                </div>
            </div>
        </div>
    );
}
