
const mongoose = require('mongoose');
// Adjust path as needed, assuming User model is here
require('dotenv').config({ path: '.env' });

async function countDoctors() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        // Assuming User model has a 'role' field. 
        // If the model path is wrong, I might need to correct it.
        // I recall User model is in src/lib/models/User.ts, so requiring it might need compilation or using ts-node.
        // But let's try reading the collection directly if model requires TS.

        const db = mongoose.connection.db;
        // Wait for connection to be established if using mongoose.connect without await previously (though await is there)

        // Actually, let's just use the connection directly to query the 'users' collection 
        // to avoid TS model matching issues in a JS script if possible.
        const usersCollection = mongoose.connection.collection('users');
        const doctors = await usersCollection.find({ role: 'doctor' }).toArray();

        console.log(`Number of doctors found: ${doctors.length}`);
        doctors.forEach(d => console.log(`- Dr. ${d.firstName} ${d.lastName} (${d.department})`));

    } catch (error) {
        console.error('Error counting doctors:', error);
    } finally {
        await mongoose.disconnect();
    }
}

countDoctors();
