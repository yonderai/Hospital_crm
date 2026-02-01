const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local if it exists, else .env
dotenv.config();

const PatientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mrn: String
});
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    startTime: Date,
    status: String
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

async function run() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const searchTerms = ['Shruti', 'Sharma', 'MRN'];

        for (const search of searchTerms) {
            console.log(`\nTesting search for: "${search}"`);
            const regex = new RegExp(search, 'i');
            const matchedPatients = await Patient.find({
                $or: [
                    { firstName: { $regex: regex } },
                    { lastName: { $regex: regex } },
                    { mrn: { $regex: regex } }
                ]
            }).distinct('_id');

            console.log('Matched Patient IDs:', matchedPatients);

            if (matchedPatients.length > 0) {
                const appts = await Appointment.find({ patientId: { $in: matchedPatients } }).populate('patientId');
                console.log(`Found ${appts.length} appointments`);
                appts.slice(0, 3).forEach(a => {
                    console.log(` - [${a.status}] ${a.patientId.firstName} ${a.patientId.lastName} (MRN: ${a.patientId.mrn})`);
                });
            } else {
                console.log('No patients matched');
            }
        }

    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
