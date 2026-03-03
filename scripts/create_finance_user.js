const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' }); // Adjust path as scripts is usually in root or scripts folder. This file is in scripts/

// Fallback URI if dotenv fails or .env is in a different place relative to where we run
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
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
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createFinanceUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'finance@hospital.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            console.log('Finance user already exists.');
            // Update role and password to ensuring we know the login
            existingUser.role = 'finance';
            existingUser.password = hashedPassword;
            await existingUser.save();
            console.log('Updated existing user role and password.');
        } else {
            const newUser = new User({
                firstName: 'Finance',
                lastName: 'Manager',
                email: email,
                password: hashedPassword,
                role: 'finance',
                isActive: true
            });

            await newUser.save();
            console.log('Created new finance user.');
        }

        console.log('-----------------------------------');
        console.log('Credentials:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

createFinanceUser();
