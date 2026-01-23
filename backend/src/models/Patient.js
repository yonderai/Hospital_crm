import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String },
    kycVerified: { type: Boolean, default: false },
    medicalHistory: [{
        diagnosis: String,
        treatment: String,
        date: Date,
        doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    }],
    ongoingTreatment: { type: String },
    bloodGroup: { type: String },
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    },
    bedAllocated: {
        ward: String,
        bedNumber: String,
        allocatedAt: Date
    },
    insuranceDetails: {
        provider: String,
        policyNumber: String,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Patient', patientSchema);
