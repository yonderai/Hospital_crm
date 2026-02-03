"use client";

import { Calendar } from "lucide-react";
import { useState } from "react";

interface DateRangeFilterProps {
    onDateChange: (preset: string, startDate?: string, endDate?: string) => void;
    currentPreset: string;
}

export default function DateRangeFilter({ onDateChange, currentPreset }: DateRangeFilterProps) {
    const [showCustom, setShowCustom] = useState(false);
    const [customStart, setCustomStart] = useState("");
    const [customEnd, setCustomEnd] = useState("");

    const presets = [
        { label: "Today", value: "today" },
        { label: "Yesterday", value: "yesterday" },
        { label: "Last 7 Days", value: "last7days" },
        { label: "Last 30 Days", value: "last30days" },
    ];

    const handlePresetClick = (preset: string) => {
        setShowCustom(false);
        onDateChange(preset);
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            onDateChange("custom", customStart, customEnd);
            setShowCustom(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Date Range</span>
                </div>

                <div className="flex gap-2 flex-wrap">
                    {presets.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => handlePresetClick(preset.value)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${currentPreset === preset.value
                                    ? "bg-emerald-500 text-white shadow-md"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                }`}
                        >
                            {preset.label}
                        </button>
                    ))}

                    <button
                        onClick={() => setShowCustom(!showCustom)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${currentPreset === "custom"
                                ? "bg-emerald-500 text-white shadow-md"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                    >
                        Custom Range
                    </button>
                </div>
            </div>

            {showCustom && (
                <div className="mt-4 flex items-end gap-3 p-4 bg-slate-50 rounded-xl">
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                            From Date
                        </label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                            To Date
                        </label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <button
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
