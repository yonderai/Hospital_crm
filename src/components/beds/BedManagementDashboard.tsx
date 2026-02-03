"use client";

import { useState, useEffect } from "react";
import { BedDouble, Activity, Filter, RefreshCcw, User, QrCode, Printer, Bell, FileText, ArrowRight, X, LogOut, Search, Calendar, Clock, CreditCard } from "lucide-react";

interface Bed {
    _id: string;
    bedNumber: string;
    roomNumber: string;
    floor: string;
    ward: string;
    type: string;
    status: "available" | "occupied" | "maintenance";
    currentPatientId?: {
        _id: string;
        firstName: string;
        lastName: string;
        mrn: string;
        dob: string;
        gender: string;
        assignedDoctorId?: { firstName: string; lastName: string };
    };
    dailyRate: number;
    updatedAt: string;
}

export default function BedManagementDashboard() {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({ floor: "All", status: "All", type: "All" });

    const fetchBeds = async () => {
        setLoading(true);
        try {
            // Silently try to seed if needed, ignore errors
            try { await fetch('/api/beds', { method: 'POST' }); } catch (e) { /* ignore */ }

            const params = new URLSearchParams(filters);
            const res = await fetch(`/api/beds?${params.toString()}`);
            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${res.status}`);
            }
            const data = await res.json();

            if (Array.isArray(data)) {
                setBeds(data);
            } else {
                console.error("API returned non-array:", data);
                setBeds([]);
            }
        } catch (error) {
            console.error("Failed to fetch beds", error);
            setBeds([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBeds();
    }, [filters]);

    // Stats
    const total = beds.length;
    const occupied = beds.filter(b => b.status === 'occupied').length;
    const available = beds.filter(b => b.status === 'available').length;
    const maintenance = beds.filter(b => b.status === 'maintenance').length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

    // Grouping
    const floors = ["1st Floor", "2nd Floor", "3rd Floor"];
    const groupedBeds = floors.map(floor => ({
        name: floor,
        rooms: Object.entries(
            beds.filter(b => b.floor === floor).reduce((acc: any, bed) => {
                const room = bed.roomNumber;
                if (!acc[room]) acc[room] = [];
                acc[room].push(bed);
                return acc;
            }, {})
        ).sort((a: any, b: any) => a[0].localeCompare(b[0]))
    }));

    // --- STATE ---
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null); // For Allocation
    const [focusedBed, setFocusedBed] = useState<Bed | null>(null);   // For Details (Occupied)

    // Allocation State
    const [patientQuery, setPatientQuery] = useState("");
    const [foundPatient, setFoundPatient] = useState<any>(null);
    const [allocating, setAllocating] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [allocationDetails, setAllocationDetails] = useState({
        admissionType: "Planned Admission",
        admissionDate: new Date().toISOString().split('T')[0],
        admissionTime: "10:30",
        expectedDischarge: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nurse: "",
        notes: ""
    });

    // --- HANDLERS ---
    const handlePatientSearch = () => {
        if (patientQuery.toLowerCase().includes("rajesh")) {
            setFoundPatient({
                _id: "pat_123",
                name: "Rajesh Kumar",
                mrn: "MRN-2025-000123",
                age: 45,
                gender: "Male",
                doctor: "Dr. Amit Sharma"
            });
        } else {
            alert("Patient not found (Try 'Rajesh')");
        }
    };

    const handleAllocate = async () => {
        if (!foundPatient || !selectedBed) return;
        setAllocating(true);
        try {
            const res = await fetch('/api/beds/allocate', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bedId: selectedBed._id,
                    patientId: foundPatient._id,
                    ...allocationDetails
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccessData(data);
            fetchBeds();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setAllocating(false);
        }
    };

    const handleDischarge = async () => {
        if (!focusedBed) return;
        if (!confirm("Are you sure you want to discharge this patient?")) return;
        try {
            const res = await fetch('/api/beds/discharge', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bedId: focusedBed._id })
            });
            if (!res.ok) throw new Error("Discharge failed");
            setFocusedBed(null);
            fetchBeds();
            alert("Patient discharged successfully");
        } catch (error: any) {
            alert(error.message);
        }
    };

    const resetAllocation = () => {
        setSelectedBed(null);
        setFoundPatient(null);
        setPatientQuery("");
        setSuccessData(null);
        setAllocationDetails({
            admissionType: "Planned Admission",
            admissionDate: new Date().toISOString().split('T')[0],
            admissionTime: "10:30",
            expectedDischarge: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            nurse: "",
            notes: ""
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in relative font-sans">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total Beds</p>
                    <p className="text-3xl font-black text-slate-900">{total}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-green-600 text-xs font-bold uppercase tracking-widest mb-2">Available</p>
                    <p className="text-3xl font-black text-green-600">{available} <span className="text-sm text-slate-400 font-medium">({total > 0 ? Math.round(available / total * 100) : 0}%)</span></p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-2">Occupied</p>
                    <p className="text-3xl font-black text-red-500">{occupied} <span className="text-sm text-slate-400 font-medium">({occupancyRate}%)</span></p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-2">Maintenance</p>
                    <p className="text-3xl font-black text-orange-500">{maintenance}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 font-bold mr-4">
                    <Filter size={18} /> Filters:
                </div>
                <select value={filters.floor} onChange={e => setFilters({ ...filters, floor: e.target.value })} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                    <option value="All">All Floors</option>
                    {floors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none">
                    <option value="All">All Status</option>
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                </select>
                <button onClick={fetchBeds} className="ml-auto p-2 bg-slate-50 rounded-xl hover:bg-slate-100 text-slate-500">
                    <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            {/* Grid */}
            <div className="space-y-8">
                {groupedBeds.map((floor) => (
                    floor.rooms.length > 0 && (
                        <div key={floor.name} className="space-y-4">
                            <h3 className="text-lg font-black text-slate-800 bg-slate-100 inline-block px-4 py-1 rounded-lg">
                                {floor.name}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {(floor.rooms as [string, Bed[]][]).map(([roomNum, roomBeds]) => (
                                    <div key={roomNum} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-4 border-b border-slate-50 pb-2">
                                            <span className="font-bold text-slate-900">Room {roomNum}</span>
                                            <span className="text-xs font-bold text-slate-400 capitalize">{roomBeds[0].ward}</span>
                                        </div>
                                        <div className="space-y-3">
                                            {roomBeds.map(bed => (
                                                <div
                                                    key={bed._id}
                                                    onClick={() => {
                                                        if (bed.status === 'available') setSelectedBed(bed);
                                                        if (bed.status === 'occupied') setFocusedBed(bed);
                                                    }}
                                                    className={`
                                                        flex items-center justify-between group rounded-xl p-2 transition-all cursor-pointer hover:bg-slate-50 hover:scale-[1.02] active:scale-95
                                                    `}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2 rounded-lg 
                                                            ${bed.status === 'available' ? 'bg-green-100 text-green-600' : ''}
                                                            ${bed.status === 'occupied' ? 'bg-red-100 text-red-600' : ''}
                                                            ${bed.status === 'maintenance' ? 'bg-orange-100 text-orange-600' : ''}`}>
                                                            <BedDouble size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-700">{bed.bedNumber}</p>
                                                            <p className={`text-[10px] font-bold uppercase ${bed.status === 'available' ? 'text-green-500' :
                                                                bed.status === 'occupied' ? 'text-red-500' : 'text-orange-500'
                                                                }`}>{bed.status}</p>
                                                        </div>
                                                    </div>
                                                    {bed.status === 'occupied' && (
                                                        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                                                            <User size={12} /> {bed.currentPatientId ? bed.currentPatientId.firstName : "Patient"}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* --- ALLOCATION MODAL --- */}
            {selectedBed && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
                    {!successData ? (
                        <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold">Allocate Bed</h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-2"><BedDouble size={14} /> {selectedBed.floor} • Room {selectedBed.roomNumber}</p>
                                </div>
                                <div className="bg-white/10 px-4 py-2 rounded-xl text-lg font-bold font-mono border border-white/20">
                                    {selectedBed.bedNumber}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                {/* Search Section */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Patient</label>
                                    {!foundPatient ? (
                                        <div className="space-y-3">
                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                                                    <input
                                                        value={patientQuery}
                                                        onChange={e => setPatientQuery(e.target.value)}
                                                        placeholder="Name, MRN, or Phone"
                                                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700 focus:ring-2 focus:ring-slate-200 transition-all"
                                                    />
                                                </div>
                                                <button onClick={handlePatientSearch} className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Search</button>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-px bg-slate-100 flex-1"></div>
                                                <span className="text-xs font-bold text-slate-400">OR</span>
                                                <div className="h-px bg-slate-100 flex-1"></div>
                                            </div>
                                            <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                                                <QrCode size={18} /> Scan Patient QR Code
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-olive-50 border border-olive-200 p-4 rounded-2xl relative">
                                            <button onClick={() => setFoundPatient(null)} className="absolute top-4 right-4 text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-red-100 shadow-sm"><X size={12} /> Change</button>
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center text-olive-600 font-bold text-xl">
                                                    {foundPatient.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-lg">{foundPatient.name}</p>
                                                    <p className="text-xs font-bold text-olive-600 font-mono mb-1">{foundPatient.mrn}</p>
                                                    <p className="text-xs text-slate-500 font-bold">{foundPatient.age} Yrs • {foundPatient.gender} • {foundPatient.doctor}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Admission Details */}
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admission Type</label>
                                        <div className="grid grid-cols-1 gap-2">
                                            {["Planned Admission", "Emergency Admission", "ICU Transfer"].map(type => (
                                                <label key={type} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${allocationDetails.admissionType === type ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                                    <input type="radio" name="admType" className="hidden" checked={allocationDetails.admissionType === type} onChange={() => setAllocationDetails({ ...allocationDetails, admissionType: type })} />
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${allocationDetails.admissionType === type ? 'border-white' : 'border-slate-300'}`}>
                                                        {allocationDetails.admissionType === type && <div className="w-2 h-2 rounded-full bg-white" />}
                                                    </div>
                                                    <span className="font-bold text-sm">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admit Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                                <input type="date" value={allocationDetails.admissionDate} onChange={e => setAllocationDetails({ ...allocationDetails, admissionDate: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admit Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-3 text-slate-400" size={16} />
                                                <input type="time" value={allocationDetails.admissionTime} onChange={e => setAllocationDetails({ ...allocationDetails, admissionTime: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expected Discharge</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-3 text-slate-400" size={16} />
                                            <input type="date" value={allocationDetails.expectedDischarge} onChange={e => setAllocationDetails({ ...allocationDetails, expectedDischarge: e.target.value })} className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none" />
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase">Bed Charges</p>
                                            <p className="text-xl font-black text-slate-900">₹{selectedBed.dailyRate.toLocaleString()}<span className="text-xs font-bold text-slate-400">/day</span></p>
                                        </div>
                                        <CreditCard className="text-slate-300" size={24} />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Admission Notes</label>
                                        <textarea
                                            value={allocationDetails.notes}
                                            onChange={e => setAllocationDetails({ ...allocationDetails, notes: e.target.value })}
                                            rows={2}
                                            placeholder="Medical requirements, observations..."
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-sm outline-none resize-none"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Nurse</label>
                                        <select
                                            value={allocationDetails.nurse}
                                            onChange={e => setAllocationDetails({ ...allocationDetails, nurse: e.target.value })}
                                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none"
                                        >
                                            <option value="">Select Primary Nurse</option>
                                            <option>Nurse Kavita</option>
                                            <option>Nurse Sarah</option>
                                            <option>Nurse John</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
                                <button onClick={resetAllocation} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                                <button
                                    onClick={handleAllocate}
                                    disabled={!foundPatient || allocating}
                                    className="flex-[2] py-3 bg-olive-600 text-white font-bold rounded-xl hover:bg-olive-700 shadow-xl shadow-olive-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    {allocating ? "Allocating..." : <><ArrowRight size={18} /> Allocate Bed</>}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // SUCCESS VIEW
                        <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl p-8 text-center space-y-8 animate-in zoom-in-95">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <BedDouble size={48} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-black text-slate-900 mb-2">Bed Allocated!</h3>
                                <p className="text-slate-500 font-medium">Patient successfully admitted to ward.</p>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-3xl text-left space-y-3 border border-slate-200">
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium text-sm">Bed</span>
                                    <span className="font-bold text-slate-900">{successData.details.bed}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium text-sm">Patient</span>
                                    <span className="font-bold text-slate-900">{successData.details.patient}</span>
                                </div>
                                <div className="flex justify-between border-b border-slate-100 pb-2">
                                    <span className="text-slate-500 font-medium text-sm">Admission</span>
                                    <span className="font-bold text-slate-900">{allocationDetails.admissionDate}, {allocationDetails.admissionTime}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium text-sm">Nurse</span>
                                    <span className="font-bold text-slate-900">{successData.details.nurse || "Unassigned"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => window.print()} className="py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <Printer size={16} /> Print Form
                                </button>
                                <button onClick={() => alert("Notification sent to duty nurse.")} className="py-3 px-4 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2">
                                    <Bell size={16} /> Notify Nurse
                                </button>
                                <button onClick={() => {
                                    setFocusedBed(selectedBed);
                                    setSuccessData(null);
                                    setSelectedBed(null);
                                }} className="col-span-2 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                                    <FileText size={18} /> View Bed Details
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* --- BED DETAILS MODAL (OCCUPIED) --- */}
            {focusedBed && focusedBed.status === 'occupied' && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">
                        <button onClick={() => setFocusedBed(null)} className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors">
                            <X size={20} className="text-slate-600" />
                        </button>

                        <div className="p-8 pb-0">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                                    <BedDouble size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900">Room {focusedBed.roomNumber}</h3>
                                    <p className="font-bold text-slate-400">Bed {focusedBed.bedNumber} • <span className="text-red-500 uppercase tracking-wider text-xs bg-red-50 px-2 py-1 rounded-lg">Occupied</span></p>
                                </div>
                            </div>

                            {focusedBed.currentPatientId && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Patient Information</p>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center font-black text-slate-700 text-lg">
                                                {focusedBed.currentPatientId.firstName.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg text-slate-900">{focusedBed.currentPatientId.firstName} {focusedBed.currentPatientId.lastName}</p>
                                                <p className="text-xs font-bold font-mono text-slate-500 mb-1">MRN: {focusedBed.currentPatientId.mrn || "N/A"}</p>
                                                <p className="text-sm font-medium text-slate-600">
                                                    {focusedBed.currentPatientId.gender} • {new Date().getFullYear() - new Date(focusedBed.currentPatientId.dob).getFullYear()} Years
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 border border-slate-100 rounded-2xl">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Admitted</p>
                                            <p className="font-bold text-slate-900">
                                                {new Date(focusedBed.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                <span className="text-slate-400 font-medium text-xs ml-1">
                                                    {new Date(focusedBed.updatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="p-4 border border-slate-100 rounded-2xl">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Doctor</p>
                                            <p className="font-bold text-slate-900">
                                                {focusedBed.currentPatientId.assignedDoctorId
                                                    ? `Dr. ${focusedBed.currentPatientId.assignedDoctorId.firstName} ${focusedBed.currentPatientId.assignedDoctorId.lastName}`
                                                    : "Dr. Unassigned"}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Bed Charges</p>
                                        <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-2">
                                            <span className="text-slate-600 font-medium">Daily Rate</span>
                                            <span className="font-bold text-slate-900">₹{focusedBed.dailyRate.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-2">
                                            <span className="text-slate-600 font-medium">Days Occupied</span>
                                            <span className="font-bold text-slate-900">
                                                {Math.max(1, Math.ceil((new Date().getTime() - new Date(focusedBed.updatedAt).getTime()) / (1000 * 60 * 60 * 24)))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <span className="text-slate-900 font-black">Total</span>
                                            <span className="font-black text-xl text-olive-600">
                                                ₹{(Math.max(1, Math.ceil((new Date().getTime() - new Date(focusedBed.updatedAt).getTime()) / (1000 * 60 * 60 * 24))) * focusedBed.dailyRate).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-100 mt-8 grid grid-cols-2 gap-3">
                            <button onClick={() => alert("Transfer feature coming soon")} className="py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Transfer Bed</button>
                            <button onClick={() => alert("Chart feature coming soon")} className="py-3 font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">View Chart</button>
                            <button onClick={handleDischarge} className="col-span-2 py-4 font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2">
                                <LogOut size={18} /> Discharge Patient
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
