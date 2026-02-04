import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        await dbConnect();

        // 1. RBAC Check
        const session = await getServerSession(authOptions);
        if (!session || !['hr', 'admin'].includes(session.user.role)) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const body = await req.json();
        const {
            firstName,
            lastName,
            email,
            password,
            role,
            mobile,
            employeeId,
            joiningDate,
            specialization,
            consultationFee,
            shift,
            ward
        } = body;

        // 2. Validation
        if (!firstName || !lastName || !email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
        }

        // 3. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create User
        // Construct the user object based on role to avoid cluttering with empty fields for irrelevant roles
        const userData: Record<string, unknown> = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role,
            mobile,
            employeeId,
            joiningDate: joiningDate ? new Date(joiningDate) : undefined,
            isActive: true, // Default to active
        };

        if (role === 'doctor') {
            if (specialization) userData.specialization = specialization;
            if (consultationFee) userData.consultationFee = Number(consultationFee);
        }

        if (role === 'nurse') {
            if (shift) userData.shift = shift;
            if (ward) userData.ward = ward;
        }

        const newUser = await User.create(userData);

        return NextResponse.json({
            message: "Staff member registered successfully",
            userId: newUser._id
        }, { status: 201 });

    } catch (error: unknown) {
        console.error("Staff registration error:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
