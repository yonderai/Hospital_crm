"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface TrendChartProps {
    data: Array<{
        _id: string;
        sales: number;
        pending: number;
        count: number;
    }>;
}

export default function TrendChart({ data }: TrendChartProps) {
    const chartData = data.map((item) => ({
        date: new Date(item._id).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        sales: item.sales,
        pending: item.pending,
        total: item.sales + item.pending
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-100">
                    <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">{label}</p>
                    <div className="space-y-1">
                        <div className="flex justify-between gap-6">
                            <span className="text-xs text-slate-500">Completed:</span>
                            <span className="text-sm font-bold text-emerald-600">
                                ₹{payload[0]?.value?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between gap-6">
                            <span className="text-xs text-slate-500">Pending:</span>
                            <span className="text-sm font-bold text-orange-600">
                                ₹{payload[1]?.value?.toLocaleString()}
                            </span>
                        </div>
                        <div className="flex justify-between gap-6 pt-2 border-t border-slate-100">
                            <span className="text-xs text-slate-600 font-semibold">Total:</span>
                            <span className="text-sm font-black text-slate-900">
                                ₹{payload[2]?.value?.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">
                Daily Sales Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                        dataKey="date"
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                        tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                        axisLine={{ stroke: "#e2e8f0" }}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                        wrapperStyle={{ paddingTop: "20px" }}
                        iconType="circle"
                        formatter={(value) => (
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{value}</span>
                        )}
                    />
                    <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: "#10b981", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Completed"
                    />
                    <Line
                        type="monotone"
                        dataKey="pending"
                        stroke="#f59e0b"
                        strokeWidth={3}
                        dot={{ fill: "#f59e0b", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Pending"
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: "#3b82f6", r: 3 }}
                        name="Total"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
