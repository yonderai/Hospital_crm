import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Patient from "@/lib/models/Patient";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");

        if (!q || q.length < 2) {
            return NextResponse.json({ patients: [] });
        }

        await dbConnect();

        const regex = new RegExp(q, "i");
        const patients = await Patient.find({
            $or: [
                { firstName: regex },
                { lastName: regex },
                { mrn: regex },
                { phone: regex },
                { identityProofNumber: regex }
            ]
        })
            .select("_id firstName lastName mrn phone gender age dateOfBirth")
            .limit(10);

        return NextResponse.json({ patients });

    } catch (error: any) {
        console.error("Patient Search Error:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
