const mongoose = require('mongoose');

// Use local URI as used in .env
const MONGODB_URI = process.env.MONGODB_URI;

async function verifyStats() {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Schemas (simplified for check)
        const AppointmentSchema = new mongoose.Schema({
            providerId: mongoose.Types.ObjectId,
            startTime: Date,
            status: String,
            patientId: mongoose.Types.ObjectId
        }, { strict: false });

        const UserSchema = new mongoose.Schema({
            role: String,
            email: String
        }, { strict: false });

        const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
        const User = mongoose.models.User || mongoose.model('User', UserSchema);

        // 1. Find Doctor
        const doctor = await User.findOne({ email: 'doctor@medicore.com' });
        if (!doctor) throw new Error("Doctor not found");
        console.log("Found Doctor:", doctor._id);

        // 2. Count Initial Stats (Direct DB query mimicking API logic)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const initialCount = await Appointment.countDocuments({
            providerId: doctor._id,
            startTime: { $gte: today, $lt: tomorrow },
            status: { $ne: 'cancelled' }
        });
        console.log("Initial Daily Count:", initialCount);

        // 3. Create New Appointment for Today
        console.log("Creating new test appointment...");
        const newAppt = await Appointment.create({
            appointmentId: `TEST-${Date.now()}`,
            providerId: doctor._id,
            patientId: new mongoose.Types.ObjectId(), // Fake patient ID
            startTime: new Date(), // Now
            endTime: new Date(Date.now() + 30 * 60000),
            status: 'scheduled',
            type: 'consultation',
            reason: 'Stats Check',
            createdBy: 'staff'
        });
        console.log("Created Appointment:", newAppt._id);

        // 4. Verify Count Increased
        const midCount = await Appointment.countDocuments({
            providerId: doctor._id,
            startTime: { $gte: today, $lt: tomorrow },
            status: { $ne: 'cancelled' }
        });
        console.log("New Daily Count:", midCount);

        if (midCount === initialCount + 1) {
            console.log("PASS: Total appointments increased.");
        } else {
            console.error("FAIL: Count did not increase correctly.");
        }

        // 5. Verify Consulted Count (Status 'completed')
        const initialConsulted = await Appointment.countDocuments({
            providerId: doctor._id,
            startTime: { $gte: today, $lt: tomorrow },
            status: 'completed'
        });

        console.log("Marking appointment as completed...");
        newAppt.status = 'completed';
        await newAppt.save();

        const finalConsulted = await Appointment.countDocuments({
            providerId: doctor._id,
            startTime: { $gte: today, $lt: tomorrow },
            status: 'completed'
        });

        if (finalConsulted === initialConsulted + 1) {
            console.log("PASS: Consulted count increased.");
        } else {
            console.error("FAIL: Consulted count incorrect.");
        }

        // Cleanup
        await Appointment.deleteOne({ _id: newAppt._id });
        console.log("Cleanup: Test appointment deleted.");

    } catch (err) {
        console.error("Script failed:", err);
    } finally {
        await mongoose.disconnect();
    }
}

verifyStats();
