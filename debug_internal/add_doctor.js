
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

async function addDoctor() {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI);
        }

        const usersCollection = mongoose.connection.collection('users');

        // Check if doctor exists first (to avoid duplicates if run multiple times)
        const existing = await usersCollection.findOne({ email: 'wilson@hospital.com' });
        if (existing) {
            console.log('Dr. Wilson already exists.');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10);

        const newDoctor = {
            firstName: 'James',
            lastName: 'Wilson',
            email: 'wilson@hospital.com',
            password: hashedPassword,
            role: 'doctor',
            department: 'Oncology',
            specialization: 'Oncologist',
            phone: '555-0123',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await usersCollection.insertOne(newDoctor);
        console.log('Added Dr. James Wilson.');

    } catch (error) {
        console.error('Error adding doctor:', error);
    } finally {
        await mongoose.disconnect();
    }
}

addDoctor();
