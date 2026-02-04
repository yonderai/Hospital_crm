import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import Appointment from "@/lib/models/Appointment";
import Encounter from "@/lib/models/Encounter";
import Prescription from "@/lib/models/Prescription";
import LabOrder from "@/lib/models/LabOrder";
import ImagingOrder from "@/lib/models/ImagingOrder";
import mongoose from "mongoose";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');

        if (!search || search.length < 2) {
            return NextResponse.json([]);
        }

        await dbConnect();
        const regex = new RegExp(search, 'i');

        // Search Encounters (Chief Complaint, Diagnosis, assessment)
        const matchedEncounters = await Encounter.find({
            $or: [
                { chiefComplaint: { $regex: regex } },
                { diagnosis: { $regex: regex } },
                { "soapNotes.assessment": { $regex: regex } }
            ]
        }).populate('patientId').sort({ encounterDate: -1 }).limit(10);

        // Search Appointments (Reason, Chief Complaint)
        const matchedAppointments = await Appointment.find({
            $or: [
                { reason: { $regex: regex } },
                { chiefComplaint: { $regex: regex } }
            ]
        }).populate('patientId').sort({ startTime: -1 }).limit(10);

        // EXTRA: Search Lab Orders
        const matchedLabs = await LabOrder.find({
            $or: [
                { testType: { $regex: regex } },
                { tests: { $in: [regex] } },
                { clinicalHistory: { $regex: regex } }
            ]
        }).populate('patientId').limit(10);

        // EXTRA: Search Radiology
        const matchedRadiology = await ImagingOrder.find({
            $or: [
                { imagingType: { $regex: regex } },
                { bodyPart: { $regex: regex } },
                { clinicalHistory: { $regex: regex } }
            ]
        }).populate('patientId').limit(10);

        // EXTRA: Search Prescriptions
        const matchedPrescriptions = await Prescription.find({
            "medications.drugName": { $regex: regex }
        }).populate('patientId').limit(10);

        const results: any[] = [];
        const seenContexts = new Set(); // patientId + encounterId/appointmentId

        // Process Encounters
        for (const encounter of matchedEncounters) {
            const contextKey = `${encounter.patientId?._id}-${encounter._id}`;
            seenContexts.add(contextKey);
            results.push({
                type: 'history',
                id: encounter._id,
                patientId: encounter.patientId?._id,
                patientName: encounter.patientId ? `${encounter.patientId.firstName} ${encounter.patientId.lastName}` : "Unknown Patient",
                mrn: encounter.patientId?.mrn,
                condition: encounter.chiefComplaint || encounter.diagnosis?.[0] || "Consultation",
                date: encounter.encounterDate,
                encounterId: encounter._id,
                appointmentId: encounter.appointmentId,
                gender: encounter.patientId?.gender,
                dob: encounter.patientId?.dob
            });
        }

        // Process Appointments
        for (const appt of matchedAppointments) {
            if (appt.encounterId && seenContexts.has(`${appt.patientId?._id}-${appt.encounterId.toString()}`)) continue;
            const contextKey = `${appt.patientId?._id}-${appt._id}`;
            seenContexts.add(contextKey);

            results.push({
                type: 'history',
                id: appt._id,
                patientId: appt.patientId?._id,
                patientName: appt.patientId ? `${appt.patientId.firstName} ${appt.patientId.lastName}` : "Unknown Patient",
                mrn: appt.patientId?.mrn,
                condition: appt.chiefComplaint || appt.reason || "Appointment",
                date: appt.startTime,
                appointmentId: appt._id,
                encounterId: appt.encounterId,
                gender: appt.patientId?.gender,
                dob: appt.patientId?.dob
            });
        }

        // Process Labs
        for (const lab of matchedLabs) {
            const contextId = lab.encounterId || lab.appointmentId || lab._id;
            const contextKey = `${lab.patientId?._id}-${contextId}`;
            if (seenContexts.has(contextKey)) continue;
            seenContexts.add(contextKey);

            results.push({
                type: 'history',
                id: lab._id,
                patientId: lab.patientId?._id,
                patientName: lab.patientId ? `${lab.patientId.firstName} ${lab.patientId.lastName}` : "Unknown Patient",
                mrn: lab.patientId?.mrn,
                condition: `Lab: ${lab.tests?.join(', ') || lab.testType}`,
                date: lab.createdAt,
                encounterId: lab.encounterId || lab._id, // Fallback to self
                appointmentId: lab.appointmentId,
                gender: lab.patientId?.gender,
                dob: lab.patientId?.dob
            });
        }

        // Process Radiology
        for (const rad of matchedRadiology) {
            const contextId = rad.encounterId || rad.appointmentId || rad._id;
            const contextKey = `${rad.patientId?._id}-${contextId}`;
            if (seenContexts.has(contextKey)) continue;
            seenContexts.add(contextKey);

            results.push({
                type: 'history',
                id: rad._id,
                patientId: rad.patientId?._id,
                patientName: rad.patientId ? `${rad.patientId.firstName} ${rad.patientId.lastName}` : "Unknown Patient",
                mrn: rad.patientId?.mrn,
                condition: `Imaging: ${rad.imagingType}`,
                date: rad.createdAt,
                encounterId: rad.encounterId || rad._id, // Fallback to self
                appointmentId: rad.appointmentId,
                gender: rad.patientId?.gender,
                dob: rad.patientId?.dob
            });
        }

        // Process Prescriptions
        for (const rx of matchedPrescriptions) {
            const contextId = rx.encounterId || rx.appointmentId || rx._id;
            const contextKey = `${rx.patientId?._id}-${contextId}`;
            if (seenContexts.has(contextKey)) continue;
            seenContexts.add(contextKey);

            results.push({
                type: 'history',
                id: rx._id,
                patientId: rx.patientId?._id,
                patientName: rx.patientId ? `${rx.patientId.firstName} ${rx.patientId.lastName}` : "Unknown Patient",
                mrn: rx.patientId?.mrn,
                condition: `RX: ${rx.medications.map((m: any) => m.drugName).join(', ')}`,
                date: rx.prescribedDate || rx.createdAt,
                encounterId: rx.encounterId || rx._id, // Fallback to self
                appointmentId: rx.appointmentId,
                gender: rx.patientId?.gender,
                dob: rx.patientId?.dob
            });
        }

        return NextResponse.json(results);
    } catch (error: any) {
        console.error("Clinical search error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
