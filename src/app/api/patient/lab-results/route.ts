import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";
import * as fs from "fs";

const log = (msg: string) => {
    try {
        fs.appendFileSync("c:\\Users\\mayan\\OneDrive\\Documents\\Yonder\\hospital_crm\\api-debug.log", `[${new Date().toISOString()}] ${msg}\n`);
    } catch (e) { }
};

export async function GET(req: Request) {
    try {
        log(`API Hit: ${req.url}`);
        const session = await getServerSession(authOptions);
        log(`Session: ${session ? JSON.stringify(session.user) : "No session"}`);

        if (!session || (session.user as any).role !== 'patient') {
            log(`Unauthorized access attempt for ${req.url}`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        log(`Lab API - User: ${session.user.email}, Role: ${session.user.role}`);

        // Find patient by user email
        const Patient = (await import("@/lib/models/Patient")).default;
        const patient = await Patient.findOne({ "contact.email": session.user.email });

        if (!patient) {
            log(`Lab API - Patient record NOT found for ${session.user.email}`);
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        log(`Lab API - Found patient: ${patient._id}`);

        // Fetch all lab orders for this patient (prescribed + completed)
        const labResults = await LabOrder.find({
            patientId: patient._id
        })
            .populate("orderingProviderId", "firstName lastName department")
            .populate("reviewedBy", "firstName lastName")
            .sort({ createdAt: -1 })
            .lean();

        log(`Lab API - Orders found: ${labResults.length}`);

        return NextResponse.json({
            data: labResults,
            debug_email: session.user.email,
            debug_patient_id: patient._id
        });

    } catch (error) {
        console.error("Error fetching patient lab results:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
