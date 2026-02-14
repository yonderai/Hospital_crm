import mongoose from 'mongoose';

const ComplaintSchema = new mongoose.Schema({
    complaintId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Billing', 'Staff Behavior', 'Facility Issue', 'Technical', 'General'],
        default: 'General'
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Pending', 'In Review', 'Resolved', 'Escalated'],
        default: 'Pending'
    },
    assignedTo: {
        type: String,
        default: 'HR Department'
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
