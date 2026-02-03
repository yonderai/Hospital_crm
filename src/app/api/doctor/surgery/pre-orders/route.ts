import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SurgeryOrder from '@/lib/models/SurgeryOrder';
import User from '@/lib/models/User';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { caseId, patientId, orders } = body;

        if (!caseId || !patientId || !orders || !Array.isArray(orders)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        // Get the current doctor's user ID
        const currentUser = await User.findOne({ email: session.user?.email });
        if (!currentUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Create multiple surgery orders
        const createdOrders = await Promise.all(
            orders.map(order =>
                SurgeryOrder.create({
                    caseId,
                    patientId,
                    prescribedBy: currentUser._id,
                    assignedTo: order.assignedTo,
                    orderType: order.orderType,
                    instructions: order.instructions,
                    priority: order.priority || 'routine',
                    scheduledFor: order.scheduledFor,
                    status: 'pending'
                })
            )
        );

        return NextResponse.json(createdOrders, { status: 201 });
    } catch (error: any) {
        console.error('Error creating surgery orders:', error);
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

        const orders = await SurgeryOrder.find(query)
            .populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .populate('caseId', 'procedureName scheduledDate orRoomId')
            .sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error: any) {
        console.error('Error fetching surgery orders:', error);
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
        const { orderId, status, nurseNotes } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
        }

        const currentUser = await User.findOne({ email: session.user?.email });

        const updateData: any = {};
        if (status) updateData.status = status;
        if (nurseNotes) updateData.nurseNotes = nurseNotes;

        if (status === 'completed') {
            updateData.completedAt = new Date();
            updateData.completedBy = currentUser?._id;
        }

        const updatedOrder = await SurgeryOrder.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate('patientId', 'firstName lastName mrn')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName');

        return NextResponse.json(updatedOrder);
    } catch (error: any) {
        console.error('Error updating surgery order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
