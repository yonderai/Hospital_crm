
import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import User, { UserRole } from "@/lib/models/User";
import Patient from "@/lib/models/Patient";
import bcrypt from "bcryptjs";

// Helper to generate MRN
async function generateMRN() {
    const year = new Date().getFullYear();
    const count = await Patient.countDocuments();
    const sequence = (count + 1).toString().padStart(6, '0');
    return `MRN-${year}-${sequence}`;
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const data = await request.json();

        // 1. Validation
        if (!data.email || !data.password || !data.firstName || !data.lastName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Check existing user
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 });
        }

        // 3. Generate MRN
        const mrn = await generateMRN();

        // 4. Create User (Auth)
        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Define permissions for patient
        const patientPermissions = {
            canView: ["patient-portal", "medical-records", "appointments", "billing"],
            canEdit: ["profile"],
            canDelete: [],
            canApprove: []
        };

        const newUser = new User({
            email: data.email,
            password: hashedPassword,
            role: "patient", // UserRole.PATIENT if enum was imported correctly
            firstName: data.firstName,
            lastName: data.lastName,
            isActive: true,
            permissions: patientPermissions
        });

        await newUser.save();

        // 5. Create Patient (Clinical Data)
        // Transform incoming data to match Schema
        const newPatient = new Patient({
            mrn,
            firstName: data.firstName,
            lastName: data.lastName,
            dob: new Date(data.dob),
            gender: data.gender,
            bloodType: data.bloodType,
            contact: {
                phone: data.phone,
                email: data.email, // Sparse unique index
                address: {
                    street: data.address.street,
                    city: data.address.city,
                    state: data.address.state,
                    zipCode: data.address.zipCode,
                    country: data.address.country
                }
            },
            emergencyContact: data.emergencyContact,
            insuranceInfo: {
                hasInsurance: data.hasInsurance,
                provider: data.insurance?.provider,
                policyNumber: data.insurance?.policyNumber,
                groupNumber: data.insurance?.groupNumber,
                coverageType: data.insurance?.coverageType,
                // Parse numbers if they are strings
                sumInsured: data.insurance?.sumInsured ? Number(data.insurance.sumInsured) : undefined,
                // Parse date if string
                validUntil: data.insurance?.validUntil ? new Date(data.insurance.validUntil) : undefined,
            },
            // Using root level for backward compatibility as per schema changes
            allergies: data.allergies || [],
            chronicConditions: data.chronicConditions || [],
            medicalHistory: {
                allergies: data.allergies || [],
                chronicConditions: data.chronicConditions || [],
                pastSurgeries: [], // Todo: Map if UI sends complex objects
                currentMedications: []
            },
            photoUrl: data.photoUrl,
            registrationSource: 'self-registration',
            // Link to User
            // Note: Patient schema doesn't effectively link TO User in original schema except maybe assignedDoctor
            // But usually we want a link. We can add specific field if needed, or rely on email match.
            // However, common practice is User has patientId or Patient has userId.
            // Let's rely on Email for now unless we add userId to Patient schema or patientId to User.
            // Wait! User schema HAS patientId field in some versions or we might want to add it.
            // Checking User.ts: It does NOT have patientId explicitly in the interface I saw earlier, 
            // but let's re-check or just save it. 
        });

        const savedPatient = await newPatient.save();

        // Optional: Update User with patientId if User schema supports it
        // Or we rely on email matching.

        // 6. Return Success
        return NextResponse.json({
            success: true,
            message: "Registration successful",
            patient: {
                mrn: savedPatient.mrn,
                name: `${savedPatient.firstName} ${savedPatient.lastName}`,
                email: savedPatient.contact.email
            }
        });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
