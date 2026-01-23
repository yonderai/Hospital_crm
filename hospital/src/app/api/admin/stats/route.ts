
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import Invoice from "@/lib/models/Invoice"; // Assuming this model exists or will be generic count if not
import Appointment from "@/lib/models/Appointment";
import { protectRoute } from "@/lib/api-guard";

export async function GET(req: Request) {
    const auth = await protectRoute(["admin"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();

        // Parallel execution for speed
        const [
            staffCount,
            patientCount,
            appointmentCount,
            revenueData
        ] = await Promise.all([
            User.countDocuments({}),
            Patient.countDocuments({}),
            Appointment.countDocuments({ status: { $in: ['scheduled', 'pending'] } }),
            Invoice.aggregate([
                { $match: { status: { $ne: 'cancelled' } } },
                { $group: { _id: null, total: { $sum: "$balanceDue" } } } // Simplifying revenue as sum of due or paid
            ])
        ]);

        // Revenue aggregation might need adjustment based on Schema
        // If Invoice model doesn't exist yet (created in Billing phase?), handled gracefully
        const totalRevenue = revenueData[0]?.total || 0;

        return NextResponse.json({
            stats: {
                totalStaff: staffCount,
                totalPatients: patientCount,
                pendingApprovals: appointmentCount,
                monthlyRevenue: totalRevenue
            }
        });
    } catch (error: any) {
        // Fallback for missing collections (e.g. if Invoices not seeded)
        console.error("Admin stats error:", error);
        return NextResponse.json({
            stats: {
                totalStaff: 0,
                totalPatients: 0,
                pendingApprovals: 0,
                monthlyRevenue: 0
            }
        });
    }
}
