
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import User from "@/lib/models/User";
import Patient from "@/lib/models/Patient";

// GET: Fetch appointments based on role
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const role = (session.user as any).role;
        const userId = (session.user as any).id;

        let query: any = {};

        if (role === 'doctor') {
            query = { providerId: userId };
        } else if (role === 'patient') {
            // Find the clinical patient profile for this user
            const patient = await Patient.findOne({ "contact.email": session.user?.email });
            if (!patient) return NextResponse.json([]); // No profile, no appointments
            query = { patientId: patient._id };
        } else if (role === 'admin') {
            if (searchParams.get('doctorId')) query = { ...query, providerId: searchParams.get('doctorId') };
            if (searchParams.get('patientId')) query = { ...query, patientId: searchParams.get('patientId') };
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // AUTO-CLEANUP: Mark past scheduled appointments as completed
        // This ensures historical data reflects "Done" status as requested
        const now = new Date();
        await Appointment.updateMany(
            {
                ...query,
                endTime: { $lt: now },
                status: { $in: ["scheduled", "checked-in", "in-progress"] }
            },
            { $set: { status: "completed" } }
        );

        // Date Filtering (YYYY-MM-DD)
        const dateParam = searchParams.get('date');
        if (dateParam) {
            const dateObj = new Date(dateParam);
            if (!isNaN(dateObj.getTime())) {
                const startOfDay = new Date(dateObj);
                startOfDay.setHours(0, 0, 0, 0);

                const endOfDay = new Date(dateObj);
                endOfDay.setHours(23, 59, 59, 999);

                query = {
                    ...query,
                    startTime: {
                        $gte: startOfDay,
                        $lte: endOfDay
                    }
                };
            }
        }

        // Populate patient and provider details for display
        const appointments = await Appointment.find(query)
            .populate('patientId', 'firstName lastName mrn dob gender contact bloodType allergies chronicConditions emergencyContact insuranceInfo')
            .populate('providerId', 'firstName lastName department')
            .sort({ startTime: 1 });

        return NextResponse.json(appointments);

    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create a new appointment
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const role = (session.user as any).role;
        if (role !== 'patient' && role !== 'admin' && role !== 'frontdesk') {
            return NextResponse.json({ error: "Only patients or staff can book appointments" }, { status: 403 });
        }

        await dbConnect();
        const body = await req.json();
        const { providerId, startTime, reason, type } = body;

        if (!providerId || !startTime || !reason || !type) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Validate Doctor exists
        const doctor = await User.findById(providerId);
        if (!doctor || doctor.role !== 'doctor') {
            return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
        }

        // Determine targeted Patient ID
        let targetPatientId = body.patientId;

        if (role === 'patient') {
            const patientProfile = await Patient.findOne({ "contact.email": session.user?.email });
            if (!patientProfile) {
                return NextResponse.json({ error: "Patient profile not found. Please contact administration." }, { status: 404 });
            }
            targetPatientId = patientProfile._id;

            // STRICT RBAC: Patient can only book with assigned doctor
            if (patientProfile.assignedDoctorId && patientProfile.assignedDoctorId.toString() !== providerId) {
                return NextResponse.json({ error: "You can only book appointments with your assigned doctor." }, { status: 403 });
            }
        }

        // Front Desk can book for anyone (targetPatientId is passed in body)
        if (role === 'frontdesk') {
            if (!targetPatientId) {
                return NextResponse.json({ error: "Patient Selection is required." }, { status: 400 });
            }
        }

        if (!targetPatientId) {
            return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
        }

        // Calculate endTime (default 30 mins)
        const start = new Date(startTime);
        const end = new Date(start.getTime() + 30 * 60000);

        // Generate ID
        const appointmentId = `APT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Check for double booking
        const overlappingAppointment = await Appointment.findOne({
            providerId,
            status: { $nin: ["cancelled", "no-show"] },
            startTime: { $lt: end },
            endTime: { $gt: start }
        });

        if (overlappingAppointment) {
            return NextResponse.json({
                error: "Doctor is not available at this time.",
                code: "DOUBLE_BOOKING"
            }, { status: 409 });
        }

        const creatorRole = role === 'patient' ? 'patient' : 'staff';

        const newAppointment = await Appointment.create({
            appointmentId,
            patientId: targetPatientId,
            providerId,
            startTime: start,
            endTime: end,
            reason,
            type,
            status: "scheduled",
            createdBy: creatorRole
        });

        return NextResponse.json(newAppointment, { status: 201 });

    } catch (error) {
        console.error("Error creating appointment:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
