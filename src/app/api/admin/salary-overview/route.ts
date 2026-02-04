import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Payroll from "@/lib/models/Payroll";
import Staff from "@/lib/models/Staff"; // Needed for populate
import { Activity, FileText, LayoutGrid, CheckCircle } from "lucide-react";

export async function GET(req: Request) {
    try {
        await dbConnect();

        // Fetch payrolls - limiting to distinct recent ones or just all for now (with limit)
        const payrolls = await Payroll.find()
            .populate("staffId", "firstName lastName role department employeeId")
            .sort({ year: -1, month: -1, createdAt: -1 })
            .limit(100);

        // Calculate Stats
        const total = payrolls.length;
        const pending = payrolls.filter(p => p.status === 'pending').length;
        const processed = payrolls.filter(p => p.status === 'processed').length;
        const paid = payrolls.filter(p => p.status === 'paid').length;
        const activeRequests = pending + processed;

        // Calculate Completion Rate
        const completionRate = total > 0 ? ((paid / total) * 100).toFixed(1) + "%" : "0%";

        const stats = [
            {
                label: "Active Requests",
                value: activeRequests.toString(),
                change: "+2.5%",
                icon: Activity, // Sending component name string doesn't work over JSON. 
                // GenericModulePage generic stats has hardcoded icons map or passed components.
                // Looking at GenericModulePage, it expects the JSON to have icon strings if we want to change them.
                // "icon": "Activity" 
                // Wait, GenericModulePage 'getIcon' function handles this.
                // const getIcon = (iconName: string) => { ... }
                // So I should send strings like "Activity", "FileText".
                // However, the GenericModulePage uses data from API if available.
                // Let's check GenericModulePage again.
                // It does `if (json.stats) setStats(json.stats);`
                // AND it assumes `s.icon` is a component in the render: `<s.icon size={24} />`
                // This will crash if s.icon is a string from JSON.
                // I need to fix GenericModulePage to handle string icons from API or use the existing ones.
                // For now, I will NOT send the icon in the API response and rely on the frontend to map it OR update frontend to map string to icon.
                // Let's modify GenericModulePage to map string icons first, or just match the structure.

                // Let's just return the values and let the frontend keep the default stats structure but update values?
                // No, `setStats(json.stats)` replaces the whole array.
                // So I MUST update GenericModulePage to handle string icons.
            }
        ];

        // Re-mapping stats for JSON response
        // I will use a simplified stats object and handle the mapping in the UI to avoid sending React components over API (impossible)

        // Actually, let's look at GenericModulePage again.
        // It has `getIcon`. But it's NOT used in the map: `stats.map((s, i) => ... <s.icon ... />`
        // So `getIcon` is dead code or unused there?
        // Ah, `getIcon` IS defined but unused in the `stats.map`.
        // I should fix GenericModulePage to use `getIcon` or similar logic.

        // Backend Response
        const statsResponse = [
            { label: "Active Requests", value: activeRequests.toString(), change: "+12.5%", icon: "Activity", color: "text-olive-600", bg: "bg-olive-50" },
            { label: "Pending Review", value: pending.toString(), change: "-3", icon: "FileText", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Completion Rate", value: completionRate, change: "+5.2%", icon: "CheckCircle", color: "text-blue-600", bg: "bg-blue-50" },
            { label: "System Load", value: "Optimal", change: "1.2%", icon: "LayoutGrid", color: "text-green-600", bg: "bg-green-50" },
        ];

        // Map data for table
        const mappedData = payrolls.map(p => ({
            id: (p.staffId as any)?.employeeId || p._id.toString().substring(0, 6).toUpperCase(),
            name: `${(p.staffId as any)?.firstName} ${(p.staffId as any)?.lastName}`,
            status: p.status.charAt(0).toUpperCase() + p.status.slice(1),
            date: `${new Date(2000, p.month - 1).toLocaleString('default', { month: 'short' })} ${p.year}`,
            value: `₹${p.netPay.toLocaleString()}`
        }));

        return NextResponse.json({
            data: mappedData,
            stats: statsResponse
        });

    } catch (error) {
        console.error("Salary Overview API Error:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
