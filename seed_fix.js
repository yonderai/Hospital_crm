const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seed() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');
        console.log('DB Name:', mongoose.connection.db.databaseName);

        // Define schema
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true, index: true },
            employeeId: { type: String },
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

        // All system roles
        const roles = [
            { email: 'admin@medicore.com', role: 'admin', first: 'Admin', last: 'User', password: 'a' },
            { email: 'doctor@medicore.com', role: 'doctor', first: 'Gregory', last: 'House', dept: 'Diagnostic Medicine', password: 'a' },
            { email: 'nurse@medicore.com', role: 'nurse', first: 'Jackie', last: 'Peyton', password: 'a' },
            { email: 'lab@medicore.com', role: 'labtech', first: 'Dexter', last: 'Morgan', password: 'a' },
            { email: 'frontdesk@medicore.com', role: 'frontdesk', first: 'Pam', last: 'Beesly', password: 'a' },
            { email: 'pharmacy@medicore.com', role: 'pharmacist', first: 'Walter', last: 'White', password: 'a' }, // 'pharmacy_inventory' -> 'pharmacist' or keeping enum compatible? User.ts enum says 'pharmacist'.
            { email: 'billing@medicore.com', role: 'billing', first: 'Skyler', last: 'White', password: 'a' },
            { email: 'hr@medicore.com', role: 'hr', first: 'Toby', last: 'Flenderson', password: 'a' },
            { email: 'finance@hospital.com', role: 'finance', first: 'Gordon', last: 'Gekko', password: 'password123', employeeId: 'FIN-001' },
            { email: 'emergency@medicore.com', role: 'emergency', first: 'John', last: 'Carter', password: 'a', employeeId: 'EMG-001' },
            { email: 'maintenance@hospital.com', role: 'maintenance', first: 'Fix-It', last: 'Felix', password: 'a', employeeId: 'maintenance' },
            { email: 'backoffice@medicore.com', role: 'backoffice', first: 'Milton', last: 'Waddams', password: 'a' },
            { email: 'patient@medicore.com', role: 'patient', first: 'John', last: 'Doe', password: 'a' }
        ];

        // Hash "a" for everyone, or use individual if provided (but we are standardizing to 'a' as requested/implied)
        const hashedPassword = await bcrypt.hash('a', 10);

        let doctorId = null;

        // Clean up patients first
        await Patient.deleteMany({});

        for (const u of roles) {
            // Delete existing user if exists
            await User.deleteOne({ email: u.email });

            const user = await User.create({
                email: u.email,
                employeeId: u.employeeId,
                password: await bcrypt.hash(u.password, 10),
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
            console.log(`${u.role} created: ${user.email} (ID: ${user._id})`);

            if (u.role === 'doctor') doctorId = user._id;

            if (u.role === 'patient') {
                const savedPatient = await Patient.create({
                    mrn: `MRN-2026-0001`, // Fixed MRN for testing
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

                // Create an appointment for today
                const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', new mongoose.Schema({
                    appointmentId: String,
                    patientId: mongoose.Schema.Types.ObjectId,
                    providerId: mongoose.Schema.Types.ObjectId,
                    startTime: Date,
                    endTime: Date,
                    status: String,
                    type: String,
                    reason: String,
                    createdBy: String
                }));

                const today = new Date();
                today.setHours(10, 0, 0, 0); // 10:00 AM today
                const endTime = new Date(today);
                endTime.setHours(10, 30, 0, 0);

                await Appointment.deleteMany({}); // Clean old appointments

                await Appointment.create({
                    appointmentId: "APT-TEST-001",
                    patientId: savedPatient._id,
                    providerId: doctorId,
                    startTime: today,
                    endTime: endTime,
                    status: "scheduled",
                    type: "consultation",
                    reason: "Regular Checkup",
                    createdBy: "staff"
                });
                console.log("Seeded test appointment for today.");
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
