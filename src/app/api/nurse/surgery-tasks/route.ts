import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SurgeryOrder from '@/lib/models/SurgeryOrder';
import PostSurgeryInstruction from '@/lib/models/PostSurgeryInstruction';
import User from '@/lib/models/User';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'nurse') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status') || 'pending';

        // Get the current nurse's user ID
        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch pre-surgery orders assigned to this nurse
        const preSurgeryOrders = await SurgeryOrder.find({
            $or: [
                { assignedTo: currentUser._id },
                { assignedTo: null } // Unassigned orders visible to all nurses
            ],
            ...(status !== 'all' && { status })
        })
            .populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .populate('caseId', 'procedureName scheduledDate orRoomId status')
            .sort({ priority: -1, scheduledFor: 1, createdAt: -1 });

        // Fetch post-surgery instructions assigned to this nurse
        const postSurgeryInstructions = await PostSurgeryInstruction.find({
            $or: [
                { assignedTo: currentUser._id },
                { assignedTo: null } // Unassigned instructions visible to all nurses
            ],
            ...(status !== 'all' && { status })
        })
            .populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .populate('caseId', 'procedureName scheduledDate orRoomId status')
            .sort({ priority: -1, startTime: 1, createdAt: -1 });

        return NextResponse.json({
            preSurgeryOrders,
            postSurgeryInstructions
        });
    } catch (error: any) {
        console.error('Error fetching surgery tasks:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
