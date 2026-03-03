// Check patient data and user linkage
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkPatientData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected\n');

        const userSchema = new mongoose.Schema({}, { strict: false });
        const User = mongoose.models.User || mongoose.model('User', userSchema, 'users');

        const patientSchema = new mongoose.Schema({}, { strict: false });
        const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema, 'patients');

        console.log('👤 Checking patient user...');
        const patientUser = await User.findOne({ email: 'patient1@medicore.com' });
        if (patientUser) {
            console.log(`   ✅ User found: ${patientUser.firstName} ${patientUser.lastName}`);
            console.log(`   Email: ${patientUser.email}`);
            console.log(`   Role: ${patientUser.role}`);
        } else {
            console.log('   ❌ Patient user not found!');
        }

        console.log('\n📋 Checking patient records...');
        const patients = await Patient.find().limit(3);
        console.log(`   Total patients: ${await Patient.countDocuments()}`);

        if (patients.length > 0) {
            patients.forEach(p => {
                console.log(`   - ${p.firstName} ${p.lastName} (MRN: ${p.mrn})`);
                console.log(`     Email: ${p.contact?.email || 'N/A'}`);
            });
        }

        console.log('\n🧪 Checking lab orders...');
        const labOrderSchema = new mongoose.Schema({}, { strict: false });
        const LabOrder = mongoose.models.LabOrder || mongoose.model('LabOrder', labOrderSchema, 'laborders');
        const labCount = await LabOrder.countDocuments({ status: 'completed' });
        console.log(`   Completed lab orders: ${labCount}`);

        console.log('\n📸 Checking imaging orders...');
        const imagingOrderSchema = new mongoose.Schema({}, { strict: false });
        const ImagingOrder = mongoose.models.ImagingOrder || mongoose.model('ImagingOrder', imagingOrderSchema, 'imagingorders');
        const imagingCount = await ImagingOrder.countDocuments({ status: 'completed' });
        console.log(`   Completed imaging orders: ${imagingCount}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

checkPatientData();
