import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongoose';
import LabOrder from '@/lib/models/LabOrder';
import Patient from '@/lib/models/Patient';
import * as fs from 'fs';
import * as path from 'path';

const logPath = path.join(process.cwd(), 'api-debug.log');
const log = (msg: string) => {
    try {
        fs.appendFileSync(logPath, `[${new Date().toISOString()}] REPORT API: ${msg}\n`);
    } catch (e) { }
};

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        log(`Session: ${session ? JSON.stringify(session.user) : "No session"}`);

        if (!session || (session.user as any).role !== 'patient') {
            log(`Unauthorized access`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        log(`Searching for patient with email: ${session.user.email}`);

        // Find patient by user email
        const patient = await Patient.findOne({
            $or: [
                { "contact.email": session.user.email },
                { "email": session.user.email }
            ]
        });

        if (!patient) {
            log(`Patient NOT found in DB`);
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        log(`Found patient: ${patient._id} (${patient.firstName})`);

        // Fetch completed lab orders for this patient
        const [labOrders, imagingOrders] = await Promise.all([
            LabOrder.find({
                patientId: patient._id,
                status: 'completed'
            }).sort({ updatedAt: -1 }),
            (await import("@/lib/models/ImagingOrder")).default.find({
                patientId: patient._id,
                status: 'completed'
            }).sort({ updatedAt: -1 })
        ]);

        // Flatten results for the viewer
        const data: any[] = [];

        // Lab Results
        labOrders.forEach(order => {
            order.results.forEach((res: any) => {
                data.push({
                    id: `${order._id}-${res.testName}`,
                    testName: res.testName,
                    value: res.value,
                    unit: res.unit,
                    range: res.referenceRange,
                    date: new Date(order.resultDate || order.updatedAt).toLocaleDateString(),
                    status: order.status.toUpperCase(),
                    type: 'LAB'
                });
            });
        });

        // Radiology Results
        const RadiologyReport = (await import("@/lib/models/RadiologyReport")).default;
        for (const order of imagingOrders) {
            const report = await RadiologyReport.findOne({ orderId: order._id });
            if (report) {
                data.push({
                    id: report._id,
                    testName: `${order.imagingType} - ${order.bodyPart}`,
                    value: report.impression,
                    unit: '',
                    range: 'Refer to Report',
                    date: new Date(report.signedAt || report.updatedAt).toLocaleDateString(),
                    status: report.status.toUpperCase(),
                    type: 'RADIOLOGY',
                    findings: report.findings
                });
            }
        }

        // Sort all by date desc
        data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json({ data });
    } catch (error) {
        console.error("Error fetching patient reports:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
