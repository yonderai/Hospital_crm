import PatientRegistrationForm from "@/components/PatientRegistrationForm";

export default function FrontDeskRegistrationPage() {
    return (
        <div className="space-y-10">
            <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">REGISTRATION</h2>
                <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">PORTAL</p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <PatientRegistrationForm />
            </div>
        </div>
    );
}
