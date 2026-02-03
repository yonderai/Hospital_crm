"use client";

import { DollarSign, FileText, CheckCircle, Clock } from "lucide-react";

interface SummaryCardsProps {
    totalSales: number;
    billsGenerated: number;
    totalPaid: number;
    totalPending: number;
}

export default function SummaryCards({ totalSales, billsGenerated, totalPaid, totalPending }: SummaryCardsProps) {
    const cards = [
        {
            title: "Total Sales",
            value: `₹${totalSales.toLocaleString()}`,
            icon: DollarSign,
            color: "emerald",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-600",
            iconColor: "text-emerald-500"
        },
        {
            title: "Bills Generated",
            value: billsGenerated.toString(),
            icon: FileText,
            color: "blue",
            bgColor: "bg-blue-50",
            textColor: "text-blue-600",
            iconColor: "text-blue-500"
        },
        {
            title: "Total Paid",
            value: `₹${totalPaid.toLocaleString()}`,
            icon: CheckCircle,
            color: "green",
            bgColor: "bg-green-50",
            textColor: "text-green-600",
            iconColor: "text-green-500"
        },
        {
            title: "Pending Amount",
            value: `₹${totalPending.toLocaleString()}`,
            icon: Clock,
            color: "orange",
            bgColor: "bg-orange-50",
            textColor: "text-orange-600",
            iconColor: "text-orange-500"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`${card.bgColor} p-6 rounded-2xl border border-${card.color}-100 shadow-sm hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 ${card.bgColor} rounded-xl`}>
                                <Icon size={24} className={card.iconColor} />
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                {card.title}
                            </p>
                            <p className={`text-3xl font-black ${card.textColor}`}>
                                {card.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
