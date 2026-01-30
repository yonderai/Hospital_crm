import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch users with role 'doctor'
        // In a real app, might join with a 'DoctorProfile' for fees, etc.
        // For now, assuming fees might be stored or defaulted.
        const doctors = await User.find({ role: "doctor" })
            .select("_id firstName lastName email specialization department")
            .limit(50);

        // Transform for UI
        const date = new Date();
        const formattedDoctors = doctors.map(doc => ({
            id: doc._id,
            name: `Dr. ${doc.firstName} ${doc.lastName}`,
            specialty: doc.specialization || doc.department || "General",
            fees: 800, // Default fee if not in DB
            exp: "10+ years" // Placeholder
        }));

        return NextResponse.json({ doctors: formattedDoctors });

    } catch (error: any) {
        console.error("Doctor Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 });
    }
}
