import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import LabOrder from "@/lib/models/LabOrder";
import Patient from "@/lib/models/Patient";


export async function POST(req: Request) {

    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const { patientId, isNewPatient, patientData, tests, priority } = body;

        if (!tests || !tests.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let targetPatientId = patientId;

        // Handle Quick Registration for New Patients
        if (isNewPatient) {
            if (!patientData?.firstName || !patientData?.lastName) {
                return NextResponse.json({ error: "Patient name is required for registration" }, { status: 400 });
            }

            const mrn = `MRN-W-${Math.floor(100000 + Math.random() * 900000)}`;
            const newPatientDataObj: any = {
                mrn,
                firstName: patientData.firstName,
                lastName: patientData.lastName,
                name: `${patientData.firstName} ${patientData.lastName}`, // Backend model compatibility
                dob: patientData.dob || new Date("2000-01-01"),
                gender: patientData.gender ? (patientData.gender === 'male' ? 'Male' : patientData.gender === 'female' ? 'Female' : 'Other') : "Other",
                contact: {
                    phone: patientData.phone || "000-000-0000"
                }
            };

            // Only add email if it's not empty to avoid "duplicate empty string" index error in Legacy Backend schema
            if (patientData.email && patientData.email.trim() !== "") {
                newPatientDataObj.contact.email = patientData.email;
            }

            const newPatient = await Patient.create(newPatientDataObj);
            targetPatientId = newPatient._id;
        }

        if (!targetPatientId) {
            return NextResponse.json({ error: "Patient identification required" }, { status: 400 });
        }

        const newOrder = await LabOrder.create({
            orderId: `LAB-D-${Date.now()}`,
            patientId: targetPatientId,
            tests,
            priority: priority || "routine",
            status: "ordered",
            orderSource: "direct",
            createdAt: new Date()
        });

        return NextResponse.json({ order: newOrder, patientId: targetPatientId }, { status: 201 });
    } catch (error: any) {
        console.error("Direct lab order error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
