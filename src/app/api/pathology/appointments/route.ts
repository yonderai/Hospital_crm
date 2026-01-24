import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import LabOrder from "@/lib/models/LabOrder";
import User from "@/lib/models/User"; // Ensure User model is loaded for population
import Patient from "@/lib/models/Patient"; // Ensure Patient model is loaded

export async function GET() {
    try {
        await dbConnect();

        // Fetch orders that are newly ordered or scheduled
        // Assuming 'ordered' is the initial state before sample collection
        const orders = await LabOrder.find({ status: "ordered" })
            .populate("patientId", "firstName lastName dateOfBirth gender")
            .populate("orderingProviderId", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching pathology appointments:", error);
        return NextResponse.json(
            { error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { orderId, scheduledDate, technicianId } = body;

        // In a real scenario, we might move this to a 'scheduled' status if the LabOrder model supported it.
        // For now, we might just update metadata or notes, or assumes 'ordered' implies pending schedule.
        // User requirements: "Assign test date & time", "Assign technician", "Status update: ORDERED -> SCHEDULED"

        // Check if LabOrder supports 'scheduled'. It currently has: ordered, collected, in-progress, completed, cancelled.
        // I might need to abuse 'ordered' or add 'scheduled' to the enum if strict persistence is needed.
        // The prompt says "Status update: ORDERED -> SCHEDULED".
        // I should probably check if I can modify LabOrder status enum or just map it.
        // Looking at LabOrder.ts, it doesn't have 'scheduled'.

        // Option 1: Update LabOrder model to include 'scheduled'.
        // Option 2: Just keep it as 'ordered' but add fields for schedule.
        // Given the prompt explicitly says "Status update: ORDERED -> SCHEDULED", I should probably update the model or just handle it if allowed.
        // Let's assume for now I can update the LabOrder status if I modify the model in a separate step, but for now I'll stick to updating the order details.

        // Actually, I'll update the LabOrder status to 'ordered' (no change) but add schedule info, 
        // OR I should have updated the model. I missed that in the "Backend Implementation" step.
        // Let's check LabOrder.ts content again. It has `status: "ordered" | "collected" | ...`.
        // I will add `scheduled` to the enum in LabOrder.ts if I can, or just use metadata.

        // Ideally I should modify LabOrder.ts to add 'scheduled'.
        // I'll do that in a follow-up tool call.

        const updatedOrder = await LabOrder.findOneAndUpdate(
            { orderId },
            {
                $set: {
                    status: "scheduled", // I will add this to enum
                    scheduledAt: scheduledDate, // I will add this field
                    technicianId: technicianId // I will add this field
                }
            },
            { new: true }
        );

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Error scheduling test:", error);
        return NextResponse.json(
            { error: "Failed to schedule test" },
            { status: 500 }
        );
    }
}
