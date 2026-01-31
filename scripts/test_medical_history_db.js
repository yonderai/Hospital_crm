const mongoose = require('mongoose');

// Use local URI as used in .env
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_crm";

async function verify() {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Define a schema sufficient to text the patientUpdates field
        // We use 'Patient' as model name to match existing collection
        const PatientSchema = new mongoose.Schema({
            patientUpdates: [{
                category: { type: String, enum: ['allergy', 'condition', 'surgery', 'medication', 'family', 'other'], required: true },
                description: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' }
            }]
        }, { strict: false }); // strict: false allows us to not define all other fields

        const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

        // Find the seeded patient
        const patient = await Patient.findOne({ "contact.email": "patient@medicore.com" });

        if (!patient) {
            console.error("Patient not found! Did you run seed?");
            return;
        }

        console.log("Found patient:", patient._id);

        // Test Good Update
        console.log("Testing valid update...");
        patient.patientUpdates = patient.patientUpdates || [];
        patient.patientUpdates.push({
            category: 'allergy',
            description: 'Peanut Butter (Self Reported)',
            status: 'pending'
        });

        await patient.save();
        console.log("Valid update saved successfully.");

        // Verify it exists in DB
        const p2 = await Patient.findById(patient._id);
        const lastUpdate = p2.patientUpdates[p2.patientUpdates.length - 1];
        if (lastUpdate.description === 'Peanut Butter (Self Reported)') {
            console.log("Verification PASSED: Update persisted in DB.");
        } else {
            console.error("Verification FAILED: Update not found.");
        }

        // Test Bad Update (Invalid Category)
        console.log("Testing invalid update (bad category)...");
        try {
            p2.patientUpdates.push({
                category: 'invalid_category',
                description: 'Should fail',
                status: 'pending'
            });
            await p2.save();
            console.error("Verification FAILED: Invalid category should have thrown error.");
        } catch (e) {
            console.log("Verification PASSED: Caught expected error for invalid category:", e.message);
        }

    } catch (err) {
        console.error("Script failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

verify();
