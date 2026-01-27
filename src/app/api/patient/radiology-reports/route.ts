import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import ImagingOrder from "@/lib/models/ImagingOrder";
import RadiologyReport from "@/lib/models/RadiologyReport";
import * as fs from "fs";

const log = (msg: string) => {
    try {
        fs.appendFileSync("c:\\Users\\mayan\\OneDrive\\Documents\\Yonder\\hospital_crm\\api-debug.log", `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { }
};

export async function GET(req: Request) {
    try {
        log(`API Hit: Radiology`);
        const session = await getServerSession(authOptions);
        log(`Session: ${session ? JSON.stringify(session.user) : "No session"}`);

        if (!session || (session.user as any).role !== 'patient') {
            log(`Unauthorized access attempt for Radiology`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        log(`Radiology API - User: ${session.user.email}, Role: ${session.user.role}`);

        // Find patient by user email
        const Patient = (await import("@/lib/models/Patient")).default;
        const patient = await Patient.findOne({ "contact.email": session.user.email });

        if (!patient) {
            log(`Radiology API - Patient record NOT found for ${session.user.email}`);
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        log(`Radiology API - Found patient: ${patient._id}`);

        // Fetch all imaging orders for this patient (prescribed + completed)
        const imagingOrders = await ImagingOrder.find({
            patientId: patient._id
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
