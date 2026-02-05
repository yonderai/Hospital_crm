
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

async function updateDrHouse() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const usersCollection = mongoose.connection.collection('users');

        await usersCollection.updateOne(
            { email: 'house@hospital.com' }, // Assuming this is his email, or I can search by name
            { $set: { department: 'Diagnostics' } }
        );

        // Also a fallback if email is different, let's find by name
        await usersCollection.updateOne(
            { firstName: 'Gregory', lastName: 'House', department: { $exists: false } },
            { $set: { department: 'Diagnostics' } }
        );

        console.log('Updated Dr. House department.');

    } catch (error) {
        console.error('Error updating doctor:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateDrHouse();
