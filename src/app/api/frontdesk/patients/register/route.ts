import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
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
                address: [body.address, body.city, body.state, body.zip, body.country].filter(Boolean).join(', '),
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
                status: "pending", // Initially pending for collection at desk
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
        const existingUser = await User.findOne({ email: userEmail.toLowerCase() });

        let credentials;

        if (!existingUser) {
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            await User.create({
                email: userEmail.toLowerCase(),
                password: hashedPassword,
                role: 'patient',
                firstName: body.firstName,
                lastName: body.lastName,
                mobile: body.phone,
                isActive: true,
            });
            credentials = {
                username: userEmail,
                password: defaultPassword
            };
        } else {
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
    // Find last MRN of this year
    const lastPatient = await Patient.findOne({ mrn: { $regex: `^MRN-${year}-` } }).sort({ createdAt: -1 });

    let sequence = 1;
    if (lastPatient && lastPatient.mrn) {
        const parts = lastPatient.mrn.split('-');
        if (parts.length === 3) {
            const lastSeq = parseInt(parts[2]);
            if (!isNaN(lastSeq)) sequence = lastSeq + 1;
        }
    }

    return `MRN-${year}-${sequence.toString().padStart(6, '0')}`;
}

function generateDefaultPassword() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
