import { NextRequest, NextResponse } from "next/server";
import dbConnect from '@/lib/db';
import { Bed } from "@/lib/models/Facility";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { searchParams } = new URL(req.url);
        const wardId = searchParams.get("wardId");
        const status = searchParams.get("status");

        let filter: any = {};
        if (wardId) filter.wardId = wardId;
        if (status) filter.status = status;

        const beds = await Bed.find(filter)
            .populate("patientId", "firstName lastName mrn")
            .sort({ bedNumber: 1 });

        return NextResponse.json(beds);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ADT Workflow (Admission / Transfer)
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const { bedId, patientId, action, targetBedId } = await req.json();

        if (action === "admit") {
            const bed = await Bed.findByIdAndUpdate(
                bedId,
                { patientId, status: "occupied" },
                { new: true }
            );
            return NextResponse.json(bed);
        }

        if (action === "discharge") {
            const bed = await Bed.findByIdAndUpdate(
                bedId,
                { patientId: null, status: "cleaning" },
                { new: true }
            );
            return NextResponse.json(bed);
        }

        if (action === "transfer") {
            // Source bed becomes cleaning
            await Bed.findByIdAndUpdate(bedId, { patientId: null, status: "cleaning" });
            // Target bed becomes occupied
            const targetBed = await Bed.findByIdAndUpdate(
                targetBedId,
                { patientId, status: "occupied" },
                { new: true }
            );
            return NextResponse.json(targetBed);
        }

        return NextResponse.json({ error: "Invalid ADT action" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
