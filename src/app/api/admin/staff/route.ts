import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all staff (Doctors, Nurses, Front Desk, etc.)
export async function GET() {
    try {
        await dbConnect();

        // RBAC: Admin only
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const staff = await User.find({
            role: { $in: ['doctor', 'nurse', 'frontdesk', 'labtech', 'pharmacist', 'billing', 'hr', 'finance', 'emergency', 'maintenance', 'backoffice'] }
        })
            .select('-password -mfaSecret') // bit safer
            .sort({ createdAt: -1 });

        return NextResponse.json({ data: staff });
    } catch (error: unknown) {
        console.error("Fetch staff error:", error);
        return NextResponse.json({ error: "Failed to fetch staff list" }, { status: 500 });
    }
}

// POST: Create new staff member
export async function POST(req: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            phone, // maps to mobile in schema
            role,
            department,
            password
        } = body;

        // Validation
        if (!firstName || !lastName || !email || !role || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Uniqueness check
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            mobile: phone,
            department,
            isActive: true,
            forcePasswordChange: true, // Requirement: First login change password
        });

        return NextResponse.json({
            message: "Staff account created successfully",
            user: {
                id: newUser._id,
                email: newUser.email,
                role: newUser.role
            }
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("Create staff error:", error);
        const msg = error instanceof Error ? error.message : "Internal Error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
