
const mongoose = require('mongoose');
const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-db";

const EmergencyCaseSchema = new Schema(
    {
        tempName: String,
        triageLevel: String,
        status: String,
        arrivalMode: String,
        chiefComplaint: String,
        vitals: Array,
        createdAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

const AmbulanceSchema = new Schema(
    {
        plateNumber: String,
        driverName: String,
        driverContact: String,
        status: String,
        eta: String,
        equipmentLevel: String
    },
    { timestamps: true }
);

const EmergencyCase = mongoose.models.EmergencyCase || mongoose.model("EmergencyCase", EmergencyCaseSchema);
const Ambulance = mongoose.models.Ambulance || mongoose.model("Ambulance", AmbulanceSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected...");

        // Clear existing
        await EmergencyCase.deleteMany({});
        await Ambulance.deleteMany({});

        // Create Ambulances
        const ambulances = [
            { plateNumber: "AMB-01", driverName: "John Doe", driverContact: "555-0101", status: "available", equipmentLevel: "als" },
            { plateNumber: "AMB-02", driverName: "Jane Smith", driverContact: "555-0102", status: "busy", eta: "5 mins", equipmentLevel: "icu" },
            { plateNumber: "AMB-03", driverName: "Mike Johnson", driverContact: "555-0103", status: "available", equipmentLevel: "basic" },
            { plateNumber: "AMB-04", driverName: "Sarah Connor", driverContact: "555-0104", status: "maintenance", equipmentLevel: "als" },
            { plateNumber: "AMB-05", driverName: "Rick Grimes", driverContact: "555-0105", status: "busy", eta: "12 mins", equipmentLevel: "icu" }
        ];

        await Ambulance.insertMany(ambulances);
        console.log("Ambulances seeded.");

        // Create Active Cases
        const cases = [
            { tempName: "Trauma A (Male 40s)", triageLevel: "P1", status: "treatment", arrivalMode: "ambulance", chiefComplaint: "Multiple fractures, unconscious", vitals: [{ bp: "90/60", pulse: 120, spo2: 92, temp: 36.5, gcs: 8 }] },
            { tempName: "Trauma B (Female 20s)", triageLevel: "P2", status: "treatment", arrivalMode: "ambulance", chiefComplaint: "Head injury, conscious", vitals: [{ bp: "110/70", pulse: 100, spo2: 98 }] },
            { tempName: "John Smith", triageLevel: "P3", status: "observation", arrivalMode: "walk-in", chiefComplaint: "Severe abdominal pain", vitals: [] },
            { tempName: "Jane Doe", triageLevel: "P4", status: "triage", arrivalMode: "walk-in", chiefComplaint: "High fever, dizziness", vitals: [] },
            { tempName: "Unknown (Child)", triageLevel: "P1", status: "treatment", arrivalMode: "police", chiefComplaint: "Seizures", vitals: [] }

        ];

        await EmergencyCase.insertMany(cases);
        console.log("Cases seeded.");

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

seed();
