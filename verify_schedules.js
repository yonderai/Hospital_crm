const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { startOfDay, endOfDay } = require('date-fns');

dotenv.config();

// Define models
const AppointmentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' },
    providerId: { type: mongoose.Schema.Types.ObjectId },
    startTime: Date,
    status: String
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

const PatientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String
});
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    role: String
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkSchedules() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the first doctor to use as an example
        const doctor = await User.findOne({ role: 'doctor' });
        if (!doctor) {
            console.log('No doctor found');
            return;
        }
        console.log(`Checking for Doctor: ${doctor.firstName} ${doctor.lastName} (${doctor._id})`);

        // Yesterday boundaries
        const baseDate = new Date();
        const todayStart = startOfDay(baseDate);

        const yesterdayStart = startOfDay(new Date(todayStart.getTime() - 24 * 60 * 60 * 1000));
        const yesterdayEnd = endOfDay(yesterdayStart);

        console.log('Yesterday Range:', yesterdayStart, 'to', yesterdayEnd);

        const yesterdayAppts = await Appointment.find({
            providerId: doctor._id,
            startTime: { $gte: yesterdayStart, $lte: yesterdayEnd },
            status: { $nin: ['cancelled', 'no-show'] }
        });

        console.log('Total Appointments for this Doctor Yesterday:', yesterdayAppts.length);

        const patientCounts = {};
        yesterdayAppts.forEach(a => {
            const pid = a.patientId.toString();
            patientCounts[pid] = (patientCounts[pid] || 0) + 1;
        });

        console.log('\nPatient Schedule Analysis:');
        let multipleSchedulesFound = false;
        for (const [pid, count] of Object.entries(patientCounts)) {
            const patient = await Patient.findById(pid);
            if (count > 1) {
                console.log(`[!] ${patient.firstName} ${patient.lastName} (${pid}): ${count} schedules`);
                multipleSchedulesFound = true;
            } else {
                console.log(`[ ] ${patient.firstName} ${patient.lastName} (${pid}): ${count} schedule`);
            }
        }

        if (!multipleSchedulesFound) {
            console.log('\nNo patients found with multiple schedules yesterday in the records.');
        }

    } catch (err) {
        console.error('Error during verification:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkSchedules();
