import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Patient from '../models/Patient.js';
import Inventory from '../models/Inventory.js';
import Appointment from '../models/Appointment.js';
import Expense from '../models/Expense.js';
import Billing from '../models/Billing.js';
import { ROLES } from '../config/roles.js';

dotenv.config(); // Loads .env from CWD (backend root)

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Patient.deleteMany();
        await Inventory.deleteMany();
        await Appointment.deleteMany();
        await Expense.deleteMany();
        await Billing.deleteMany();

        console.log('Cleared existing data...');

        // 1. Create Users for all 10 roles
        const password = 'password123';
        const users = await User.create([
            { name: 'Dr. John Smith', email: 'doctor@hospital.com', password, role: ROLES.DOCTOR },
            { name: 'Admin User', email: 'admin@hospital.com', password, role: ROLES.ADMIN },
            { name: 'Pharmacist Sarah', email: 'pharmacy@hospital.com', password, role: ROLES.PHARMACY_INVENTORY },
            { name: 'Diagnostics Tech', email: 'lab@hospital.com', password, role: ROLES.DIAGNOSTICS },
            { name: 'Front Desk Alice', email: 'frontdesk@hospital.com', password, role: ROLES.FRONT_DESK },
            { name: 'Nurse Joy', email: 'nurse@hospital.com', password, role: ROLES.NURSE },
            { name: 'Revenue Officer', email: 'revenue@hospital.com', password, role: ROLES.REVENUE_OFFICE },
            { name: 'Finance Manager', email: 'finance@hospital.com', password, role: ROLES.BACK_OFFICE_FINANCE },
            { name: 'HR Manager', email: 'hr@hospital.com', password, role: ROLES.HR },
            { name: 'Patient Charlie', email: 'patient@hospital.com', password, role: ROLES.PATIENT },
        ]);
        console.log('Seed: Created 10 users (Role-based)...');

        // 2. Create Patients
        const patients = await Patient.create([
            {
                name: 'Charlie Brown',
                email: 'patient@hospital.com',
                phone: '1234567890',
                dob: new Date('1990-01-01'),
                gender: 'Male',
                address: '123 Pine St',
                kycVerified: true,
                bloodGroup: 'O+',
                emergencyContact: { name: 'Sally Brown', phone: '0987654321', relationship: 'Sister' },
                bedAllocated: { ward: 'General', bedNumber: 'G-101', allocatedAt: new Date() }
            },
            {
                name: 'Lucy Van Pelt',
                email: 'lucy@vanpelt.com',
                phone: '5550101',
                dob: new Date('1992-05-15'),
                gender: 'Female',
                address: '456 Oak Ave',
                kycVerified: true,
                bloodGroup: 'A-'
            }
        ]);
        console.log(`Seed: Created ${patients.length} patients...`);

        // 3. Create Inventory
        const inventory = await Inventory.create([
            { name: 'Paracetamol 500mg', category: 'Medicine', batchNumber: 'LOT123', expiryDate: new Date('2027-12-31'), quantity: 1000, unit: 'Tablets', unitPrice: 0.5 },
            { name: 'MRI Contrast', category: 'Consumable', batchNumber: 'B456', expiryDate: new Date('2026-06-30'), quantity: 50, unit: 'Vials', unitPrice: 20 },
            { name: 'Stethoscope', category: 'Equipment', batchNumber: 'SN789', expiryDate: new Date('2099-01-01'), quantity: 20, unit: 'Pieces', unitPrice: 150 }
        ]);
        console.log(`Seed: Created ${inventory.length} inventory items...`);

        // 4. Create Appointments
        const doc = users.find(u => u.role === ROLES.DOCTOR);
        await Appointment.create([
            { patient: patients[0]._id, doctor: doc._id, dateTime: new Date(), reason: 'Regular Checkup', queueNumber: 1, vitals: { bloodPressure: '120/80', temperature: '98.6', pulse: '72', weight: '70kg' } },
            { patient: patients[1]._id, doctor: doc._id, dateTime: new Date(Date.now() + 3600000), reason: 'Fever', queueNumber: 2 }
        ]);
        console.log('Seed: Created appointments...');

        // 5. Create Expenses
        await Expense.create([
            { title: 'Monthly Electricity Bill', category: 'Electricity', amount: 5000, status: 'Paid', paidTo: 'City Power' },
            { title: 'Medicine Procurement', category: 'Procurement', amount: 2000, status: 'Paid', paidTo: 'PharmaDist Inc' }
        ]);
        console.log('Seed: Created 2 expenses...');

        // 6. Create Billing
        await Billing.create({
            patient: patients[0]._id,
            items: [
                { description: 'Consultation Fee', amount: 50, category: 'Consultation' },
                { description: 'Pharmacy - Paracetamol', amount: 10, category: 'Pharmacy' }
            ],
            totalAmount: 60,
            insuranceCovered: 40,
            patientPayable: 20,
            paymentStatus: 'Paid',
            paymentMethod: 'UPI',
            invoiceNumber: 'INV-SEED-001'
        });
        console.log('Seed: Created 1 billing record...');

        console.log('Database Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
