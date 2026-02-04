
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ORCase from '@/lib/models/ORCase';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "doctor") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { caseId, preOpDiagnosis, postOpDiagnosis, findings, procedureDetails, postOpInstructions, complications, postOpNotes } = body;

        if (!caseId) {
            return NextResponse.json({ error: "Case ID is required" }, { status: 400 });
        }

        const updatedCase = await ORCase.findByIdAndUpdate(
            caseId,
            {
                status: 'completed',
                complications,
                postOpNotes,
                surgeryReport: {
                    preOpDiagnosis,
                    postOpDiagnosis,
                    findings,
                    procedureDetails,
                    postOpInstructions,
                    reportDate: new Date()
                }
            },
            { new: true }
        );

        if (!updatedCase) {
            return NextResponse.json({ error: "Surgery case not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, case: updatedCase });
    } catch (error: any) {
        console.error("Surgery Report error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
