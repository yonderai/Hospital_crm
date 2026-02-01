const mongoose = require('mongoose');
require('dotenv').config();

const dbUri = process.env.MONGODB_URI;

async function run() {
    await mongoose.connect(dbUri);
    console.log('Connected to MongoDB');

    const Encounter = mongoose.model('Encounter', new mongoose.Schema({}));
    const encounters = await Encounter.find({}).limit(5);

    console.log('Existing Encounters:');
    encounters.forEach(e => {
        console.log(`- ID: ${e._id}, Complaint: ${e.chiefComplaint}`);
    });

    const Appointment = mongoose.model('Appointment', new mongoose.Schema({}));
    const appointments = await Appointment.find({}).limit(5);

    console.log('Existing Appointments:');
    appointments.forEach(a => {
        console.log(`- ID: ${a._id}, Reason: ${a.reason}`);
    });

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
