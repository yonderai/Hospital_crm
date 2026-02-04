import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import LabOrder from '@/lib/models/LabOrder';
import ImagingOrder from '@/lib/models/ImagingOrder';
import RadiologyReport from '@/lib/models/RadiologyReport';
import ORCase from '@/lib/models/ORCase';
import SurgeryOrder from '@/lib/models/SurgeryOrder';
import PostSurgeryInstruction from '@/lib/models/PostSurgeryInstruction';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            console.error('No session found - user not authenticated');
            return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const patientId = searchParams.get('patientId');

        if (!patientId) {
            console.error('No patientId provided in request');
            return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
        }

        console.log('Fetching patient reports for:', patientId);

        // 1. RADIOLOGY REPORTS - Fetch completed imaging with final reports
        const imagingOrders = await ImagingOrder.find({
            patientId,
            status: 'completed'
        }).lean();

        const orderIds = imagingOrders.map(order => order._id);
        const radiologyReports = await RadiologyReport.find({
            orderId: { $in: orderIds },
            status: { $in: ['final', 'corrected', 'preliminary'] }
        }).lean();

        // Create map of orderId to report
        const reportMap = new Map();
        radiologyReports.forEach(report => {
            reportMap.set(report.orderId.toString(), report);
        });

        const normalizedRadiology = imagingOrders
            .map((item: any) => {
                const report = reportMap.get(item._id.toString());
                if (!report) return null; // Only show imaging orders that have reports

                return {
                    id: item._id,
                    type: 'radiology',
                    title: `${item.imagingType} - ${item.bodyPart}`,
                    date: report.createdAt || item.createdAt,
                    status: report.status,
                    summary: report.impression || 'Report Available',
                    details: {
                        ...item,
                        report: report
                    }
                };
            })
            .filter(Boolean); // Remove nulls

        console.log(`✅ Radiology reports: ${normalizedRadiology.length}`);

        // 2. LAB RESULTS - Fetch completed lab orders with results
        const labOrders = await LabOrder.find({
            patientId,
            status: 'completed',
            results: { $exists: true, $ne: [] }
        }).lean();

        const normalizedLabs = labOrders.map((item: any) => ({
            id: item._id,
            type: 'lab',
            title: item.tests.join(', '),
            date: item.resultDate || item.updatedAt || item.createdAt,
            status: 'completed',
            summary: item.results && item.results.length > 0
                ? `${item.results[0].value} ${item.results[0].unit}`
                : 'Report Available',
            details: {
                ...item,
                testType: item.tests.join(', '),
                resultValue: item.results?.[0]?.value,
                unit: item.results?.[0]?.unit,
                results: item.results
            }
        }));

        console.log(`✅ Lab results: ${normalizedLabs.length}`);

        // 3. SURGERY ORDERS - Only show COMPLETED orders (nurse has filled details)
        const preSurgeryOrders = await SurgeryOrder.find({
            patientId,
            status: 'completed' // Only show orders completed by nurses
        })
            .populate('caseId', 'procedureName scheduledDate startTime orRoomId')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .sort({ completedAt: -1 })
            .limit(20)
            .lean();

        const postSurgeryInstructions = await PostSurgeryInstruction.find({
            patientId,
            status: 'completed' // Only show completed instructions
        })
            .populate('caseId', 'procedureName scheduledDate startTime orRoomId')
            .populate('prescribedBy', 'firstName lastName')
            .populate('assignedTo', 'firstName lastName')
            .populate('completedBy', 'firstName lastName')
            .sort({ completedAt: -1 })
            .limit(20)
            .lean();

        const normalizedSurgery = preSurgeryOrders.map((item: any) => ({
            id: item._id,
            type: 'surgery',
            title: item.orderType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            date: item.completedAt || item.createdAt,
            status: item.status,
            summary: item.nurseNotes || item.instructions,
            details: {
                ...item,
                procedureName: item.caseId?.procedureName
            }
        }));

        const normalizedInstructions = postSurgeryInstructions.map((item: any) => ({
            id: item._id,
            type: 'instruction',
            title: item.instructionType.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            date: item.completedAt || item.createdAt,
            status: item.status,
            summary: item.nurseNotes || item.instructions,
            details: {
                ...item,
                procedureName: item.caseId?.procedureName
            }
        }));

        console.log(`✅ Surgery Reports: ${normalizedSurgery.length + normalizedInstructions.length}`);

        // Combine and sort all results by date
        const combinedResults = [...normalizedRadiology, ...normalizedLabs, ...normalizedSurgery, ...normalizedInstructions].sort((a, b) => {
            const dateA = a?.date ? new Date(a.date).getTime() : 0;
            const dateB = b?.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });

        console.log('📊 Patient Reports Summary:', {
            patientId,
            radiologyReports: normalizedRadiology.length,
            labResults: normalizedLabs.length,
            surgeryOrders: normalizedSurgery.length,
            postInstructions: normalizedInstructions.length,
            totalReports: combinedResults.length
        });

        return NextResponse.json({
            results: combinedResults, // For the Report Viewer style display
            radiologyReports: normalizedRadiology,
            labResults: normalizedLabs,
            preSurgeryOrders,
            postSurgeryInstructions
        });
    } catch (error: any) {
        console.error('Error fetching patient reports:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch reports' }, { status: 500 });
    }
}
