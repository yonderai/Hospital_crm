const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function verifyIsolation() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB for Verification.\n');

        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({ email: String, role: String, firstName: String, lastName: String }, { strict: false }));
        const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({ assignedDoctorId: mongoose.Schema.Types.ObjectId, firstName: String }, { strict: false }));

        // 1. Get Doctors
        const doc1 = await User.findOne({ email: 'doctor1@hospital.com' });
        const doc2 = await User.findOne({ email: 'doctor2@hospital.com' });

        if (!doc1 || !doc2) {
            console.error('Doctors not found! Run seed_strict.js first.');
            return;
        }

        console.log(`DOCTOR 1: ${doc1.firstName} ${doc1.lastName} (${doc1._id})`);
        console.log(`DOCTOR 2: ${doc2.firstName} ${doc2.lastName} (${doc2._id})\n`);

        // 2. Mock API Query for Doctor 1
        console.log('--- TEST 1: Doctor 1 Patient View ---');
        const pats1 = await Patient.find({ assignedDoctorId: doc1._id });
        console.log(`Query: { assignedDoctorId: '${doc1._id}' }`);
        console.log(`Result Count: ${pats1.length}`);
        pats1.forEach(p => console.log(` - FOUND: ${p.firstName}`));
        if (pats1.length === 1 && pats1[0].firstName === 'Alice') {
            console.log('✅ PASS: Doctor 1 sees ONLY Alice.');
        } else {
            console.log('❌ FAIL: Doctor 1 visibility incorrect.');
        }
        console.log('');

        // 3. Mock API Query for Doctor 2
        console.log('--- TEST 2: Doctor 2 Patient View ---');
        const pats2 = await Patient.find({ assignedDoctorId: doc2._id });
        console.log(`Query: { assignedDoctorId: '${doc2._id}' }`);
        console.log(`Result Count: ${pats2.length}`);
        pats2.forEach(p => console.log(` - FOUND: ${p.firstName}`));
        if (pats2.length === 1 && pats2[0].firstName === 'Bob') {
            console.log('✅ PASS: Doctor 2 sees ONLY Bob.');
        } else {
            console.log('❌ FAIL: Doctor 2 visibility incorrect.');
        }
        console.log('');

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyIsolation();
