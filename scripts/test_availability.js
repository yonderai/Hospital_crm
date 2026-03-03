
const mongoose = require('mongoose');
require('dotenv').config();

// Mongoose schema definitions to avoid caching issues in script
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true },
    role: { type: String, required: true },
    firstName: String,
    lastName: String,
    workingHours: {
        start: { type: String },
        end: { type: String }
    }
}, { strict: false });

const AppointmentSchema = new mongoose.Schema({
    providerId: mongoose.Schema.Types.ObjectId,
    startTime: Date,
    endTime: Date,
    status: String,
    type: String,
    reason: String
}, { strict: false });

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const AppointmentModel = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

async function testAvailability() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Get Doctor
        const doctor = await UserModel.findOne({ email: 'doctor@medicore.com' });
        if (!doctor) throw new Error("Doctor not found");
        console.log('Found ID:', doctor._id);

        // 2. Set Working Hours
        doctor.workingHours = { start: "09:00", end: "17:00" };
        await UserModel.updateOne({ _id: doctor._id }, { $set: { workingHours: { start: "09:00", end: "17:00" } } });
        console.log('Updated working hours: 09:00 - 17:00');

        // 3. Create a Test Appointment (Today 10:00 - 11:00)
        const today = new Date();
        const startTime = new Date(today);
        startTime.setHours(10, 0, 0, 0);
        const endTime = new Date(today);
        endTime.setHours(11, 0, 0, 0);

        // Cleanup existing for clean test
        await AppointmentModel.deleteMany({ providerId: doctor._id, startTime: startTime });

        await AppointmentModel.create({
            appointmentId: `TEST-${Date.now()}`,
            patientId: doctor._id, // Self-appt for test
            providerId: doctor._id,
            startTime: startTime,
            endTime: endTime,
            status: "scheduled",
            type: "consultation",
            reason: "Availability Test",
            createdBy: "staff"
        });
        console.log('Created test appointment: 10:00 - 11:00');

        console.log('--- VERIFICATION STEP ---');
        console.log('Please check the Doctor Dashboard.');
        console.log('Expected Result:');
        console.log('- Total Hours: 8');
        console.log('- Booked Slots: 1 (10:00 AM)');
        console.log('- Free Slots: 7');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

testAvailability();
