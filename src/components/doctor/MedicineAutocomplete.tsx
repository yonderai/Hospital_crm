"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, AlertCircle } from "lucide-react";

interface MedicineAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (item: any) => void;
    placeholder?: string;
    className?: string;
}

export default function MedicineAutocomplete({
    value,
    onChange,
    onSelect,
    placeholder = "Search medicine...",
    className = ""
}: MedicineAutocompleteProps) {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchMedicines = async (query: string) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/api/pharmacy/inventory?search=${encodeURIComponent(query)}&category=medication`);
            if (res.ok) {
                const data = await res.json();
                setSuggestions(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch medicines", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);
        setShowSuggestions(true);

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }

        debounceTimeout.current = setTimeout(() => {
            fetchMedicines(newValue);
        }, 300);
    };

    const handleSelect = (item: any) => {
        onChange(item.name);
        if (onSelect) {
            onSelect(item);
        }
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (value.length >= 2) setShowSuggestions(true);
                    }}
                    placeholder={placeholder}
                    className="w-full bg-white border border-slate-100 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-olive-500 transition-all shadow-sm pr-10"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                </div>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto">
                    {suggestions.map((item) => (
                        <button
                            key={item._id}
                            onClick={() => handleSelect(item)}
                            className="w-full px-6 py-3 text-left hover:bg-slate-50 flex justify-between items-center group transition-colors border-b border-slate-50 last:border-0"
                        >
                            <div>
                                <p className="text-sm font-bold text-slate-900 group-hover:text-olive-700">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                    {item.genericName || 'Unit: ' + item.unit}
                                </p>
                            </div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase ${item.quantityOnHand > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                {item.quantityOnHand > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {showSuggestions && value.length >= 2 && suggestions.length === 0 && !loading && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 text-center">
                    <p className="text-xs font-bold text-slate-400 italic">No medicines found</p>
                </div>
            )}
        </div>
    );
}
