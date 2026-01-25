
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { ROLES } from './src/config/roles.js';
import User from './src/models/User.js';
import Patient from './src/models/Patient.js';
import Appointment from './src/models/Appointment.js';
import Billing from './src/models/Billing.js';
import EmergencyCase from './src/models/EmergencyCase.js';
import Ambulance from './src/models/Ambulance.js';

dotenv.config();

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Billing.deleteMany({});

    console.log('Creating Users (Staff)...');

    // Create Doctors
    const doctors = [];
    const doctorSpecialties = ['Cardiology', 'Neurology', 'Oncology', 'Pediatrics', 'Orthopedics'];

    for (let i = 0; i < 5; i++) {
        doctors.push(await User.create({
            name: `Dr. ${['Smith', 'Patel', 'Jones', 'Wang', 'Garcia'][i]}`,
            email: `doctor${i + 1}@hospital.com`,
            password: 'password123',
            role: ROLES.DOCTOR
        }));
    }

    // Create Nurses
    for (let i = 0; i < 10; i++) {
        await User.create({
            name: `Nurse ${['Sarah', 'Mike', 'Emily', 'David', 'Jessica', 'Tom', 'Laura', 'Chris', 'Anna', 'James'][i]}`,
            email: `nurse${i + 1}@hospital.com`,
            password: 'password123',
            role: ROLES.NURSE
        });
    }

    // Create Finance/Admin
    await User.create({ name: 'Finance Manager', email: 'finance@hospital.com', password: 'password123', role: ROLES.REVENUE_OFFICE || 'finance' });
    await User.create({ name: 'Emergency Manager', email: 'emergency@hospital.com', password: 'emergency123', role: 'emergency' });
    await User.create({ name: 'Admin User', email: 'admin@hospital.com', password: 'password123', role: ROLES.ADMIN });
    await User.create({ name: 'HR Manager', email: 'hr@hospital.com', password: 'password123', role: ROLES.HR });
    await User.create({ name: 'Pharmacy Manager', email: 'pharmacy@hospital.com', password: 'password123', role: ROLES.PHARMACY_INVENTORY });

    console.log('Creating Patients...');
    const patients = [];
    const patientNames = ['Alice Cooper', 'Bob Marley', 'Charlie Brown', 'David Bowie', 'Elvis Presley', 'Freddie Mercury', 'George Michael', 'Harry Styles', 'Iggy Pop', 'John Lennon'];

    for (let i = 0; i < 20; i++) {
        const name = patientNames[i % patientNames.length] + (i > 9 ? ` ${i}` : '');
        patients.push(await Patient.create({
            name: name,
            email: `patient${i + 1}@example.com`,
            phone: `555-01${i.toString().padStart(2, '0')}`,
            dob: new Date(1980, 0, 1),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            address: '123 Hospital Way',
            kycVerified: true,
            bloodGroup: ['A+', 'B+', 'O+', 'AB+'][i % 4],
            insuranceDetails: {
                provider: 'HealthGuard',
                policyNumber: `POL-${1000 + i}`,
                status: 'Approved'
            },
            bedAllocated: i < 5 ? { ward: 'ICU', bedNumber: `ICU-${i + 1}`, allocatedAt: new Date() } : undefined
        }));
    }

    console.log('Creating Appointments...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 15; i++) {
        const appointmentDate = new Date(today);
        appointmentDate.setHours(9 + i, 0); // 9 AM onwards

        await Appointment.create({
            patient: patients[i]._id,
            doctor: doctors[i % doctors.length]._id,
            dateTime: appointmentDate,
            status: i < 5 ? 'Completed' : (i < 8 ? 'Checked-in' : 'Scheduled'),
            reason: ['Regular Checkup', 'Fever', 'Back Pain', 'Headache', 'Follow-up'][i % 5],
            queueNumber: i + 1,
            vitals: i < 8 ? {
                bloodPressure: '120/80',
                temperature: '98.6',
                pulse: '72',
                weight: '70kg'
            } : undefined
        });
    }

    console.log('Creating Billing Records...');
    for (let i = 0; i < 10; i++) {
        await Billing.create({
            patient: patients[i]._id,
            totalAmount: 150 + (i * 50),
            patientPayable: 50,
            insuranceCovered: 100 + (i * 50),
            paymentStatus: i < 5 ? 'Paid' : 'Unpaid',
            invoiceNumber: `INV-2024-${100 + i}`,
            items: [
                { description: 'Consultation Fee', amount: 100, category: 'Consultation' },
                { description: 'Lab Test', amount: 50 + (i * 50), category: 'Lab' }
            ]
        });
    }

    console.log('Creating Emergency Cases...');
    // Inline schema definition for immediate seeding if model missing, or relying on Models being added.
    // For now, I will add the logic to seed `EmergencyCase` assuming the model will be available or defining it if possible. 
    // Given the file structure, I should import it.

    // I will insert this log to indicate intent, but I need to create the files first.
    // I will hold off on adding the `EmergencyCase` seeding block until I create the model file to avoid runtime errors in `seed.js`.

    console.log('Creating Emergency Data...');
    await EmergencyCase.deleteMany({});
    await Ambulance.deleteMany({});

    const ambulances = [
        { plateNumber: "AMB-01", driverName: "John Doe", driverContact: "555-0101", status: "available", equipmentLevel: "als" },
        { plateNumber: "AMB-02", driverName: "Jane Smith", driverContact: "555-0102", status: "busy", eta: "5 mins", equipmentLevel: "icu" }
    ];
    await Ambulance.insertMany(ambulances);

    await EmergencyCase.create({
        tempName: "Trauma A (Male 40s)",
        triageLevel: "P1",
        status: "treatment",
        arrivalMode: "ambulance",
        chiefComplaint: "Multiple fractures",
        vitals: [{ bp: "90/60", pulse: 120, spo2: 92, temp: 36.5, gcs: 8 }]
    });

    console.log('Data Seeded Successfully!');
    process.exit();
};

seedData();
