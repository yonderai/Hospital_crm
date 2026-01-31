const mongoose = require('mongoose');

// Need the connection string. I'll look for it in .env or just use the system default if I can find it.
// I'll check .env first.
const fs = require('fs');
const dotenv = require('dotenv');

if (fs.existsSync('.env.local')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) { process.env[k] = envConfig[k]; }
} else if (fs.existsSync('.env')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    for (const k in envConfig) { process.env[k] = envConfig[k]; }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    process.exit(1);
}

async function run() {
    try {
        await mongoose.connect(MONGODB_URI);
        const patientSchema = new mongoose.Schema({}, { strict: false });
        const Patient = mongoose.model('Patient', patientSchema, 'patients');

        const patients = await Patient.find({ firstName: /shruti/i }).lean();
        console.log("MATCHING PATIENTS:");
        console.log(JSON.stringify(patients, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
