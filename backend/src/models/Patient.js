import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
    mrn: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    name: String, // Keep for legacy if needed
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, unique: true, sparse: true },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String
        }
    },
    emergencyContact: {
        name: String,
        phone: String,
        relation: String
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
