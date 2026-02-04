import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/models/User';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const role = searchParams.get('role');

        await dbConnect();

        let query: any = {};
        if (role) {
            query.role = role;
        } else {
            // Default to all relevant staff if no role specified
            query.role = { $in: ['doctor', 'nurse', 'frontdesk', 'labtech', 'pharmacist'] };
        }

        const staff = await User.find(query)
            .select('firstName lastName role department _id email')
            .sort({ firstName: 1 });

        return NextResponse.json(staff);

    } catch (error) {
        console.error("Error fetching staff:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
