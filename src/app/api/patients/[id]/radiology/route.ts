import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";
import RadiologyReport from "@/lib/models/RadiologyReport";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);

        if (!session || !['doctor', 'admin', 'nurse', 'labtech'].includes((session.user as any).role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all imaging orders for this patient
        const imagingOrders = await ImagingOrder.find({
            patientId: id
        })
            .populate("orderedBy", "firstName lastName department")
            .sort({ createdAt: -1 })
            .lean();

        // Fetch associated radiology reports
        const results = await Promise.all(
            imagingOrders.map(async (order) => {
                const report = await RadiologyReport.findOne({ orderId: order._id })
                    .populate("interpretedBy", "firstName lastName")
                    .lean();

                return {
                    ...order,
                    report
                };
            })
        );

        return NextResponse.json(results);

    } catch (error) {
        console.error("Error fetching patient radiology reports:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
