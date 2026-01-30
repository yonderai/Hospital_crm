import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        const { firstName, lastName, age, gender, phone, reason, address } = body;

        // Generate MRN (Simple logic for demo)
        const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const mrn = `P-${dateStr}-${randomNum}`;

        const dob = new Date();
        dob.setFullYear(dob.getFullYear() - parseInt(age));

        const newPatient = await Patient.create({
            mrn,
            firstName,
            lastName,
            dob,
            gender,
            contact: {
                phone,
                address: address || "Not Provided",
            },
            notes: `Self-registered via QR. Reason: ${reason}`,
            // We can add a custom logic flag or simply verify via notes/source if schema supported it
            // For now, using notes to indicate source is sufficient for demo
        });

        // Add a flag to the response so frontend can show "Token #X"
        return NextResponse.json({
            success: true,
            patient: { mrn: newPatient.mrn, name: `${newPatient.firstName} ${newPatient.lastName}` }
        });

    } catch (error) {
        console.error("Self-registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
