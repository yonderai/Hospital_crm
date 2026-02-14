import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { firstName, lastName, age, gender, phone, reason } = body;

        if (!firstName || !lastName || !age || !gender || !phone) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Calculate generic DOB from age
        const currentYear = new Date().getFullYear();
        const birthYear = currentYear - parseInt(age);
        const dob = new Date(`${birthYear}-01-01`);

        // Generate MRN
        const mrn = await generateMRN();

        // Generate Username and Password
        const userEmail = `${mrn.toLowerCase()}@patient.medicore.com`;
        const autoPassword = Math.random().toString(36).slice(-8);

        // 1. Create User account for login
        // Check for existing user (though generateMRN should prevent this, race conditions exist)
        const existingUser = await User.findOne({ email: userEmail });
        if (existingUser) {
            console.error(`Collision passed generateMRN for ${userEmail}`);
            return NextResponse.json({ error: "System busy, please try again." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(autoPassword, 10);
        await User.create({
            email: userEmail,
            password: hashedPassword,
            role: "patient",
            firstName,
            lastName,
            isActive: true,
            permissions: { canView: [], canEdit: [], canDelete: [], canApprove: [] },
            mobile: phone
        });

        // 2. Create Clinical Patient Profile
        const newPatient = await Patient.create({
            mrn,
            firstName,
            lastName,
            dob,
            gender: gender.toLowerCase(),
            contact: {
                phone,
                email: userEmail,
                address: {
                    street: "Walk-in",
                    city: "Unknown",
                    state: "Unknown",
                    zipCode: "000000",
                    country: "India"
                }
            },
            notes: `Walk-in. Reason: ${reason || 'Not specified'}`,
            registeredBy: session.user.id,
            registrationSource: 'front-desk'
        });

        return NextResponse.json({
            success: true,
            message: "Patient registered successfully",
            patient: {
                _id: newPatient._id,
                firstName: newPatient.firstName,
                lastName: newPatient.lastName,
                mrn: newPatient.mrn,
                phone: newPatient.contact.phone
            },
            credentials: {
                username: userEmail,
                password: autoPassword
            }
        });

    } catch (error: any) {
        console.error("Quick Register Error:", error);
        return NextResponse.json({ error: error.message || "Failed to register patient" }, { status: 500 });
    }
}

// Robust MRN Generator
async function generateMRN() {
    const year = new Date().getFullYear();
    const mrnPrefix = `MRN-${year}-`;

    // Find last MRN from Patients collection
    const lastPatient = await Patient.findOne({ mrn: { $regex: `^${mrnPrefix}` } }).sort({ mrn: -1 });

    // Find last MRN from Users collection (email based)
    const emailPrefix = `${mrnPrefix.toLowerCase()}`;
    const lastUser = await User.findOne({
        email: { $regex: `^${emailPrefix}` }
    }).sort({ email: -1 });

    let maxSequence = 0;

    // Check Patient sequence
    if (lastPatient && lastPatient.mrn) {
        const parts = lastPatient.mrn.split('-');
        if (parts.length === 3) {
            const seq = parseInt(parts[2]);
            if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
        }
    }

    // Check User sequence
    if (lastUser && lastUser.email) {
        const emailParts = lastUser.email.split('@')[0];
        const parts = emailParts.split('-');
        if (parts.length === 3) {
            const seq = parseInt(parts[2]);
            if (!isNaN(seq) && seq > maxSequence) maxSequence = seq;
        }
    }

    let nextSequence = maxSequence + 1;
    let candidateMRN = '';
    let isUnique = false;

    // Verification Loop
    while (!isUnique) {
        candidateMRN = `${mrnPrefix}${nextSequence.toString().padStart(6, '0')}`;
        const candidateEmail = `${candidateMRN.toLowerCase()}@patient.medicore.com`;

        const [patientExists, userExists] = await Promise.all([
            Patient.findOne({ mrn: candidateMRN }).select('_id'),
            User.findOne({ email: candidateEmail }).select('_id')
        ]);

        if (!patientExists && !userExists) {
            isUnique = true;
        } else {
            console.log(`Collision detected for ${candidateMRN}. Incrementing sequence.`);
            nextSequence++;
        }
    }

    return candidateMRN;
}
