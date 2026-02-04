import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import MedicalDocument from "@/lib/models/MedicalDocument";
import Patient from "@/lib/models/Patient";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Find the patient record linked to this user
        const patient = await Patient.findOne({ "contact.email": session.user.email });
        if (!patient) {
            return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;
        const documentType = formData.get("documentType") as string;
        const notes = formData.get("notes") as string;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Validation
        const validTypes = ['prescription', 'lab_report', 'discharge_summary', 'insurance_claim', 'other'];
        if (!validTypes.includes(documentType)) {
            return NextResponse.json({ error: "Invalid document type" }, { status: 400 });
        }

        // Size check (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "File too large. Max 5MB allowed." }, { status: 400 });
        }

        // Extension check (Simple)
        const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.name).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return NextResponse.json({ error: "Unsupported file type. Allowed: PDF, JPG, PNG" }, { status: 400 });
        }

        // Save File Locally
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').replace(/-+/g, '-');
        const fileName = `${Date.now()}-${safeName}`;
        const uploadPath = path.join(process.cwd(), "public", "uploads", "medical-history", fileName);
        const publicUrl = `/uploads/medical-history/${fileName}`;

        await writeFile(uploadPath, buffer);

        // Save Meta to DB
        const newDoc = await MedicalDocument.create({
            patientId: patient._id,
            documentType,
            fileName: file.name,
            fileUrl: publicUrl,
            fileSize: file.size,
            mimeType: file.type,
            uploadedBy: 'patient',
            uploaderId: (session.user as any).id,
            verificationStatus: 'verified',
            notes
        });

        return NextResponse.json({
            success: true,
            document: newDoc,
            message: "Document uploaded successfully"
        }, { status: 201 });

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const patientIdByQuery = searchParams.get("patientId");

        let query: any = {};

        // RBAC: Patient can only see their own. Doctor/Admin can see any if they provide ID.
        if (session.user.role === 'patient') {
            const patient = await Patient.findOne({ "contact.email": session.user.email });
            if (!patient) return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
            query.patientId = patient._id;
        } else if (['doctor', 'admin', 'nurse'].includes(session.user.role)) {
            if (!patientIdByQuery) {
                return NextResponse.json({ error: "patientId is required for clinical views" }, { status: 400 });
            }
            query.patientId = patientIdByQuery;
        } else {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const documents = await MedicalDocument.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ documents });

    } catch (error) {
        console.error("Fetch Documents Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
