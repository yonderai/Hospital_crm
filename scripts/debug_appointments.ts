
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Appointment from '../src/lib/models/Appointment';
import User from '../src/lib/models/User';
import Patient from '../src/lib/models/Patient';

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function listAppointments() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const appointments = await Appointment.find({})
            .populate('patientId', 'firstName lastName email')
            .populate('providerId', 'firstName lastName department');

        console.log(`\nFound ${appointments.length} appointments:\n`);

        if (appointments.length === 0) {
            console.log("No appointments found. Try booking one via the UI.");
        }

        appointments.forEach((apt: any) => {
            console.log(`ID: ${apt.appointmentId}`);
            console.log(`Time: ${apt.startTime.toLocaleString()} - ${apt.endTime.toLocaleString()}`);
            console.log(`Patient: ${apt.patientId?.firstName} ${apt.patientId?.lastName} (${apt.patientId?.email})`);
            console.log(`Doctor: ${apt.providerId?.firstName} ${apt.providerId?.lastName} (${apt.providerId?.department})`);
            console.log(`Reason: ${apt.reason}`);
            console.log(`Status: ${apt.status}`);
            console.log('-----------------------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error listing appointments:', error);
        process.exit(1);
    }
}

listAppointments();
