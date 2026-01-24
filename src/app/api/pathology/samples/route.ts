import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Sample from "@/lib/models/Sample";
import LabOrder from "@/lib/models/LabOrder";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        // Create new sample
        // sampleId should probably be auto-generated or passed. 
        // For simplicity assuming passed or generated here.
        const { orderId, patientId, testTypes, collectedBy, sampleId } = body;

        // Verify order exists
        const order = await LabOrder.findById(orderId);
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const newSample = await Sample.create({
            sampleId: sampleId || `SPL-${Date.now()}`,
            orderId,
            patientId,
            testTypes,
            collectedBy,
            status: "COLLECTED",
            collectedAt: new Date()
        });

        // Update Order status
        order.status = "collected";
        order.sampleCollectedAt = new Date();
        await order.save();

        return NextResponse.json(newSample);
    } catch (error) {
        console.error("Error creating sample:", error);
        return NextResponse.json(
            { error: "Failed to create sample" },
            { status: 500 }
        );
    }
}

export async function GET(req: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        const query = status ? { status } : {};

        const samples = await Sample.find(query)
            .populate("patientId", "firstName lastName")
            .populate("orderId", "orderId tests")
            .populate("collectedBy", "firstName lastName")
            .sort({ createdAt: -1 });

        return NextResponse.json(samples);
    } catch (error) {
        console.error("Error fetching samples:", error);
        return NextResponse.json(
            { error: "Failed to fetch samples" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { sampleId, status, processedAt, completedAt, notes } = body;

        const updateData: any = { status };
        if (processedAt) updateData.processedAt = processedAt;
        if (completedAt) updateData.completedAt = completedAt;
        if (notes) updateData.notes = notes;

        const updatedSample = await Sample.findOneAndUpdate(
            { _id: sampleId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedSample) {
            return NextResponse.json({ error: "Sample not found" }, { status: 404 });
        }

        return NextResponse.json(updatedSample);
    } catch (error) {
        console.error("Error updating sample:", error);
        return NextResponse.json(
            { error: "Failed to update sample" },
            { status: 500 }
        );
    }
}
