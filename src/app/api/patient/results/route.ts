import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";
import LabResult from "@/lib/models/LabResult";
import LabOrder from "@/lib/models/LabOrder";
import ImagingOrder from "@/lib/models/ImagingOrder";
import RadiologyReport from "@/lib/models/RadiologyReport";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // 1. Identify Patient
        const patient = await Patient.findOne({ "contact.email": session.user.email });
        if (!patient) {
            // If the user is a patient but has no patient record linked
            if (session.user.role === 'patient') {
                return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
            }
            // If admin/doctor accessing debug data (optional, but sticking to RBAC)
            return NextResponse.json({ error: "No patient profile linked" }, { status: 404 });
        }

        console.log("Fetching results for patient:", patient._id, patient.firstName, patient.lastName);

        // 2. Fetch Lab Results (and include preliminary status)
        const labs = await LabResult.find({
            patientId: patient._id,
            status: { $in: ['final', 'corrected', 'preliminary'] }
        }).lean();

        console.log("Found lab results:", labs.length);

        // 3. Fetch Lab Orders (specifically those with results attached)
        const labOrders = await LabOrder.find({
            patientId: patient._id,
            status: 'completed'
        }).lean();

        console.log("Found completed lab orders:", labOrders.length);

        // 4. Fetch Imaging Orders (completed ones)
        const imagingOrders = await ImagingOrder.find({
            patientId: patient._id,
            status: 'completed' // Only show completed imaging
        }).lean();

        console.log("Found imaging orders:", imagingOrders.length);

        // 5. Fetch Radiology Reports for these orders
        const orderIds = imagingOrders.map(order => order._id);
        const radiologyReports = await RadiologyReport.find({
            orderId: { $in: orderIds },
            status: { $in: ['final', 'corrected', 'preliminary'] }
        }).lean();

        console.log("Found radiology reports:", radiologyReports.length);

        // Create a map of orderId to report
        const reportMap = new Map();
        radiologyReports.forEach(report => {
            reportMap.set(report.orderId.toString(), report);
        });

        // 6. Normalize & Combine Data
        const normalizedLabs = labs.map(item => ({
            id: item._id,
            type: 'lab',
            title: item.testType,
            date: item.createdAt,
            status: item.status,
            summary: item.resultValue ? `${item.resultValue} ${item.unit}` : 'Result Available',
            details: item
        }));

        // Normalize results from LabOrder models (often used for combined reports)
        const normalizedLabOrders = labOrders.map((item: any) => ({
            id: item._id,
            type: 'lab',
            title: item.tests.join(", "),
            date: item.resultDate || item.updatedAt || item.createdAt,
            status: 'completed',
            summary: item.results && item.results.length > 0
                ? `${item.results[0].value} ${item.results[0].unit}`
                : 'Report Available',
            details: {
                ...item,
                testType: item.tests.join(", "),
                resultValue: item.results?.[0]?.value,
                unit: item.results?.[0]?.unit,
                results: item.results // Ensure the modal can find the results array
            }
        }));

        const normalizedRadiology = imagingOrders.map((item: any) => {
            const report = reportMap.get(item._id.toString());
            return {
                id: item._id,
                type: 'radiology',
                title: `${item.imagingType} - ${item.bodyPart}`,
                date: item.createdAt,
                status: item.status,
                summary: report?.impression || report?.findings || "Report Available",
                details: {
                    ...item,
                    report: report || null
                }
            };
        });

        // Combine all, avoiding duplicates if a LabResult and LabOrder represent the same thing
        // We'll use a simple approach: if multiple items have the same date/title within a short window, we might skip.
        // For now, combining is safer.
        const combinedResults = [...normalizedLabs, ...normalizedLabOrders, ...normalizedRadiology].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        console.log("Returning combined results:", combinedResults.length);

        return NextResponse.json({
            success: true,
            results: combinedResults,
            patient: {
                name: `${patient.firstName} ${patient.lastName}`,
                mrn: patient.mrn
            }
        });

    } catch (error) {
        console.error("Fetch Results Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
