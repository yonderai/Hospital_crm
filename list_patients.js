const mongoose = require('mongoose');
const path = require('path');

// Mocking required env vars or importing them if possible
// For simplicity, I'll try to use the existing dbConnect logic
require('dotenv').config();

async function run() {
    try {
        const db = require('./src/lib/mongoose').default;
        const Patient = require('./src/lib/models/Patient').default;

        await db();
        const patients = await Patient.find({ firstName: /shruti/i }).lean();
        console.log("MATCHING PATIENTS:");
        patients.forEach(p => {
            console.log(`Name: ${p.firstName} ${p.lastName}, Email: ${p.contact.email}, DOB: ${p.dob}, Age: ${p.age}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
