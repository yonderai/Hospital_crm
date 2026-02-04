import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // If user is a patient, show their own record.
        // If doctor, they should probably use a different endpoint with ID, but for now let's handle patient view here.
        // Assuming this endpoint is primarily for the logged-in user to see their own history.

        let patient;

        if (session.user.role === 'patient') {
            // Find patient linked to this user email
            // Note: In our seed logic, Patients and Users are separate collections but share email.
            // Ideally there should be a link, but currently we match by email based on seed or `contact.email`.
            patient = await Patient.findOne({ "contact.email": session.user.email });
        } else {
            // For now, restrict this endpoint to patients or return error for others if not implemented
            // Or allow doctors to view if they pass a patient ID (but that's usually a dynamic route).
            // Let's stick to ONLY patient viewing their own data for this specific requirement "patient can view...".
            return NextResponse.json({ error: "Access denied. Patient role required." }, { status: 403 });
        }

        if (!patient) {
            return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
        }

        return NextResponse.json({
            medicalHistory: patient.medicalHistory,
            patientUpdates: patient.patientUpdates || [],
        });

    } catch (error) {
        console.error("Error fetching medical history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user || !session.user.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (session.user.role !== 'patient') {
            return NextResponse.json({ error: "Forbidden. Only patients can update their history." }, { status: 403 });
        }

        const body = await request.json();
        const { category, description } = body;

        const validCategories = ['allergy', 'condition', 'surgery', 'medication', 'family', 'other'];

        if (!category || !validCategories.includes(category)) {
            return NextResponse.json({ error: "Invalid category" }, { status: 400 });
        }

        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json({ error: "Description is required" }, { status: 400 });
        }

        await dbConnect();

        const patient = await Patient.findOne({ "contact.email": session.user.email });

        if (!patient) {
            return NextResponse.json({ error: "Patient record not found" }, { status: 404 });
        }

        const newUpdate = {
            category,
            description,
            timestamp: new Date(),
            status: 'pending'
        };

        patient.patientUpdates = patient.patientUpdates || [];
        patient.patientUpdates.push(newUpdate);

        await patient.save();

        return NextResponse.json({ message: "Update submitted successfully", update: newUpdate }, { status: 201 });

    } catch (error) {
        console.error("Error submitting medical history update:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
