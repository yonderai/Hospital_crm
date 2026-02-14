import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import User, { UserRole } from "@/lib/models/User";
import Invoice from "@/lib/models/Invoice";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const body = await req.json();

        // 1. Generate unique MRN (Medical Record Number)
        const mrn = await generateMRN();

        // 2. Generate patient login credentials
        const defaultPassword = generateDefaultPassword();

        // 3. Prepare Patient Data
        const userEmail = body.email || `${mrn.toLowerCase()}@patient.medicore.com`;
        const patientData = {
            ...body,
            mrn,
            contact: {
                phone: body.phone,
                email: userEmail,
                address: {
                    street: body.address,
                    city: body.city,
                    state: body.state,
                    zipCode: body.zip,
                    country: body.country,
                },
            },
            emergencyContact: {
                name: body.emergencyName,
                phone: body.emergencyPhone,
                relation: body.emergencyRelation,
            },
            insuranceInfo: {
                hasInsurance: body.hasInsurance,
                provider: body.insuranceProvider,
                policyNumber: body.policyNumber,
                groupNumber: body.groupNumber,
                coverageType: body.coverageType,
                validUntil: body.insuranceValidUntil,
            },
            allergies: body.allergies || [],
            chronicConditions: body.chronicConditions || [],
            pastSurgeries: body.pastSurgeries || [],
            currentMedications: body.currentMedications || [],
            familyMedicalHistory: body.familyMedicalHistory || {},
            bloodType: body.bloodType,
            notes: body.notes,
            facilityId: body.facilityId, // If passed
            assignedDoctorId: body.preferredDoctorId,
            registeredDate: new Date(),
        };

        // 4. Create Patient Record
        const newPatient = await Patient.create(patientData);

        // 4a. Create Registration Invoice if fee > 0
        const regFee = Number(body.registrationFee);
        if (regFee > 0) {
            const invoiceNumber = `INV-REG-${mrn}-${Date.now().toString().slice(-4)}`;
            await Invoice.create({
                patientId: newPatient._id,
                invoiceNumber,
                items: [{
                    description: "Patient Registration Fee",
                    quantity: 1,
                    unitPrice: regFee,
                    total: regFee,
                    isInsuranceCovered: false
                }],
                totalAmount: regFee,
                amountPaid: 0,
                balanceDue: regFee,
                status: "sent", // Initially sent/billed for collection at desk
                dueDate: new Date(),
                insuranceCalculation: {
                    claimStatus: "not_initiated",
                }
            });
        }

        // 5. Generate QR Code
        const qrCodeData = JSON.stringify({
            mrn: mrn,
            name: `${body.firstName} ${body.lastName}`,
            phone: body.phone,
            id: newPatient._id
        });
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

        // Update Patient with QR Code
        newPatient.qrCodeUrl = qrCodeUrl;
        await newPatient.save();

        // 6. Create User Account
        // Check if email already exists
        console.log(`[REG-DEBUG] Checking for existing user with email: ${userEmail.toLowerCase()}`);
        const existingUser = await User.findOne({ email: userEmail.toLowerCase() });
        console.log(`[REG-DEBUG] existingUser found? ${!!existingUser}`);

        let credentials;

        if (!existingUser) {
            console.log(`[REG-DEBUG] Creating new user for ${userEmail.toLowerCase()}`);
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            try {
                await User.create({
                    email: userEmail.toLowerCase(),
                    password: hashedPassword,
                    role: 'patient',
                    firstName: body.firstName,
                    lastName: body.lastName,
                    mobile: body.phone,
                    isActive: true,
                });
                console.log(`[REG-DEBUG] User created successfully`);
            } catch (userCreateError: any) {
                console.error(`[REG-DEBUG] User creation failed:`, userCreateError);
                // If this fails, we should probably rollback the Patient creation or something, 
                // but for now let's just rethrow to see the error.
                throw userCreateError;
            }
            credentials = {
                username: userEmail,
                password: defaultPassword
            };
        } else {
            console.log(`[REG-DEBUG] User already exists. Linking.`);
            // If user exists, we link it but don't error? 
            // Actually, for a new MRN, the email should be unique.
            credentials = { username: userEmail, password: "Existing Account" };
        }

        return NextResponse.json({
            success: true,
            message: "Patient registered successfully",
            patient: newPatient,
            credentials: {
                mrn,
                ...credentials,
                qrCodeUrl
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        if (error.code === 11000) {
            return NextResponse.json({ error: "Duplicate entry: MRN or Email already exists." }, { status: 409 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Helpers
async function generateMRN() {
    const year = new Date().getFullYear();
    const mrnPrefix = `MRN-${year}-`;

    // Find last MRN from Patients collection
    const lastPatient = await Patient.findOne({ mrn: { $regex: `^${mrnPrefix}` } }).sort({ mrn: -1 });

    // Find last MRN from Users collection (email based)
    // User emails are like: mrn-202X-XXXXXX@patient.medicore.com
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

    // Verification Loop: Ensure the generated MRN is truly unique
    // This handles cases where sort() might miss the true max due to unpadded legacy data
    // or race conditions.
    while (!isUnique) {
        candidateMRN = `${mrnPrefix}${nextSequence.toString().padStart(6, '0')}`;
        const candidateEmail = `${candidateMRN.toLowerCase()}@patient.medicore.com`;

        // Parallel check
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

function generateDefaultPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
