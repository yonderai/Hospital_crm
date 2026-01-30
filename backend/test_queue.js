import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Define minimal schemas
const PatientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    mrn: String
});
// Handle potential model overwrites in this standalone script context
const Patient = mongoose.models.Patient || mongoose.model('Patient', PatientSchema);

const AppointmentSchema = new mongoose.Schema({
    startTime: Date,
    status: String,
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);

async function testQuery() {
    try {
        console.log("Connecting to DB...");
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        console.log("Querying appointments...");
        const appointments = await Appointment.find({
            startTime: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: "cancelled" }
        })
            .populate("patientId", "firstName lastName mrn")
            .sort({ startTime: 1 })
            .lean();

        console.log("Appointments found:", appointments.length);
        console.log(JSON.stringify(appointments, null, 2));

    } catch (error) {
        console.error("Test failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

testQuery();
