const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function findAny() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Patient = mongoose.model('Patient', new mongoose.Schema({
            firstName: String,
            lastName: String,
            latestAiInsight: String
        }), 'patients');

        const successPatients = await Patient.find({ latestAiInsight: { $exists: true, $ne: null, $ne: "" } });
        console.log(`Found ${successPatients.length} patients with AI insights.`);
        successPatients.forEach(p => console.log(`${p.firstName} ${p.lastName}: ${p.latestAiInsight.substring(0, 50)}...`));

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

findAny();
