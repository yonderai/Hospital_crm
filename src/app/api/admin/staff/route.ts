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

        // RBAC: Admin or HR
        const session = await getServerSession(authOptions);
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'hr')) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const staff = await User.find({
            role: { $in: ['doctor', 'nurse', 'frontdesk', 'labtech', 'pharmacist', 'billing', 'hr', 'finance', 'emergency', 'maintenance', 'backoffice', 'admin'] }
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

        // Allow Admin or HR
        if (!session || (session.user.role !== 'admin' && session.user.role !== 'hr')) {
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
            designation,
            baseSalary
        } = body;

        // Validation
        if (!firstName || !lastName || !email || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Uniqueness check
        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash('a', 10); // Default password 'a'

        // 1. Create User
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            mobile: phone,
            department,
            isActive: true,
            forcePasswordChange: true,
        });

        // 2. Create Staff Profile
        // Import Staff dynamically to avoid circular deps if any, or just at top
        const Staff = (await import('@/lib/models/Staff')).default;

        await Staff.create({
            userId: newUser._id,
            employeeId: `EMP-${Date.now().toString().slice(-6)}`,
            firstName,
            lastName,
            email,
            phone,
            role,
            department: department || 'General',
            designation: designation || 'Staff',
            baseSalary: Number(baseSalary) || 0,
            dateJoined: new Date(),
            status: 'active',
            bankDetails: {
                accountName: `${firstName} ${lastName}`,
                bankName: 'Pending',
                accountNumber: 'Pending',
                ifscCode: 'Pending'
            }
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
