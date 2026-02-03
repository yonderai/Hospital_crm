"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

interface PaymentModeChartProps {
    data: {
        cash: number;
        upi: number;
        card: number;
        insurance: {
            total: number;
            approved: number;
            pending: number;
        };
    };
}

export default function PaymentModeChart({ data }: PaymentModeChartProps) {
    const chartData = [
        { name: "Cash", value: data.cash, color: "#10b981" },
        { name: "UPI", value: data.upi, color: "#3b82f6" },
        { name: "Card", value: data.card, color: "#8b5cf6" },
        { name: "Insurance", value: data.insurance.total, color: "#f59e0b" }
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
                        {payload[0].payload.name}
                    </p>
                    <p className="text-lg font-black text-slate-900">
                        ₹{payload[0].value.toLocaleString()}
                    </p>
                    {payload[0].payload.name === "Insurance" && (
                        <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-500">Approved:</span>
                                <span className="font-bold text-green-600">₹{data.insurance.approved.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between gap-4 mt-1">
                                <span className="text-slate-500">Pending:</span>
                                <span className="font-bold text-orange-600">₹{data.insurance.pending.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Payment Mode Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
