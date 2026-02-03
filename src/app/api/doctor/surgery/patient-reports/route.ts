import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import RadiologyReport from '@/lib/models/RadiologyReport';
import LabOrder from '@/lib/models/LabOrder';
import SurgeryOrder from '@/lib/models/SurgeryOrder';
import PostSurgeryInstruction from '@/lib/models/PostSurgeryInstruction';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== 'doctor') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        // Fetch radiology reports
        const radiologyReports = await RadiologyReport.find({ patientId })
            .populate('orderId', 'testType orderDate')
            .populate('interpretedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(10);

        // Fetch lab orders (which contain results)
        const labOrders = await LabOrder.find({ patientId })
            .populate('orderingProviderId', 'firstName lastName')
            .populate('reviewedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(20);

        // Fetch pre-surgery orders
        const preSurgeryOrders = await SurgeryOrder.find({ patientId })
            .populate('caseId', 'procedureName scheduledDate')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(20);

        // Fetch post-surgery instructions
        const postSurgeryInstructions = await PostSurgeryInstruction.find({ patientId })
            .populate('caseId', 'procedureName scheduledDate')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json({
            radiologyReports,
            labResults: labOrders,
            preSurgeryOrders,
            postSurgeryInstructions
        });
    } catch (error: any) {
        console.error('Error fetching patient reports:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
