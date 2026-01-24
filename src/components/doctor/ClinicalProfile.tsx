"use client";
import { useState } from "react";
import ConsultationForm from "./ConsultationForm";
import PrescriptionForm from "./PrescriptionForm";
import LabOrderForm from "./LabOrderForm";
import RadiologyOrderForm from "./RadiologyOrderForm";
import { User, Activity, FileText, FlaskConical, Pill } from "lucide-react";

export default function ClinicalProfile({ patient, onBack }: { patient: any; onBack: () => void }) {
    const [activeTab, setActiveTab] = useState("consultation");

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-gray-500 hover:text-gray-700 font-medium">
                        &larr; Back to List
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                            <User className="mr-2 text-olive-600" />
                            {patient.firstName} {patient.lastName}
                        </h2>
                        <div className="text-sm text-gray-500 flex space-x-4 mt-1">
                            <span>MRN: {patient.mrn}</span>
                            <span>{new Date().getFullYear() - new Date(patient.dob).getFullYear()} yrs / {patient.gender}</span>
                            <span className="text-red-600 font-medium">Allergies: {patient.allergies.join(", ") || "None"}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400">Last Visit</div>
                    <div className="font-medium text-gray-700">Today</div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-4">
                <button onClick={() => setActiveTab("consultation")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center ${activeTab === 'consultation' ? 'border-olive-600 text-olive-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <FileText size={18} className="mr-2" /> Consultation
                </button>
                <button onClick={() => setActiveTab("prescription")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center ${activeTab === 'prescription' ? 'border-olive-600 text-olive-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <Pill size={18} className="mr-2" /> Prescription
                </button>
                <button onClick={() => setActiveTab("labs")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center ${activeTab === 'labs' ? 'border-olive-600 text-olive-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <FlaskConical size={18} className="mr-2" /> Lab Orders
                </button>
                <button onClick={() => setActiveTab("radiology")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center ${activeTab === 'radiology' ? 'border-olive-600 text-olive-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <Activity size={18} className="mr-2" /> Radiology
                </button>
                <button onClick={() => setActiveTab("timeline")}
                    className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center ${activeTab === 'timeline' ? 'border-olive-600 text-olive-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    <Activity size={18} className="mr-2" /> Timeline
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="max-w-4xl mx-auto">
                    {activeTab === "consultation" && (
                        <ConsultationForm patientId={patient._id} onSuccess={() => { }} />
                    )}
                    {activeTab === "prescription" && (
                        <PrescriptionForm patientId={patient._id} onSuccess={() => { }} />
                    )}
                    {activeTab === "labs" && (
                        <LabOrderForm patientId={patient._id} onSuccess={() => { }} />
                    )}
                    {activeTab === "radiology" && (
                        <RadiologyOrderForm patientId={patient._id} onSuccess={() => { }} />
                    )}
                    {activeTab === "timeline" && (
                        <div className="text-center py-10 text-gray-500">
                            <Activity size={48} className="mx-auto mb-2 opacity-20" />
                            <p>Clinical timeline feature coming soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
