import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../src/lib/models/User';
import Patient from '../src/lib/models/Patient';
import Appointment from '../src/lib/models/Appointment';
import LabResult from '../src/lib/models/LabResult';
import InventoryItem from '../src/lib/models/InventoryItem';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

async function seed() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected.');

        // Clear existing data
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        await LabResult.deleteMany({});
        await InventoryItem.deleteMany({});

        console.log('Cleared existing data.');

        // Create a Doctor
        const hashedPassword = await bcrypt.hash('a', 10);
        const doctor = await User.create({
            email: 'doctor@medicore.com',
            password: hashedPassword,
            role: 'doctor',
            firstName: 'Gregory',
            lastName: 'House',
            department: 'Oncology',
            isActive: true,
            permissions: { canView: ['all'], canEdit: ['all'], canDelete: [], canApprove: ['all'] }
        });
        console.log('Doctor created:', doctor.email);

        // Create other roles
        const roles = [
            { email: 'nurse@medicore.com', role: 'nurse', first: 'Jackie', last: 'Peyton' },
            { email: 'admin@medicore.com', role: 'admin', first: 'Lisa', last: 'Cuddy' },
            { email: 'frontdesk@medicore.com', role: 'frontdesk', first: 'Pam', last: 'Beesly' },
            { email: 'lab@medicore.com', role: 'labtech', first: 'Dexter', last: 'Morgan' },
            { email: 'billing@medicore.com', role: 'billing', first: 'Skyler', last: 'White' },
            { email: 'pharmacy@medicore.com', role: 'pharmacist', first: 'Walter', last: 'White' },
            { email: 'hr@medicore.com', role: 'hr', first: 'Toby', last: 'Flenderson' },
            { email: 'patient@medicore.com', role: 'patient', first: 'John', last: 'Doe' }
        ];

        for (const u of roles) {
            await User.create({
                email: u.email,
                password: hashedPassword,
                role: u.role,
                firstName: u.first,
                lastName: u.last,
                isActive: true,
                permissions: { canView: [], canEdit: [], canDelete: [], canApprove: [] }
            });
            console.log(`${u.role} created: ${u.email}`);
        }

        // Create Patients (Data for Doctor Dashboard)
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

        // Create Patient Record for the logged-in demo user
        const patientDemo = await Patient.create({
            mrn: 'MRN-DEMO',
            firstName: 'John',
            lastName: 'Doe',
            dob: new Date('1980-01-01'),
            gender: 'Male',
            contact: { phone: '0000000000', email: 'patient@medicore.com' },
            assignedDoctorId: doctor._id,
            address: {
                street: '123 Health St',
                city: 'Medicore City',
                state: 'NY',
                zipCode: '10001'
            }
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

        // Create Inventory Items
        await InventoryItem.create({
            sku: 'MED001',
            name: 'Amoxicillin 500mg',
            category: 'medication',
            unit: 'Capsule',
            quantityOnHand: 500,
            reorderLevel: 100,
            unitCost: 5.50,
            sellingPrice: 15.00,
            lotNumber: 'AX-2024-001',
            expiryDate: new Date('2025-12-31'),
            isActive: true
        });

        await InventoryItem.create({
            sku: 'MED002',
            name: 'Paracetamol 500mg',
            category: 'medication',
            unit: 'Tablet',
            quantityOnHand: 1000,
            reorderLevel: 200,
            unitCost: 1.20,
            sellingPrice: 5.00,
            lotNumber: 'PCM-2024-055',
            expiryDate: new Date('2026-06-30'),
            isActive: true
        });

        await InventoryItem.create({
            sku: 'SUP001',
            name: 'Surgical Mask',
            category: 'supply',
            unit: 'Box',
            quantityOnHand: 120,
            reorderLevel: 50,
            unitCost: 150.00,
            sellingPrice: 300.00,
            lotNumber: 'SUP-MASK-009',
            expiryDate: new Date('2028-01-01'),
            isActive: true
        });

        await InventoryItem.create({
            sku: 'SUP002',
            name: 'Exam Gloves (L)',
            category: 'supply',
            unit: 'Box',
            quantityOnHand: 45,
            reorderLevel: 20,
            unitCost: 400.00,
            sellingPrice: 650.00,
            lotNumber: 'GLV-2023-998',
            expiryDate: new Date('2027-05-15'),
            isActive: true
        });

        console.log('Inventory items created.');
        console.log('Seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
