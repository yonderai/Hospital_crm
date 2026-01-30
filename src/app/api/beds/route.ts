import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bed from "@/lib/models/Bed";

export async function GET(req: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const floor = searchParams.get("floor");
        const status = searchParams.get("status");
        const type = searchParams.get("type");

        let query: any = {};
        if (floor && floor !== "All") query.floor = floor;
        if (status && status !== "All") query.status = status;
        if (type && type !== "All") query.type = type;

        const beds = await Bed.find(query).populate({
            path: "currentPatientId",
            select: "firstName lastName mrn dob gender assignedDoctorId",
            populate: { path: "assignedDoctorId", select: "name" }
        });

        return NextResponse.json(beds);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        // Auto-seed if empty
        const count = await Bed.countDocuments();
        if (count > 0) {
            return NextResponse.json({ message: "Beds already exist" });
        }

        const bedsToSeed = [];

        // Floor 1: General Ward (Rooms 101-105, 4 beds each)
        for (let r = 1; r <= 5; r++) {
            for (let b = 1; b <= 4; b++) {
                bedsToSeed.push({
                    bedNumber: `10${r}-${String.fromCharCode(64 + b)}`,
                    roomNumber: `10${r}`,
                    floor: "1st Floor",
                    ward: "General Ward",
                    type: "general",
                    status: Math.random() > 0.7 ? "occupied" : "available",
                    dailyRate: 500
                });
            }
        }

        // Floor 2: ICU (Rooms 201-205, 2 beds each)
        for (let r = 1; r <= 5; r++) {
            for (let b = 1; b <= 2; b++) {
                bedsToSeed.push({
                    bedNumber: `20${r}-ICU-${b}`,
                    roomNumber: `20${r}`,
                    floor: "2nd Floor",
                    ward: "ICU",
                    type: "icu",
                    status: Math.random() > 0.5 ? "occupied" : "available",
                    dailyRate: 2000
                });
            }
        }

        // Floor 3: Private (Rooms 301-310, 1 bed each)
        for (let r = 1; r <= 10; r++) {
            bedsToSeed.push({
                bedNumber: `3${r.toString().padStart(2, '0')}`,
                roomNumber: `3${r.toString().padStart(2, '0')}`,
                floor: "3rd Floor",
                ward: "Private",
                type: "private",
                status: Math.random() > 0.8 ? "maintenance" : (Math.random() > 0.6 ? "occupied" : "available"),
                dailyRate: 1500
            });
        }

        await Bed.insertMany(bedsToSeed);
        return NextResponse.json({ success: true, count: bedsToSeed.length });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
