import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Complaint from '@/lib/models/Complaint';

export async function GET() {
    try {
        await dbConnect();

        let complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });

        // Seed some data if empty for demonstration
        if (complaints.length === 0) {
            const mockComplaints = [
                {
                    complaintId: "CMP-001",
                    name: "Rahul Sharma",
                    category: "Billing",
                    description: "Incorrect overcharge on pharmacy bill.",
                    priority: "High",
                    status: "Pending",
                    assignedTo: "Finance",
                    dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
                },
                {
                    complaintId: "CMP-002",
                    name: "Dr. Anjali Gupta",
                    category: "Technical",
                    description: "Diagnostic portal is slow during peak hours.",
                    priority: "Medium",
                    status: "In Review",
                    assignedTo: "IT Support",
                    dateSubmitted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
                },
                {
                    complaintId: "CMP-003",
                    name: "Sunita Verma",
                    category: "Staff Behavior",
                    description: "Front desk staff was unresponsive at night shift.",
                    priority: "Critical",
                    status: "Escalated",
                    assignedTo: "HR Admin",
                    dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
                },
                {
                    complaintId: "CMP-004",
                    name: "Vikram Singh",
                    category: "Facility Issue",
                    description: "AC not working in Room 302.",
                    priority: "Low",
                    status: "Resolved",
                    assignedTo: "Maintenance",
                    dateSubmitted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
                }
            ];
            await Complaint.insertMany(mockComplaints);
            complaints = await Complaint.find({}).sort({ dateSubmitted: -1 });
        }

        const stats = [
            { label: "Active Complaints", value: complaints.filter(c => c.status !== 'Resolved').length.toString(), change: "+12.5%", icon: "AlertCircle", color: "text-red-600", bg: "bg-red-50" },
            { label: "Pending Review", value: complaints.filter(c => c.status === 'Pending').length.toString(), change: "-3", icon: "Clock", color: "text-orange-600", bg: "bg-orange-50" },
            { label: "Resolved Cases", value: complaints.filter(c => c.status === 'Resolved').length.toString(), change: "+5", icon: "CheckCircle", color: "text-green-600", bg: "bg-green-50" },
            { label: "Escalated Cases", value: complaints.filter(c => c.status === 'Escalated').length.toString(), change: "+2", icon: "Activity", color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Avg Resolution", value: "2.4 Days", change: "-0.5d", icon: "Calendar", color: "text-blue-600", bg: "bg-blue-50" },
        ];

        return NextResponse.json({
            data: complaints.map(c => ({
                _id: c._id,
                id: c.complaintId,
                name: c.name,
                category: c.category,
                description: c.description,
                priority: c.priority,
                status: c.status,
                assignedTo: c.assignedTo || 'Operations',
                date: new Date(c.dateSubmitted).toLocaleDateString(),
                value: c.status
            })),
            stats
        });
    } catch (error) {
        console.error("Complaints API Error:", error);
        return NextResponse.json({ error: "Failed to fetch complaints" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, category, description, priority } = body;

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
        }

        const lastComplaint = await Complaint.findOne({}).sort({ createdAt: -1 });
        let nextId = "CMP-001";
        if (lastComplaint && lastComplaint.complaintId) {
            const num = parseInt(lastComplaint.complaintId.split('-')[1]) + 1;
            nextId = `CMP-${num.toString().padStart(3, '0')}`;
        }

        const newComplaint = await Complaint.create({
            complaintId: nextId,
            name,
            category,
            description,
            priority: priority || 'Medium',
            status: 'Pending'
        });

        return NextResponse.json({ message: "Complaint created successfully", data: newComplaint }, { status: 201 });
    } catch (error) {
        console.error("Create Complaint Error:", error);
        return NextResponse.json({ error: "Failed to create complaint" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, status, assignedTo } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
        }

        const updated = await Complaint.findByIdAndUpdate(
            id,
            { status, assignedTo },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: "Complaint not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Complaint updated successfully", data: updated });
    } catch (error) {
        console.error("Update Complaint Error:", error);
        return NextResponse.json({ error: "Failed to update complaint" }, { status: 500 });
    }
}
