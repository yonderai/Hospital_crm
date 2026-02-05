const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function checkJohn() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        const Patient = mongoose.model('Patient', new mongoose.Schema({
            firstName: String,
            lastName: String,
            mrn: String,
            latestAiInsight: String
        }), 'patients');

        const john = await Patient.findOne({ mrn: 'MRN-JOHN' });
        if (john) {
            console.log("Patient John Doe found.");
            console.log("latestAiInsight:", john.latestAiInsight);
        } else {
            console.log("Patient John Doe (MRN-JOHN) not found.");
        }

        const Appointment = mongoose.model('Appointment', new mongoose.Schema({
            patientId: mongoose.Schema.Types.ObjectId,
            aiInsight: String
        }), 'appointments');

        if (john) {
            const apts = await Appointment.find({ patientId: john._id });
            console.log(`Found ${apts.length} appointments for John Doe.`);
            apts.forEach((a, i) => {
                console.log(`Apt ${i + 1}: AI Insight exists? ${!!a.aiInsight}`);
                if (a.aiInsight) console.log(`   - ${a.aiInsight.substring(0, 30)}...`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkJohn();
