import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { loadEnvConfig } from '@next/env';
import User, { UserRole } from '../src/lib/models/User';
import Patient from '../src/lib/models/Patient';
import Appointment from '../src/lib/models/Appointment';
import LabResult from '../src/lib/models/LabResult';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicore";

async function seed() {
    try {
        console.log('Connecting to MongoDB...', MONGODB_URI.split('@')[1] || 'localhost'); // Log masked URI
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

        // Create Other Roles
        const labTech = await User.create({
            email: 'tech@yonder.com',
            password: hashedPassword,
            role: 'lab-tech',
            firstName: 'Sarah',
            lastName: 'Connor',
            department: 'Pathology',
            isActive: true
        });

        const pharmacist = await User.create({
            email: 'pharma@yonder.com',
            password: hashedPassword,
            role: 'pharmacist',
            firstName: 'Walter',
            lastName: 'White',
            department: 'Pharmacy',
            isActive: true
        });

        const receptionist = await User.create({
            email: 'reception@yonder.com',
            password: hashedPassword,
            role: 'front-desk',
            firstName: 'Pam',
            lastName: 'Beesly',
            department: 'Front Desk',
            isActive: true
        });

        const nurse = await User.create({
            email: 'nurse@yonder.com',
            password: hashedPassword,
            role: 'nurse',
            firstName: 'Florence',
            lastName: 'Nightingale',
            department: 'Nursing',
            isActive: true
        });

        const revenue = await User.create({
            email: 'billing@yonder.com',
            password: hashedPassword,
            role: 'billing', // Matches UserRole.BILLING
            firstName: 'Warren',
            lastName: 'Buffett',
            department: 'Finance',
            isActive: true
        });

        const inventory = await User.create({
            email: 'stock@yonder.com',
            password: hashedPassword,
            role: 'inventory',
            firstName: 'Tim',
            lastName: 'Cook',
            department: 'Supply Chain',
            isActive: true
        });

        // Create Patient User (Linked to Alice Cooper)
        const patientAlice = await Patient.findOne({ firstName: 'Alice', lastName: 'Cooper' });
        if (patientAlice) {
            await User.create({
                email: 'alice@yonder.com',
                password: hashedPassword, // password123
                role: 'patient',
                firstName: 'Alice',
                lastName: 'Cooper',
                patientProfileId: patientAlice._id,
                isActive: true
            });
            console.log('Patient User created: alice@yonder.com (Linked to MRN: ' + patientAlice.mrn + ')');
        }

        const hr = await User.create({
            email: 'hr@yonder.com',
            password: hashedPassword,
            role: 'hr',
            firstName: 'Steve',
            lastName: 'Jobs',
            department: 'Administration',
            isActive: true
        });

        const admin = await User.create({
            email: 'admin@yonder.com',
            password: hashedPassword,
            role: 'admin',
            firstName: 'Adama',
            lastName: 'Traore',
            department: 'Administration',
            isActive: true
        });

        // Create Inventory Items
        const InventoryItem = require('../src/lib/models/InventoryItem').default;
        await InventoryItem.deleteMany({});
        await InventoryItem.create([
            { sku: 'MED001', name: 'Amoxicillin 500mg', category: 'medication', unit: 'tablet', quantityOnHand: 1000, unitCost: 0.5, reorderLevel: 100 },
            { sku: 'MED002', name: 'Lisinopril 10mg', category: 'medication', unit: 'tablet', quantityOnHand: 500, unitCost: 0.2, reorderLevel: 50 },
            { sku: 'MED003', name: 'Metformin 500mg', category: 'medication', unit: 'tablet', quantityOnHand: 200, unitCost: 0.1, reorderLevel: 50 },
            { sku: 'SUP001', name: 'Syringe 5ml', category: 'supply', unit: 'box', quantityOnHand: 50, unitCost: 5.0, reorderLevel: 10 }
        ]);
        console.log('Inventory created.');

        // Create Prescriptions
        const Prescription = require('../src/lib/models/Prescription').default;
        await Prescription.deleteMany({});
        await Prescription.create({
            prescriptionId: 'RX001',
            patientId: patient1._id,
            providerId: doctor._id,
            status: 'active',
            medications: [{ drugName: 'Amoxicillin 500mg', dosage: '500mg', frequency: 'TID', route: 'Oral', duration: '7 days', quantity: 21 }]
        });
        await Prescription.create({
            prescriptionId: 'RX002',
            patientId: patient2._id,
            providerId: doctor._id,
            status: 'active',
            medications: [{ drugName: 'Lisinopril 10mg', dosage: '10mg', frequency: 'QD', route: 'Oral', duration: '30 days', quantity: 30 }]
        });
        console.log('Prescriptions created.');

        // Create Lab Orders
        const LabOrder = require('../src/lib/models/LabOrder').default;
        await LabOrder.deleteMany({});
        const order1 = await LabOrder.create({
            orderId: 'LAB-1001',
            patientId: patient1._id,
            orderingProviderId: doctor._id,
            tests: ['CBC', 'BMP'],
            priority: 'routine',
            status: 'ordered'
        });
        const order2 = await LabOrder.create({
            orderId: 'LAB-1002',
            patientId: patient2._id,
            orderingProviderId: doctor._id,
            tests: ['HbA1c', 'Lipid Panel'],
            priority: 'urgent',
            status: 'collected',
            sampleCollectedAt: new Date()
        });
        console.log('Lab Orders created.');

        // Create Lab Results linked to Order
        await LabResult.create({
            orderId: order2._id,
            patientId: patient2._id,
            testType: 'HbA1c',
            resultValue: '7.2',
            unit: '%',
            referenceRange: '< 5.7',
            abnormalFlag: true,
            status: 'preliminary',
            performedBy: labTech._id
        });

        console.log('Seed complete.');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
