import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../src/lib/models/User';
import Patient from '../src/lib/models/Patient';
import Appointment from '../src/lib/models/Appointment';
import LabResult from '../src/lib/models/LabResult';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        // Clear existing data
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        await LabResult.deleteMany({});

        console.log('Cleared existing data.');

        // Create a Doctor
        const hashedPassword = await bcrypt.hash('password123', 10);
        const doctor = await User.create({
            email: 'doctor@yonder.com',
            password: hashedPassword,
            role: 'doctor',
            firstName: 'Yuvraj',
            lastName: 'Singh',
            department: 'Oncology',
            isActive: true,
            permissions: {
                canView: ['all'],
                canEdit: ['all'],
                canDelete: [],
                canApprove: ['all']
            }
        });
        console.log('Doctor created:', doctor.email);

        // Create Patients
        const patient1 = await Patient.create({
            mrn: 'MRN001',
            firstName: 'Alice',
            lastName: 'Cooper',
            dob: new Date('1985-05-15'),
            gender: 'Female',
            contact: { phone: '1234567890', email: 'alice@example.com' },
            assignedDoctorId: doctor._id
        });
        const patient2 = await Patient.create({
            mrn: 'MRN002',
            firstName: 'Bob',
            lastName: 'Marley',
            dob: new Date('1970-02-06'),
            gender: 'Male',
            contact: { phone: '9876543210', email: 'bob@example.com' },
            assignedDoctorId: doctor._id
        });
        const patient3 = await Patient.create({
            mrn: 'MRN003',
            firstName: 'Charlie',
            lastName: 'Brown',
            dob: new Date('1990-10-10'),
            gender: 'Male',
            contact: { phone: '5551234567', email: 'charlie@example.com' },
            assignedDoctorId: doctor._id
        });
        console.log('Patients created.');

        // Create Appointments
        const today = new Date();
        today.setHours(9, 0, 0, 0);

        await Appointment.create({
            appointmentId: 'APP001',
            patientId: patient1._id,
            providerId: doctor._id,
            startTime: new Date(today),
            endTime: new Date(today.getTime() + 30 * 60000),
            status: 'checked-in',
            type: 'consultation',
            reason: 'Diabetes Follow-up'
        });

        today.setHours(9, 30, 0, 0);
        await Appointment.create({
            appointmentId: 'APP002',
            patientId: patient2._id,
            providerId: doctor._id,
            startTime: new Date(today),
            endTime: new Date(today.getTime() + 45 * 60000),
            status: 'scheduled',
            type: 'follow-up',
            reason: 'Chronic Pain Mgmt'
        });

        today.setHours(10, 15, 0, 0);
        await Appointment.create({
            appointmentId: 'APP003',
            patientId: patient3._id,
            providerId: doctor._id,
            startTime: new Date(today),
            endTime: new Date(today.getTime() + 30 * 60000),
            status: 'checked-in',
            type: 'consultation',
            reason: 'Post-Op Review'
        });
        console.log('Appointments created.');

        // Create Lab Results (Mock orderId for now)
        const mockOrderId = new mongoose.Types.ObjectId();
        await LabResult.create({
            orderId: mockOrderId,
            patientId: patient1._id,
            testType: 'Blood Glucose',
            resultValue: '140',
            unit: 'mg/dL',
            referenceRange: '70-99',
            abnormalFlag: true,
            status: 'final',
            performedBy: doctor._id
        });

        await LabResult.create({
            orderId: mockOrderId,
            patientId: patient2._id,
            testType: 'CBC',
            resultValue: 'Normal',
            unit: 'N/A',
            referenceRange: 'Various',
            abnormalFlag: false,
            status: 'preliminary',
            performedBy: doctor._id
        });

        console.log('Lab results created.');
        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
