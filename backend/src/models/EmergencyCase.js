import mongoose from 'mongoose';

const EmergencyCaseSchema = new mongoose.Schema(
    {
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
        tempName: { type: String },
        mrn: { type: String },
        age: { type: Number },
        gender: { type: String },
        triageLevel: {
            type: String,
            required: true,
            enum: ["P1", "P2", "P3", "P4", "P5"],
            default: "P3"
        },
        vitals: [
            {
                recordedAt: { type: Date, default: Date.now },
                bp: String,
                pulse: Number,
                spo2: Number,
                temp: Number,
                gcs: Number,
                painScale: Number,
                takenBy: String
            }
        ],
        status: {
            type: String,
            required: true,
            enum: ["triage", "treatment", "observation", "admitted", "discharged", "expired"],
            default: "triage"
        },
        assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        chiefComplaint: { type: String, required: true },
        notes: { type: String },
        arrivalMode: {
            type: String,
            required: true,
            enum: ["ambulance", "walk-in", "referral", "police"],
            default: "walk-in"
        },
        ambulanceId: { type: mongoose.Schema.Types.ObjectId, ref: "Ambulance" },
    },
    { timestamps: true }
);

export default mongoose.model("EmergencyCase", EmergencyCaseSchema);
