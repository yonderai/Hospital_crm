import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../config/roles.js';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: [true, 'Please add a name'], // Made optional as we use firstName/lastName
    },
    firstName: { type: String },
    lastName: { type: String },
    department: { type: String },
    employeeId: { type: String },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 1, // Relaxed from 6
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(ROLES), // Now includes 'maintenance' from our previous fix
        default: ROLES.PATIENT,
    },
    isActive: { type: Boolean, default: true },
    forcePasswordChange: { type: Boolean, default: false },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
