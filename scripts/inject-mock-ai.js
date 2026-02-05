const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function inject() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Patient = mongoose.model('Patient', new mongoose.Schema({
            firstName: String,
            lastName: String,
            mrn: String,
            latestAiInsight: String
        }), 'patients');

        const Appointment = mongoose.model('Appointment', new mongoose.Schema({
            patientId: mongoose.Schema.Types.ObjectId,
            aiInsight: String
        }), 'appointments');

        const john = await Patient.findOne({ mrn: 'MRN-JOHN' });
        if (!john) throw new Error("John not found");

        const insight = "🧠 AI Clinical Insights (mocked)\n---------------------------------------------------\n• Reported symptoms: General checkup\n• Relevant history: None\n• Past medications: None\n• Possible conditions (non-diagnostic):\n  – Mild Stress\n• Suggested next checks:\n  – Blood Pressure Monitoring\n• Risk flags:\n  – None identified";

        // Update latest appointment
        const apt = await Appointment.findOneAndUpdate(
            { patientId: john._id },
            { aiInsight: insight },
            { sort: { createdAt: -1 }, new: true }
        );

        if (apt) {
            console.log("Appointment updated with AI insight.");
            // Also update patient record
            await Patient.findByIdAndUpdate(john._id, { latestAiInsight: insight });
            console.log("Patient record updated with latestAiInsight.");
        } else {
            console.log("No appointment found to update.");
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

inject();
