import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Compliance from '@/lib/models/Compliance';
import User from '@/lib/models/User';

export async function GET() {
    try {
        await dbConnect();

        let complianceRecords = await Compliance.find({}).sort({ nextReviewDate: 1 });

        // Seed some data if empty or legacy data detected
        const hasLegacyData = complianceRecords.length > 0 && !complianceRecords[0].staffName;

        if (complianceRecords.length === 0 || hasLegacyData) {
            if (hasLegacyData) {
                await Compliance.deleteMany({ staffName: { $exists: false } });
            }
            const mockCompliance = [
                {
                    complianceId: "CMP-001",
                    staffName: "Dr. Elena Gilbert",
                    department: "ICU",
                    complianceType: "Safety Training",
                    status: "Compliant",
                    riskLevel: "Low",
                    lastReviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                    nextReviewDate: new Date(Date.now() + 330 * 24 * 60 * 60 * 1000),
                    assignedReviewer: "Jessica Pearson"
                },
                {
                    complianceId: "CMP-002",
                    staffName: "Marcus Thorne",
                    department: "Front Desk",
                    complianceType: "Data Privacy",
                    status: "Pending",
                    riskLevel: "Medium",
                    lastReviewDate: new Date(Date.now() - 360 * 24 * 60 * 60 * 1000),
                    nextReviewDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                    assignedReviewer: "Admin Team"
                },
                {
                    complianceId: "CMP-003",
                    staffName: "Sarah Connor",
                    department: "Pharmacy",
                    complianceType: "Inventory Audit",
                    status: "Overdue",
                    riskLevel: "High",
                    lastReviewDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000),
                    nextReviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    assignedReviewer: "Operations Head"
                },
                {
                    complianceId: "CMP-004",
                    staffName: "John Smith",
                    department: "Admin",
                    complianceType: "Payroll Audit",
                    status: "Under Review",
                    riskLevel: "Low",
                    lastReviewDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                    nextReviewDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                    assignedReviewer: "Finance Audit"
                },
                {
                    complianceId: "CMP-005",
                    staffName: "Dr. Gregory House",
                    department: "Diagnostics",
                    complianceType: "Safety Training",
                    status: "Compliant",
                    riskLevel: "Low",
                    lastReviewDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                    nextReviewDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
                    assignedReviewer: "Jessica Pearson"
                }
            ];
            await Compliance.insertMany(mockCompliance);
            complianceRecords = await Compliance.find({}).sort({ nextReviewDate: 1 });
        }

        const totalStaff = await User.countDocuments({});
        const compliantCount = complianceRecords.filter(r => r.status === 'Compliant').length;
        const pendingCount = complianceRecords.filter(r => r.status === 'Pending').length;
        const overdueCount = complianceRecords.filter(r => r.status === 'Overdue').length;
        const complianceRate = Math.round((compliantCount / complianceRecords.length) * 100);

        const stats = [
            { label: "Total Staff", value: totalStaff.toString(), change: "+2.5%", icon: "Users", color: "text-slate-600", bg: "bg-slate-50" },
            { label: "Compliant Staff", value: compliantCount.toString(), change: "+4.2%", icon: "CheckCircle", color: "text-green-600", bg: "bg-green-50" },
            { label: "Pending Compliance", value: pendingCount.toString(), change: "-1", icon: "Clock", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Overdue Cases", value: overdueCount.toString(), change: "+1", icon: "AlertCircle", color: "text-red-600", bg: "bg-red-50" },
            { label: "Compliance Rate", value: `${complianceRate}%`, change: "+2.1%", icon: "Activity", color: "text-blue-600", bg: "bg-blue-50" },
        ];

        return NextResponse.json({
            data: complianceRecords.map(r => ({
                id: r.complianceId,
                name: r.staffName,
                department: r.department,
                complianceType: r.complianceType,
                status: r.status,
                riskLevel: r.riskLevel,
                lastReview: r.lastReviewDate ? new Date(r.lastReviewDate).toLocaleDateString() : '-',
                nextReview: r.nextReviewDate ? new Date(r.nextReviewDate).toLocaleDateString() : '-',
                assignedTo: r.assignedReviewer,
                value: r.status // For badge logic
            })),
            stats
        });
    } catch (error) {
        console.error("Compliance API Error:", error);
        return NextResponse.json({ error: "Failed to fetch compliance data" }, { status: 500 });
    }
}
