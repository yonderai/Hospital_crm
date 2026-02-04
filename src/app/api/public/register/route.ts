import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import Patient from "@/lib/models/Patient";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import QRCode from "qrcode";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // 0. Mock OTP Verification
        // In a real app, we would verify the OTP sent to body.phone here.
        if (body.otp !== "1234") { // Mock OTP
            // return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // 1. Generate MRN
        const mrn = await generateMRN();

        // 2. Generate Credentials
        const password = generateDefaultPassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Create Patient
        const patientData = {
            mrn,
            firstName: body.firstName,
            lastName: body.lastName,
            dob: body.dob,
            gender: body.gender,
            bloodType: body.bloodType || "Unknown",
            contact: {
                phone: body.phone,
                email: body.email,
                address: body.address
            },
            emergencyContact: {
                name: body.emergencyName,
                phone: body.emergencyPhone,
                relation: body.emergencyRelation
            },
            insuranceInfo: {
                hasInsurance: body.hasInsurance === 'yes',
                // other details might be skipped in self-reg
            },
            allergies: body.allergies || [],
            chronicConditions: body.chronicConditions || [],
            registeredDate: new Date(),
            // No registeredBy field as it's self-registration
        };

        const newPatient = await Patient.create(patientData);

        // 4. Generate QR
        const qrCodeData = JSON.stringify({
            mrn,
            name: `${body.firstName} ${body.lastName}`,
            id: newPatient._id
        });
        const qrCodeUrl = await QRCode.toDataURL(qrCodeData);

        // Save QR (assuming schema support or ignoring strict)
        newPatient.qrCodeUrl = qrCodeUrl;
        await newPatient.save();

        // 5. Create User Account
        const userEmail = body.email || `${mrn.toLowerCase()}@patient.medicore.com`;

        // Check if user exists
        const existingUser = await User.findOne({ email: userEmail });
        if (!existingUser) {
            await User.create({
                email: userEmail,
                password: hashedPassword,
                role: 'patient',
                firstName: body.firstName,
                lastName: body.lastName,
                phone: body.phone,
                isActive: true
            });
        }

        return NextResponse.json({
            success: true,
            mrn,
            credentials: {
                username: userEmail,
                password, // Return only once
                qrCodeUrl
            }
        });

    } catch (error: any) {
        console.error("Public Registration Error:", error);
        return NextResponse.json({ error: error.message || "Registration Failed" }, { status: 500 });
    }
}

async function generateMRN() {
    const year = new Date().getFullYear();
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
