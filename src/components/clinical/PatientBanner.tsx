"use client";

import { User, Calendar, Hash, Droplets } from "lucide-react";

export default function PatientBanner() {
  return (
    <div className="bg-white border-b border-olive-200 p-4 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center">
          <User className="text-olive-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-olive-900">Johnathan Doe</h1>
          <div className="flex gap-4 text-sm text-olive-600">
            <span className="flex items-center gap-1"><Calendar size={14}/> 42y (1983-05-12)</span>
            <span className="flex items-center gap-1"><Hash size={14}/> MRN: 98234-AX</span>
            <span className="flex items-center gap-1"><Droplets size={14}/> O Positive</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">Allergy: Penicillin</div>
        <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Fall Risk: High</div>
      </div>
    </div>
  );
}
