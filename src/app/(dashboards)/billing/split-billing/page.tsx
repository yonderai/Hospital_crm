"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import {
    IndianRupee, Calculator, User, FileText,
    CheckCircle2, AlertCircle, ShieldCheck,
    CreditCard, Printer
} from "lucide-react";
import { calculateInsuranceSplit, BillableItem, InsurancePolicy } from "@/lib/insuranceCalculator";

// Mock Data
const MOCK_PATIENS = [
    { id: "MRN-2025-000001", name: "Rajesh Kumar", insurance: { provider: "Bajaj Allianz", policyNumber: "POL123", sumInsured: 500000, coPayment: 500, deductible: 2000, coInsurancePercentage: 10, coverageType: "comprehensive" } },
    { id: "MRN-2025-000002", name: "Sarah khan", insurance: null }, // Self pay
];

const SERVICE_CATALOG = [
    { code: "C001", description: "General Consultation", cost: 1500, isInsuranceCovered: true },
    { code: "L001", description: "Blood Panel (Complete)", cost: 3500, isInsuranceCovered: true },
    { code: "R001", description: "MRI Scan", cost: 12000, isInsuranceCovered: true },
    { code: "P001", description: "Vitamins/Supplements", cost: 2500, isInsuranceCovered: false }, // Not covered
    { code: "S001", description: "Minor Surgery", cost: 45000, isInsuranceCovered: true },
];

export default function SplitBillingPage() {
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [selectedItems, setSelectedItems] = useState<BillableItem[]>([]);
    const [calculation, setCalculation] = useState<any>(null);
    const [patientSearch, setPatientSearch] = useState("");

    const handleAddItem = (e: any) => {
        const code = e.target.value;
        const item = SERVICE_CATALOG.find(i => i.code === code);
        if (item) {
            setSelectedItems([...selectedItems, { ...item }]);
            setCalculation(null); // Reset calculation on change
        }
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...selectedItems];
        newItems.splice(index, 1);
        setSelectedItems(newItems);
        setCalculation(null);
    };

    const handleCalculate = () => {
        if (!selectedPatient) return;

        if (selectedPatient.insurance) {
            const result = calculateInsuranceSplit(selectedItems, selectedPatient.insurance);
            setCalculation(result);
        } else {
            // Self Pay Logic
            const total = selectedItems.reduce((sum, i) => sum + i.cost, 0);
            setCalculation({
                totalBillAmount: total,
                insuranceCoveredAmount: 0,
                totalInsurancePayable: 0,
                totalPatientPayable: total,
                breakdown: {
                    deductibleApplied: 0,
                    coPayApplied: 0,
                    coInsuranceApplied: 0,
                    baseInsuranceAmount: 0
                }
            });
        }
    };

    const handlePatientSelect = (p: any) => {
        setSelectedPatient(p);
        setPatientSearch(p.name);
        setCalculation(null);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Split Billing Console</h2>
                        <p className="text-olive-600 text-[10px] font-black mt-1 uppercase tracking-[0.3em]">Insurance & Patient Liability</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                        <FileText size={16} /> Past Invoices
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Input */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Patient Selection */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <User size={16} className="text-olive-600" /> Patient Details
                            </h3>
                            <div className="relative">
                                <input
                                    value={patientSearch}
                                    onChange={(e) => setPatientSearch(e.target.value)}
                                    placeholder="Search by MN or Name..."
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-olive-500/20"
                                />
                                {/* Simple Mock Dropdown for demo */}
                                {patientSearch && !selectedPatient && (
                                    <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl border border-slate-100 mt-2 z-50 p-2">
                                        {MOCK_PATIENS.filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase())).map(p => (
                                            <div
                                                key={p.id}
                                                onClick={() => handlePatientSelect(p)}
                                                className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center"
                                            >
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.id}</p>
                                                </div>
                                                {p.insurance ? (
                                                    <span className="px-2 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase rounded-lg">Insured</span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-orange-50 text-orange-700 text-[10px] font-black uppercase rounded-lg">Self-Pay</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedPatient && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center animate-in fade-in">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Payer Type</p>
                                        <p className="font-black text-slate-900 text-lg">
                                            {selectedPatient.insurance ? selectedPatient.insurance.provider : "Self-Pay (Cash/Card)"}
                                        </p>
                                    </div>
                                    {selectedPatient.insurance && (
                                        <div className="text-right">
                                            <p className="text-[10px] uppercase font-bold text-slate-400">Sum Assured</p>
                                            <p className="font-black text-olive-600 text-lg">₹{selectedPatient.insurance.sumInsured.toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bill Items */}
                        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <FileText size={16} className="text-olive-600" /> Billable Services
                                </h3>
                                <select
                                    className="p-2 border border-slate-200 rounded-lg text-xs font-bold bg-white"
                                    onChange={handleAddItem}
                                    value=""
                                >
                                    <option value="">+ Add Service</option>
                                    {SERVICE_CATALOG.map(s => (
                                        <option key={s.code} value={s.code}>{s.description} (₹{s.cost})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                {selectedItems.length === 0 && (
                                    <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl text-slate-400 font-bold text-sm">
                                        No items added to bill.
                                    </div>
                                )}
                                {selectedItems.map((item: any, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-xl group hover:border-olive-200 transition-all">
                                        <div>
                                            <p className="font-bold text-slate-800">{item.description}</p>
                                            <div className="flex gap-2 mt-1">
                                                <span className="text-xs text-slate-400 font-mono">{item.code}</span>
                                                {item.isInsuranceCovered ? (
                                                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-1.5 rounded-md">Covered</span>
                                                ) : (
                                                    <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-1.5 rounded-md">Excluded</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-black text-slate-900">₹{item.cost.toLocaleString()}</span>
                                            <button
                                                onClick={() => handleRemoveItem(idx)}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedItems.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bill Amount</p>
                                        <p className="text-3xl font-black text-slate-900">
                                            ₹{selectedItems.reduce((s, i) => s + i.cost, 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleCalculate}
                            disabled={!selectedPatient || selectedItems.length === 0}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-3"
                        >
                            <Calculator size={20} /> Calculate Split
                        </button>

                    </div>

                    {/* RIGHT COLUMN: Results */}
                    <div className="lg:col-span-1">
                        {calculation ? (
                            <div className="bg-olive-600 text-white p-8 rounded-[40px] shadow-2xl shadow-olive-600/30 h-full flex flex-col animate-in slide-in-from-bottom-4">
                                <div className="mb-8">
                                    <h3 className="text-2xl font-black flex items-center gap-3">
                                        <ShieldCheck size={28} className="text-olive-200" /> Bill Split
                                    </h3>
                                    <p className="text-olive-100 font-medium text-sm mt-2">Breakdown of liability based on policy terms.</p>
                                </div>

                                <div className="space-y-6 flex-1">
                                    {/* Insurance Share */}
                                    <div className="bg-white/10 p-6 rounded-3xl border border-white/10">
                                        <p className="text-[10px] font-black text-olive-200 uppercase tracking-widest mb-1">Insurance Payable</p>
                                        <p className="text-4xl font-black tracking-tight">₹{calculation.totalInsurancePayable.toLocaleString()}</p>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-olive-100/60">
                                                <span>Base Coverage</span>
                                                <span>₹{calculation.breakdown.baseInsuranceAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient Share */}
                                    <div className="bg-white p-6 rounded-3xl text-slate-900 shadow-lg">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient Payable</p>
                                        <p className="text-4xl font-black tracking-tight text-slate-900">₹{calculation.totalPatientPayable.toLocaleString()}</p>

                                        <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                                            {calculation.breakdown.deductibleApplied > 0 && (
                                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                                    <span className="flex items-center gap-1.5"><AlertCircle size={12} className="text-orange-500" /> Deductible</span>
                                                    <span>+ ₹{calculation.breakdown.deductibleApplied.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {calculation.breakdown.coPayApplied > 0 && (
                                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                                    <span className="flex items-center gap-1.5"><AlertCircle size={12} className="text-orange-500" /> Co-Pay</span>
                                                    <span>+ ₹{calculation.breakdown.coPayApplied.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {calculation.breakdown.coInsuranceApplied > 0 && (
                                                <div className="flex justify-between text-xs font-bold text-slate-500">
                                                    <span className="flex items-center gap-1.5"><AlertCircle size={12} className="text-orange-500" /> Co-Insurance</span>
                                                    <span>+ ₹{calculation.breakdown.coInsuranceApplied.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>Non-Covered Items</span>
                                                <span>+ ₹{(calculation.totalBillAmount - calculation.insuranceCoveredAmount).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-white/10 space-y-3">
                                    <button className="w-full py-4 bg-white text-olive-700 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-olive-50 transition-all flex items-center justify-center gap-2">
                                        Generate Invoice <Printer size={16} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-100 h-full rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <Calculator size={48} className="mb-4 opacity-50" />
                                <h3 className="text-lg font-black text-slate-500">Ready to Calculate</h3>
                                <p className="text-sm">Select patient and add items to see payment breakdown.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
