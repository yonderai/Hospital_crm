import { NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import EmergencyCase from "@/lib/models/EmergencyCase";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { caseId, triageLevel, vitals, status } = body;

        if (!caseId) return NextResponse.json({ error: "Case ID required" }, { status: 400 });

        await dbConnect();

        const updateData: any = {};
        if (triageLevel) updateData.triageLevel = triageLevel;
        if (status) updateData.status = status;

        // Push new vitals reading if provided
        const updateQuery = vitals ? {
            $set: updateData,
            $push: { vitals: vitals }
        } : {
            $set: updateData
        };

        const updatedCase = await EmergencyCase.findByIdAndUpdate(caseId, updateQuery, { new: true });

        if (!updatedCase) return NextResponse.json({ error: "Case not found" }, { status: 404 });

        return NextResponse.json(updatedCase);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update triage" }, { status: 500 });
    }
}
