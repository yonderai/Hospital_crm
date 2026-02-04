import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PostSurgeryInstruction from '@/lib/models/PostSurgeryInstruction';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { caseId, patientId, instructions } = body;

        if (!caseId || !patientId || !instructions || !Array.isArray(instructions)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // Get the current doctor's user ID
        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create multiple post-surgery instructions
        const createdInstructions = await Promise.all(
            instructions.map(instruction =>
                PostSurgeryInstruction.create({
                    caseId,
                    patientId,
                    prescribedBy: currentUser._id,
                    assignedTo: instruction.assignedTo,
                    instructionType: instruction.instructionType,
                    instructions: instruction.instructions,
                    frequency: instruction.frequency,
                    duration: instruction.duration,
                    priority: instruction.priority || 'routine',
                    startTime: instruction.startTime,
                    endTime: instruction.endTime,
                    status: 'pending'
                })
            )
        );

        return NextResponse.json(createdInstructions, { status: 201 });
    } catch (error: any) {
        console.error('Error creating post-surgery instructions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const caseId = searchParams.get('caseId');
        const patientId = searchParams.get('patientId');
        const status = searchParams.get('status');

        const query: any = {};
        if (caseId) query.caseId = caseId;
        if (patientId) query.patientId = patientId;
        if (status) query.status = status;

        const instructions = await PostSurgeryInstruction.find(query)
            .populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .populate('caseId', 'procedureName scheduledDate orRoomId')
            .sort({ createdAt: -1 });

        return NextResponse.json(instructions);
    } catch (error: any) {
        console.error('Error fetching post-surgery instructions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { instructionId, status, nurseNotes } = body;

        if (!instructionId) {
            return NextResponse.json({ error: 'Instruction ID is required' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user?.email });

        const updateData: any = {};
        if (status) updateData.status = status;
        if (nurseNotes) updateData.nurseNotes = nurseNotes;

        if (status === 'completed') {
            updateData.completedAt = new Date();
            updateData.completedBy = currentUser?._id;
        }

        const updatedInstruction = await PostSurgeryInstruction.findByIdAndUpdate(
            instructionId,
            updateData,
            { new: true }
        ).populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName');

        return NextResponse.json(updatedInstruction);
    } catch (error: any) {
        console.error('Error updating post-surgery instruction:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
