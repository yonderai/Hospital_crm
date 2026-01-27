import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !["lab", "labtech"].includes(session.user?.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } },
                    { mrn: { $regex: query, $options: "i" } }
                ]
            };
        }

        const patients = await Patient.find(filter)
            .select("firstName lastName mrn contact gender dob")
            .limit(10)
            .lean();

        return NextResponse.json(patients);
    } catch (error) {
        console.error("Lab patient search error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
