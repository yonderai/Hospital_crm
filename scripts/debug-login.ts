import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function check() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected');

        const email = 'nurse@medicore.com';
        console.log('Finding user:', email);
        const user = await User.findOne({ email });

        if (!user) {
            console.error('User NOT FOUND');
        } else {
            console.log('User found:', {
                id: user._id,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                passwordHash: user.password
            });

            const isValid = await bcrypt.compare('password123', user.password);
            console.log('Password valid:', isValid);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

check();
