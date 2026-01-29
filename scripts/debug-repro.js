
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Attempt to load .env manually if not already loaded (for portability)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
    });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function run() {
    console.log("Connecting to:", MONGODB_URI.split('@').pop()); // Hide credentials in log

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("Connected successfully!");

        // Align schemas with src/lib/models/
        const PatientSchema = new mongoose.Schema({
            mrn: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dob: { type: Date, required: true },
            gender: { type: String, required: true },
            contact: {
                phone: { type: String, required: true },
                email: { type: String, unique: true, sparse: true }
            }
        }, { timestamps: true });

        const LabOrderSchema = new mongoose.Schema({
            orderId: { type: String, required: true, unique: true },
            patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
            tests: { type: [String], required: true },
            orderSource: { type: String, enum: ['internal', 'direct'], default: 'internal' },
            priority: { type: String, enum: ['routine', 'urgent', 'stat'], default: 'routine' },
            status: { type: String, enum: ['ordered', 'scheduled', 'collected', 'in-progress', 'completed', 'cancelled'], default: 'ordered' }
        }, { timestamps: true });

        const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
        const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', LabOrderSchema);

        console.log("Creating test patient...");
        const mrn = `REPRO-${Date.now()}`;
        const patient = await Patient.findOneAndUpdate(
            { mrn: "DEBUG-REPRO-PATIENT" },
            {
                mrn: "DEBUG-REPRO-PATIENT",
                firstName: "Debug",
                lastName: "User",
                dob: new Date("1990-01-01"),
                gender: "other",
                contact: {
                    phone: "123-456-7890",
                    email: `debug-${Date.now()}@example.com`
                }
            },
            { upsert: true, new: true }
        );
        console.log("Patient ready:", patient._id);

        console.log("Creating test order...");
        const order = await LabOrder.create({
            orderId: `ORDER-${Date.now()}`,
            patientId: patient._id,
            tests: ["Reproduction Test"],
            orderSource: "direct",
            priority: "routine",
            status: "ordered"
        });
        console.log("Order created:", order.orderId);

        console.log("Test successful!");
    } catch (err) {
        console.error("REPRO ERROR:", err.message);
        if (err.name === 'MongoServerError' && err.code === 11000) {
            console.log("Note: Duplicate key error (expected if running multiple times without cleanup)");
        }
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected.");
    }
}

run();
