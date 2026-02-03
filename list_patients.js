const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital_crm";

async function listAllPatients() {
    try {
        await mongoose.connect(MONGODB_URI);

        const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({
            firstName: String,
            lastName: String,
            contact: {
                email: String,
                phone: String
            }
        }));

        const patients = await Patient.find({});
        console.log(`Total Patients: ${patients.length}`);
        patients.forEach(p => {
            console.log(`- ${p.firstName} ${p.lastName} | Email: ${p.contact?.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listAllPatients();
