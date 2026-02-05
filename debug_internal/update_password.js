
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

async function updatePassword() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const usersCollection = mongoose.connection.collection('users');
        const hashedPassword = await bcrypt.hash('a', 10);

        await usersCollection.updateOne(
            { email: 'wilson@hospital.com' },
            { $set: { password: hashedPassword } }
        );

        console.log('Updated Dr. Wilson password to "a".');

    } catch (error) {
        console.error('Error updating password:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updatePassword();
