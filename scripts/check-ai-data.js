const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Patient = mongoose.model('Patient', new mongoose.Schema({
            firstName: String,
            lastName: String,
            latestAiInsight: String
        }), 'patients');

        const Appointment = mongoose.model('Appointment', new mongoose.Schema({
            appointmentId: String,
            aiInsight: String,
            createdAt: Date
        }), 'appointments');

        const latestPatients = await Patient.find({ latestAiInsight: { $exists: true, $ne: null } }).limit(5);
        console.log("\n--- Latest Patients with AI Insights ---");
        latestPatients.forEach(p => console.log(`${p.firstName} ${p.lastName}: ${p.latestAiInsight?.substring(0, 50)}...`));

        const latestAppointments = await Appointment.find({ aiInsight: { $exists: true, $ne: null } }).sort({ createdAt: -1 }).limit(5);
        console.log("\n--- Latest Appointments with AI Insights ---");
        latestAppointments.forEach(a => console.log(`${a.appointmentId}: ${a.aiInsight?.substring(0, 50)}...`));

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkData();
