import mongoose from 'mongoose';

const AmbulanceSchema = new mongoose.Schema(
    {
        plateNumber: { type: String, required: true, unique: true },
        driverName: { type: String, required: true },
        driverContact: { type: String, required: true },
        status: {
            type: String,
            required: true,
            enum: ["available", "busy", "maintenance"],
            default: "available"
        },
        currentLocation: { type: String },
        eta: { type: String },
        activeCaseId: { type: mongoose.Schema.Types.ObjectId, ref: "EmergencyCase" },
        equipmentLevel: {
            type: String,
            required: true,
            enum: ["basic", "als", "icu"],
            default: "basic"
        }
    },
    { timestamps: true }
);

export default mongoose.model("Ambulance", AmbulanceSchema);
