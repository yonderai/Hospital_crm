"use client";

import { Sparkles, CheckCircle, Info, ExternalLink } from "lucide-react";

const suggestions = [
    {
        type: "Order",
        title: "HbA1c Laboratory Test",
        reason: "Patient has history of hyperglycemia and last test was 7 months ago.",
        confidence: 0.94
    },
    {
        type: "Medication",
        title: "Adjust Metformin Dosage",
        reason: "Current glucose trends suggest dosage could be optimized to 1000mg BID.",
        confidence: 0.88
    },
    {
        type: "Documentation",
        title: "Address Family History",
        reason: "Missing documentation for cardiovascular family history in problem list.",
        confidence: 0.75
    }
];

export default function AISuggestions() {
    return (
        <div className="w-80 bg-olive-50 border-l border-olive-200 h-full flex flex-col">
            <div className="p-4 border-b border-olive-200 flex items-center gap-2 bg-olive-100">
                <Sparkles size={18} className="text-olive-600" />
                <h2 className="font-bold text-olive-900">AI Assistant</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="text-xs font-semibold text-olive-500 uppercase tracking-wider mb-2">Smart Suggestions</div>
                {suggestions.map((s, i) => (
                    <div key={i} className="bg-white border border-olive-200 rounded-lg p-3 shadow-sm hover:border-olive-400 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-bold bg-olive-100 text-olive-700 px-2 py-0.5 rounded uppercase">
                                {s.type}
                            </span>
                            <span className="text-[10px] text-olive-400">{Math.round(s.confidence * 100)}% Match</span>
                        </div>
                        <h3 className="text-sm font-bold text-olive-900 mb-1">{s.title}</h3>
                        <p className="text-xs text-olive-600 leading-relaxed mb-3">{s.reason}</p>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-olive-600 text-white text-[11px] py-1.5 rounded flex items-center justify-center gap-1 hover:bg-olive-700">
                                <CheckCircle size={12} /> Accept
                            </button>
                            <button className="flex-1 border border-olive-200 text-olive-600 text-[11px] py-1.5 rounded flex items-center justify-center gap-1 hover:bg-olive-100">
                                <Info size={12} /> Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-olive-100 mt-auto border-t border-olive-200">
                <div className="flex items-center gap-2 text-xs text-olive-700">
                    <ExternalLink size={14} />
                    <span>Model: Clinical-Llama-70B</span>
                </div>
            </div>
        </div>
    );
}
