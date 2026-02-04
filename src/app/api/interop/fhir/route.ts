import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import Encounter from "@/lib/models/Encounter";
import { convertToFHIRPatient, convertToFHIREncounter } from "@/lib/interop/fhir";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const resource = searchParams.get("resource"); // e.g., 'Patient'
        const id = searchParams.get("id"); // internal MRN or MongoDB ID

        if (resource === "Patient" && id) {
            const patient = await Patient.findOne({ mrn: id });
            if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });
            return NextResponse.json(convertToFHIRPatient(patient));
        }

        if (resource === "Encounter" && id) {
            const encounter = await Encounter.findById(id).populate("patientId");
            if (!encounter) return NextResponse.json({ error: "Encounter not found" }, { status: 404 });
            return NextResponse.json(convertToFHIREncounter(encounter));
        }

        return NextResponse.json({ error: "Unsupported resource type or missing ID" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
