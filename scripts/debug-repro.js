
const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function run() {
    console.log("Connecting to:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    console.log("Connected!");

    // Basic schemas (minimal for testing)
    const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({
        mrn: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        dob: { type: Date, required: true },
        gender: { type: String, required: true },
        contact: {
            phone: { type: String, required: true },
            email: { type: String }
        }
    }, { timestamps: true }));

    const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', new mongoose.Schema({
        orderId: { type: String, required: true, unique: true },
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
        tests: { type: [String], required: true },
        orderSource: { type: String, enum: ['internal', 'direct'], default: 'internal' },
        priority: { type: String, default: 'routine' },
        status: { type: String, default: 'ordered' }
    }, { timestamps: true }));

    try {
        console.log("Creating test patient...");
        const mrn = `REPRO-${Date.now()}`;
        const patient = await Patient.create({
            mrn,
            firstName: "Debug",
            lastName: "User",
            dob: new Date(),
            gender: "other",
            contact: {
                phone: "123-456-7890",
                email: ""
            }
        });
        console.log("Patient created:", patient._id);

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

        // Cleanup
        // await Patient.deleteOne({ _id: patient._id });
        // await LabOrder.deleteOne({ _id: order._id });
        console.log("Test successful!");
    } catch (err) {
        console.error("REPRO ERROR:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
