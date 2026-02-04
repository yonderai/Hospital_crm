const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI;

async function addNurse() {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI not found");
        }
        console.log('Connecting...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const email = 'nurse2@medicore.com';

        // Check if exists
        const userModel = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
            email: String,
            password: { type: String, required: true },
            role: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            isActive: { type: Boolean, default: true },
            permissions: {
                canView: { type: [String], default: [] },
                canEdit: { type: [String], default: [] },
                canDelete: { type: [String], default: [] },
                canApprove: { type: [String], default: [] },
            }
        }));

        const existing = await userModel.findOne({ email });
        if (existing) {
            console.log('Nurse 2 already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('a', 10);

        await userModel.create({
            email,
            password: hashedPassword,
            role: 'nurse',
            firstName: 'Sarah',
            lastName: 'Harding',
            isActive: true,
            permissions: { canView: ['all'], canEdit: ['all'], canDelete: [], canApprove: [] }
        });

        console.log('Nurse 2 created: nurse2@medicore.com');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

addNurse();
