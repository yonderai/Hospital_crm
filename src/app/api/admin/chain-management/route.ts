import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import { Ward } from "@/lib/models/Facility"; // Named export
import { Activity, LayoutGrid, CheckCircle, Ticket } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const wards = await Ward.find().sort({ name: 1 }).limit(100);

        // Stats
        const totalWards = wards.length;
        const totalCapacity = wards.reduce((acc, curr) => acc + curr.capacity, 0);
        const activeWards = wards.filter(w => w.status === 'active').length;
        // Mock occupancy for now as we'd need to count Beds to be accurate
        const avgCapacity = totalWards > 0 ? Math.round(totalCapacity / totalWards) : 0;

        const stats = [
            { label: "Total Wards", value: totalWards.toString(), change: "+2", icon: "LayoutGrid", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Capacity", value: totalCapacity.toString(), change: "+50", icon: "Activity", color: "text-green-600", bg: "bg-green-50" },
            { label: "Active Units", value: activeWards.toString(), change: "Stable", icon: "CheckCircle", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Avg. Ward Size", value: avgCapacity.toString(), change: "N/A", icon: "Ticket", color: "text-purple-600", bg: "bg-purple-50" },
        ];

        const mappedData = wards.map(w => ({
            id: w._id.toString().substring(0, 8).toUpperCase(),
            name: `${w.name} (${w.type})`,
            status: w.status.charAt(0).toUpperCase() + w.status.slice(1),
            date: new Date(w.updatedAt).toLocaleDateString(),
            value: `${w.capacity} Beds`
        }));

        return NextResponse.json({
            data: mappedData,
            stats: stats
        });

    } catch (error) {
        console.error("Chain Management API Error:", error);
        return NextResponse.json({ error: "Failed to fetch chain data" }, { status: 500 });
    }
}
