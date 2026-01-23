
import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import User from "@/lib/models/User";
import { protectRoute } from "@/lib/api-guard";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    const auth = await protectRoute(["admin", "hr"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const staff = await User.find({})
            .select("-password -credentials") // Exclude sensitive
            .sort({ createdAt: -1 });

        return NextResponse.json({ staff });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const auth = await protectRoute(["admin", "hr"]);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.email || !body.firstName || !body.lastName || !body.role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check duplicate
        const existing = await User.findOne({ email: body.email });
        if (existing) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(body.password || "password123", 10);

        const newUser = await User.create({
            ...body,
            password: hashedPassword,
            isActive: true
        });

        return NextResponse.json({ user: newUser }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
