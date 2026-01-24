const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seedStrict() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Schemas (Minimal for seeding)
        const userSchema = new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            isActive: { type: Boolean, default: true },
            department: { type: String },
            customId: { type: String } // For DOC001
        }, { strict: false });
        const User = mongoose.models.User || mongoose.model('User', userSchema);

        const patientSchema = new mongoose.Schema({
            mrn: { type: String, required: true, unique: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            assignedDoctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            dob: Date,
            gender: String,
            contact: Object,
            allergies: [String],
            chronicConditions: [String]
        }, { strict: false });
        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

        const hashedPassword = await bcrypt.hash('password123', 10);

        // 1. Create Doctors
        const doctors = [
            { id: 'DOC001', email: 'doctor1@hospital.com', first: 'Yuvraj', last: 'Singh', dept: 'General Medicine' },
            { id: 'DOC002', email: 'doctor2@hospital.com', first: 'Gregory', last: 'House', dept: 'Oncology' }
        ];

        const docMap = {};

        for (const d of doctors) {
            await User.deleteOne({ email: d.email });
            const doc = await User.create({
                email: d.email,
                password: hashedPassword,
                role: 'doctor',
                firstName: d.first,
                lastName: d.last,
                department: d.dept,
                customId: d.id,
                permissions: { canView: ['all'], canEdit: ['all'] }
            });
            docMap[d.id] = doc._id;
            console.log(`Created Doctor: ${d.first} ${d.last} (${d.email})`);
        }

        // 1.5 Create Front Desk
        const fdEmail = 'frontdesk@medicore.com';
        await User.deleteOne({ email: fdEmail });
        await User.create({
            email: fdEmail,
            password: hashedPassword,
            role: 'frontdesk',
            firstName: 'Pam',
            lastName: 'Beesly',
            department: 'Reception'
        });
        console.log(`Created Front Desk: Pam Beesly (${fdEmail})`);

        // 1.8 Create Specialists
        const specialists = [
            { email: 'radiology@hospital.com', role: 'radiologist', first: 'Stephen', last: 'Strange', dept: 'Radiology' },
            { email: 'pathology@hospital.com', role: 'pathologist', first: 'Henry', last: 'Jekyll', dept: 'Pathology' }
        ];

        for (const s of specialists) {
            await User.deleteOne({ email: s.email });
            await User.create({
                email: s.email,
                password: hashedPassword,
                role: s.role,
                firstName: s.first,
                lastName: s.last,
                department: s.dept,
                permissions: { canView: ['department_queue'], canEdit: ['reports'] }
            });
            console.log(`Created Specialist: Dr. ${s.last} (${s.role})`);
        }

        // 1.9 Create Staff (Pharmacist & Accountant)
        const staff = [
            { email: 'pharmacy@hospital.com', role: 'pharmacist', first: 'Walter', last: 'White', dept: 'Pharmacy' },
            { email: 'billing@hospital.com', role: 'accountant', first: 'Angela', last: 'Martin', dept: 'Finance' }
        ];

        for (const s of staff) {
            await User.deleteOne({ email: s.email });
            await User.create({
                email: s.email,
                password: hashedPassword,
                role: s.role,
                firstName: s.first,
                lastName: s.last,
                department: s.dept
            });
            console.log(`Created Staff: ${s.first} ${s.last} (${s.role})`);
        }

        // 2. Create Patients
        const patients = [
            { id: 'PAT001', name: 'Alice Cooper', docId: 'DOC001', email: 'alice@patient.com' },
            { id: 'PAT002', name: 'Bob Marley', docId: 'DOC002', email: 'bob@patient.com' }
        ];

        for (const p of patients) {
            await Patient.deleteOne({ mrn: p.id });
            await User.deleteOne({ email: p.email }); // Also create User account for patient login

            // Create Patient User Account
            const patUser = await User.create({
                email: p.email,
                password: hashedPassword,
                role: 'patient',
                firstName: p.name.split(' ')[0],
                lastName: p.name.split(' ')[1],
                customId: p.id
            });

            // Create Patient Profile
            await Patient.create({
                mrn: p.id,
                firstName: p.name.split(' ')[0],
                lastName: p.name.split(' ')[1],
                assignedDoctorId: docMap[p.docId],
                dob: new Date('1980-01-01'),
                gender: 'Female', // varied
                contact: { phone: '123-456', email: p.email },
                allergies: ['Pollen'],
                chronicConditions: ['Asthma']
            });
            console.log(`Created Patient: ${p.name} assigned to ${p.docId}`);
        }

        console.log('Strict Seeding Complete!');

    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedStrict();
