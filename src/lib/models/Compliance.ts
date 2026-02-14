import mongoose from 'mongoose';

const ComplianceSchema = new mongoose.Schema({
    complianceId: {
        type: String,
        required: true,
        unique: true
    },
    staffName: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    complianceType: {
        type: String,
        enum: ['Safety Training', 'Payroll Audit', 'Attendance Policy', 'Data Privacy', 'Inventory Audit', 'Other'],
        default: 'Other'
    },
    status: {
        type: String,
        enum: ['Compliant', 'Pending', 'Overdue', 'Under Review'],
        default: 'Pending'
    },
    riskLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    lastReviewDate: {
        type: Date
    },
    nextReviewDate: {
        type: Date
    },
    assignedReviewer: {
        type: String,
        default: 'HR Manager'
    }
}, {
    timestamps: true
});

export default mongoose.models.Compliance || mongoose.model('Compliance', ComplianceSchema);
