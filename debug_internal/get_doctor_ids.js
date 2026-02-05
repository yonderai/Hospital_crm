
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function getDoctorIds() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const usersCollection = mongoose.connection.collection('users');
        const doctors = await usersCollection.find({ role: 'doctor' }).toArray();

        console.log('--- Doctor IDs ---');
        doctors.forEach(d => {
            console.log(`Name: Dr. ${d.firstName} ${d.lastName}`);
            console.log(`ID: ${d._id}`);
            console.log(`Email: ${d.email}`);
            console.log('------------------');
        });

    } catch (error) {
        console.error('Error fetching doctors:', error);
    } finally {
        await mongoose.disconnect();
    }
}

getDoctorIds();
