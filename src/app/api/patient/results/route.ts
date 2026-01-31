import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";
import LabResult from "@/lib/models/LabResult";
import ImagingOrder from "@/lib/models/ImagingOrder";

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

        // 2. Fetch Lab Results
        const labs = await LabResult.find({
            patientId: patient._id,
            status: { $in: ['final', 'corrected'] } // Only show finalized results
        }).lean();

        // 3. Fetch Radiology Reports
        const radiology = await ImagingOrder.find({
            patientId: patient._id,
            status: 'completed' // Only show completed imaging
        }).populate('report').lean();


        // 4. Normalize & Combine Data
        const normalizedLabs = labs.map(item => ({
            id: item._id,
            type: 'lab',
            title: item.testType,
            date: item.createdAt,
            status: item.status,
            summary: item.resultValue ? `${item.resultValue} ${item.unit}` : 'Result Available',
            details: item
        }));

        const normalizedRadiology = radiology.map((item: any) => ({
            id: item._id,
            type: 'radiology',
            title: `${item.imagingType} - ${item.bodyPart}`,
            date: item.createdAt,
            status: item.status,
            summary: item.report?.interpretation || "Report Available",
            details: item
        }));

        const combinedResults = [...normalizedLabs, ...normalizedRadiology].sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

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
