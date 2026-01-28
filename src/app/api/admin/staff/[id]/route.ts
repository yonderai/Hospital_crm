import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        // Security check: Don't allow editing other admins via this route (optional but good practice)
        // For now, assuming admin can edit anyone except maybe themselves or super-admin logic

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Staff updated", user: updatedUser });

    } catch (error: unknown) {
        console.error("Update staff error:", error);
        return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}
