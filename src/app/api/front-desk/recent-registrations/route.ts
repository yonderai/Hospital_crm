import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Patient from "@/lib/models/Patient";

export async function GET(req: Request) {
    try {
        await dbConnect();
        // Fetch last 5 created patients
        const recent = await Patient.find({})
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({ success: true, recent });
    } catch (error) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
