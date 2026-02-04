import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';
import dotenv from 'dotenv';
import path from 'path';

// Load .env
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

async function addNurse() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        const email = 'nurse2@medicore.com';

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            console.log('Nurse 2 already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash('a', 10);

        await User.create({
            email,
            password: hashedPassword,
            role: 'nurse',
            firstName: 'Sarah',
            lastName: 'Harding',
            isActive: true,
            permissions: { canView: [], canEdit: [], canDelete: [], canApprove: [] }
        });

        console.log('Nurse 2 created: nurse2@medicore.com');
        process.exit(0);
    } catch (error) {
        console.error('Failed to add nurse:', error);
        process.exit(1);
    }
}

addNurse();
