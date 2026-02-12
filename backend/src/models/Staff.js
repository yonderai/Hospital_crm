import mongoose from 'mongoose';

const StaffSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    bankDetails: {
        accountName: { type: String },
        accountNumber: { type: String },
        bankName: { type: String },
        ifscCode: { type: String },
    },
    dateJoined: { type: Date, required: true },
    status: {
        type: String,
        required: true,
        enum: ['active', 'on-leave', 'terminated'],
        default: 'active'
    },
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model('Staff', StaffSchema);
