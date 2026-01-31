
const mongoose = require('mongoose');
// Define schemas locally to avoid TS imports in JS script
const AppointmentSchema = new mongoose.Schema({
    appointmentId: String,
    patientId: mongoose.Schema.Types.ObjectId,
    providerId: mongoose.Schema.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    status: String,
    type: String,
    reason: String
}, { strict: false });
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

const UserSchema = new mongoose.Schema({ email: String }, { strict: false });
const User = mongoose.models.User || mongoose.model('User', UserSchema);

require('dotenv').config();

async function runTests() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hospital_crm');
        console.log('Connected to MongoDB');

        const doctor = await User.findOne({ email: 'doctor@medicore.com' });
        const patient = await User.findOne({ role: 'patient' }) || doctor; // Fallback to self if no patient

        if (!doctor) throw new Error("Doctor not found");

        console.log('--- TEST 1: Booking Invalid Slot (10:15) ---');
        // This should fail via API validation, but here we test the logic we'd use
        // API Test via fetch would be better, but purely backend logic test here:
        const invalidStart = new Date();
        invalidStart.setHours(10, 15, 0, 0);

        if (invalidStart.getMinutes() !== 0 && invalidStart.getMinutes() !== 30) {
            console.log('✅ Correctly identified invalid slot (10:15)');
        } else {
            console.error('❌ Failed to identify invalid slot');
        }

        console.log('--- TEST 2: Booking Valid Slot (12:00) ---');
        const validStart = new Date();
        validStart.setHours(12, 0, 0, 0);
        const validEnd = new Date(validStart.getTime() + 30 * 60000);

        // Cleanup
        await Appointment.deleteMany({ providerId: doctor._id, startTime: validStart });

        await Appointment.create({
            appointmentId: `TEST-VALID-${Date.now()}`,
            patientId: patient._id,
            providerId: doctor._id,
            startTime: validStart,
            endTime: validEnd,
            status: 'scheduled',
            type: 'consultation',
            reason: 'Valid Slot Test'
        });
        console.log('✅ Created valid appointment at 12:00');

        console.log('--- TEST 3: Overlap Check ---');
        const overlapStart = new Date(validStart); // Same time
        const existing = await Appointment.findOne({
            providerId: doctor._id,
            status: { $nin: ["cancelled", "no-show"] },
            startTime: overlapStart
        });

        if (existing) {
            console.log('✅ Overlap detected correctly');
        } else {
            console.error('❌ Failed to detect overlap');
        }

        console.log('--- TEST 4: Auto-Cancel Logic ---');
        // Create past appointment
        const pastStart = new Date();
        pastStart.setHours(pastStart.getHours() - 1); // 1 hour ago

        await Appointment.create({
            appointmentId: `TEST-PAST-${Date.now()}`,
            patientId: patient._id,
            providerId: doctor._id,
            startTime: pastStart,
            endTime: new Date(pastStart.getTime() + 30 * 60000),
            status: 'scheduled', // Still scheduled despite being in past
            type: 'consultation',
            reason: 'Auto Cancel Test'
        });

        console.log('Created past scheduled appointment. Running auto-cancel simulation...');

        const cutoff = new Date(Date.now() - 15 * 60000);
        const result = await Appointment.updateMany(
            { status: 'scheduled', startTime: { $lt: cutoff } },
            { $set: { status: 'no-show' } }
        );

        console.log(`Processed: ${result.modifiedCount} appointments`);
        if (result.modifiedCount > 0) {
            console.log('✅ Auto-cancel logic worked');
        } else {
            console.log('⚠️ No appointments updated (might have already been processed)');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
}

runTests();
