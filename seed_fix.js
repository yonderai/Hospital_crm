const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seed() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Define schema
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true, index: true },
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

        // Ensure we don't get "OverwriteModelError" if running again in same process
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const patientSchema = new mongoose.Schema({
            mrn: { type: String, required: true, unique: true, index: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            dob: { type: Date, required: true },
            gender: { type: String, required: true },
            contact: {
                phone: { type: String },
                email: { type: String },
                address: { type: String },
            },
            assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            bloodType: { type: String },
            allergies: { type: [String], default: [] },
            chronicConditions: { type: [String], default: [] },
        }, { timestamps: true });

        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

        const roles = [
            { email: 'admin@medicore.com', role: 'admin', first: 'Admin', last: 'User' },
            { email: 'doctor@medicore.com', role: 'doctor', first: 'Gregory', last: 'House', dept: 'Diagnostic Medicine' },
            { email: 'nurse@medicore.com', role: 'nurse', first: 'Jackie', last: 'Peyton' },
            { email: 'lab@medicore.com', role: 'labtech', first: 'Dexter', last: 'Morgan' },
            { email: 'frontdesk@medicore.com', role: 'frontdesk', first: 'Pam', last: 'Beesly' },
            { email: 'pharmacy@medicore.com', role: 'pharmacy_inventory', first: 'Walter', last: 'White' },
            { email: 'billing@medicore.com', role: 'billing', first: 'Skyler', last: 'White' },
            { email: 'hr@medicore.com', role: 'hr', first: 'Toby', last: 'Flenderson' },
            { email: 'patient@medicore.com', role: 'patient', first: 'John', last: 'Doe' }
        ];

        const hashedPassword = await bcrypt.hash('password123', 10);

        let doctorId = null;

        // Clean up patients first
        await Patient.deleteMany({});

        for (const u of roles) {
            // Delete existing user if exists
            await User.deleteOne({ email: u.email });

            const user = await User.create({
                email: u.email,
                password: hashedPassword,
                role: u.role,
                firstName: u.first,
                lastName: u.last,
                isActive: true,
                department: u.dept || "",
                permissions: {
                    canView: ['all'],
                    canEdit: ['all'],
                    canDelete: [],
                    canApprove: ['all']
                }
            });
            console.log(`${u.role} created: ${user.email}`);

            if (u.role === 'doctor') doctorId = user._id;

            if (u.role === 'patient') {
                await Patient.create({
                    mrn: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
                    firstName: u.first,
                    lastName: u.last,
                    dob: new Date('1985-05-15'),
                    gender: 'Male',
                    contact: {
                        email: u.email,
                        phone: '555-0123',
                        address: '123 Fake St, Medicore City'
                    },
                    bloodType: 'O+',
                    allergies: ['Peanuts'],
                    chronicConditions: ['Hypertension'],
                    assignedDoctorId: doctorId
                });
                console.log(`Patient profile created for: ${u.email}`);
            }
        }

        console.log('Seeding complete!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
