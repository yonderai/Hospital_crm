import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/lib/models/User';
import Patient from '../src/lib/models/Patient';
import Appointment from '../src/lib/models/Appointment';
import LabOrder from '../src/lib/models/LabOrder';
import LabResult from '../src/lib/models/LabResult';
import ImagingOrder from '../src/lib/models/ImagingOrder';
import RadiologyReport from '../src/lib/models/RadiologyReport';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

async function seedWorkflowData() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI as string);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Patient.deleteMany({});
        await Appointment.deleteMany({});
        await LabOrder.deleteMany({});
        await LabResult.deleteMany({});
        await ImagingOrder.deleteMany({});
        await RadiologyReport.deleteMany({});
        console.log('✅ Cleared existing data');

        // Create Users
        console.log('👥 Creating users...');
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Doctors
        const doctor1 = await User.create({
            email: 'doctor@medicore.com',
            password: hashedPassword,
            role: 'doctor',
            firstName: 'Gregory',
            lastName: 'House',
            department: 'Oncology',
            isActive: true,
            permissions: { canView: ['all'], canEdit: ['all'], canDelete: [], canApprove: ['all'] }
        });

        const doctor2 = await User.create({
            email: 'doctor2@medicore.com',
            password: hashedPassword,
            role: 'doctor',
            firstName: 'Meredith',
            lastName: 'Grey',
            department: 'General Surgery',
            isActive: true,
            permissions: { canView: ['all'], canEdit: ['all'], canDelete: [], canApprove: ['all'] }
        });

        // Lab Technicians
        const labTech1 = await User.create({
            email: 'lab@medicore.com',
            password: hashedPassword,
            role: 'lab',
            firstName: 'Dexter',
            lastName: 'Morgan',
            department: 'Laboratory',
            isActive: true,
            permissions: { canView: ['lab'], canEdit: ['lab'], canDelete: [], canApprove: [] }
        });

        const labTech2 = await User.create({
            email: 'labtech@medicore.com',
            password: hashedPassword,
            role: 'lab',
            firstName: 'Abby',
            lastName: 'Sciuto',
            department: 'Laboratory',
            isActive: true,
            permissions: { canView: ['lab'], canEdit: ['lab'], canDelete: [], canApprove: [] }
        });

        // Radiologists
        const radiologist1 = await User.create({
            email: 'radiology@medicore.com',
            password: hashedPassword,
            role: 'radiology',
            firstName: 'Derek',
            lastName: 'Shepherd',
            department: 'Radiology',
            isActive: true,
            permissions: { canView: ['radiology'], canEdit: ['radiology'], canDelete: [], canApprove: [] }
        });

        const radiologist2 = await User.create({
            email: 'radiologist@medicore.com',
            password: hashedPassword,
            role: 'radiology',
            firstName: 'Cristina',
            lastName: 'Yang',
            department: 'Radiology',
            isActive: true,
            permissions: { canView: ['radiology'], canEdit: ['radiology'], canDelete: [], canApprove: [] }
        });

        // Other roles
        const roles = [
            { email: 'nurse@medicore.com', role: 'nurse', first: 'Jackie', last: 'Peyton', dept: 'Nursing' },
            { email: 'admin@medicore.com', role: 'admin', first: 'Lisa', last: 'Cuddy', dept: 'Administration' },
            { email: 'frontdesk@medicore.com', role: 'frontdesk', first: 'Pam', last: 'Beesly', dept: 'Front Desk' },
            { email: 'billing@medicore.com', role: 'billing', first: 'Skyler', last: 'White', dept: 'Billing' },
            { email: 'pharmacy@medicore.com', role: 'pharmacy', first: 'Walter', last: 'White', dept: 'Pharmacy' },
            { email: 'hr@medicore.com', role: 'hr', first: 'Toby', last: 'Flenderson', dept: 'Human Resources' },
            { email: 'emergency@medicore.com', role: 'emergency', first: 'Mark', last: 'Greene', dept: 'Emergency' },
            { email: 'finance@medicore.com', role: 'finance', first: 'Michael', last: 'Scott', dept: 'Finance' },
        ];

        for (const u of roles) {
            await User.create({
                email: u.email,
                password: hashedPassword,
                role: u.role,
                firstName: u.first,
                lastName: u.last,
                department: u.dept,
                isActive: true,
                permissions: { canView: [], canEdit: [], canDelete: [], canApprove: [] }
            });
            console.log(`   ✓ ${u.role}: ${u.email}`);
        }

        console.log(`   ✓ doctor: ${doctor1.email}`);
        console.log(`   ✓ doctor: ${doctor2.email}`);
        console.log(`   ✓ lab: ${labTech1.email}`);
        console.log(`   ✓ lab: ${labTech2.email}`);
        console.log(`   ✓ radiology: ${radiologist1.email}`);
        console.log(`   ✓ radiology: ${radiologist2.email}`);

        // Create Patients
        console.log('🏥 Creating patients...');
        const patients = [];

        const patientData = [
            { mrn: 'MRN001', first: 'Alice', last: 'Cooper', dob: '1985-05-15', gender: 'Female', email: 'alice@example.com', phone: '555-0101', doctor: doctor1._id },
            { mrn: 'MRN002', first: 'Bob', last: 'Marley', dob: '1970-02-06', gender: 'Male', email: 'bob@example.com', phone: '555-0102', doctor: doctor1._id },
            { mrn: 'MRN003', first: 'Charlie', last: 'Brown', dob: '1990-10-10', gender: 'Male', email: 'charlie@example.com', phone: '555-0103', doctor: doctor2._id },
            { mrn: 'MRN004', first: 'Diana', last: 'Prince', dob: '1988-07-22', gender: 'Female', email: 'diana@example.com', phone: '555-0104', doctor: doctor2._id },
            { mrn: 'MRN005', first: 'Edward', last: 'Norton', dob: '1975-11-30', gender: 'Male', email: 'edward@example.com', phone: '555-0105', doctor: doctor1._id },
            { mrn: 'MRN006', first: 'Fiona', last: 'Apple', dob: '1992-03-18', gender: 'Female', email: 'fiona@example.com', phone: '555-0106', doctor: doctor2._id },
        ];

        for (const p of patientData) {
            const patient = await Patient.create({
                mrn: p.mrn,
                firstName: p.first,
                lastName: p.last,
                dob: new Date(p.dob),
                gender: p.gender,
                contact: { phone: p.phone, email: p.email },
                assignedDoctorId: p.doctor,
                allergies: ['Penicillin'],
                chronicConditions: ['Hypertension']
            });
            patients.push(patient);
            console.log(`   ✓ ${p.first} ${p.last} (${p.mrn})`);
        }

        // Create Patient Users (for patient portal access)
        console.log('🔐 Creating patient portal accounts...');
        for (let i = 0; i < 3; i++) {
            await User.create({
                email: `patient${i + 1}@medicore.com`,
                password: hashedPassword,
                role: 'patient',
                firstName: patients[i].firstName,
                lastName: patients[i].lastName,
                isActive: true,
                permissions: { canView: ['own'], canEdit: ['own'], canDelete: [], canApprove: [] }
            });
            console.log(`   ✓ patient: patient${i + 1}@medicore.com`);
        }

        // Create Lab Orders
        console.log('🧪 Creating lab orders...');

        // Pending Lab Orders (for lab portal to process)
        const labOrder1 = await LabOrder.create({
            orderId: `LAB-${Date.now()}-001`,
            patientId: patients[0]._id,
            orderingProviderId: doctor1._id,
            tests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'Blood Sugar (Fasting)'],
            priority: 'stat',
            status: 'ordered',
            results: []
        });

        const labOrder2 = await LabOrder.create({
            orderId: `LAB-${Date.now()}-002`,
            patientId: patients[1]._id,
            orderingProviderId: doctor1._id,
            tests: ['Liver Function Test (LFT)', 'Kidney Function Test (KFT)'],
            priority: 'urgent',
            status: 'ordered',
            results: []
        });

        const labOrder3 = await LabOrder.create({
            orderId: `LAB-${Date.now()}-003`,
            patientId: patients[2]._id,
            orderingProviderId: doctor2._id,
            tests: ['Thyroid Profile', 'Urine Routine'],
            priority: 'routine',
            status: 'ordered',
            results: []
        });

        const labOrder4 = await LabOrder.create({
            orderId: `LAB-${Date.now()}-004`,
            patientId: patients[3]._id,
            orderingProviderId: doctor2._id,
            tests: ['Complete Blood Count (CBC)'],
            priority: 'urgent',
            status: 'collected',
            sampleCollectedAt: new Date(),
            results: []
        });

        // Completed Lab Order (with results)
        const labOrder5 = await LabOrder.create({
            orderId: `LAB-${Date.now()}-005`,
            patientId: patients[0]._id,
            orderingProviderId: doctor1._id,
            tests: ['Blood Sugar (Fasting)', 'HbA1c'],
            priority: 'routine',
            status: 'completed',
            sampleCollectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            resultDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            technicianId: labTech1._id,
            reviewedBy: labTech1._id,
            results: [
                {
                    testName: 'Blood Sugar (Fasting)',
                    value: '145',
                    unit: 'mg/dL',
                    referenceRange: '70-100',
                    abnormalFlag: true,
                    notes: 'Elevated glucose levels, recommend follow-up'
                },
                {
                    testName: 'HbA1c',
                    value: '7.2',
                    unit: '%',
                    referenceRange: '4.0-5.6',
                    abnormalFlag: true,
                    notes: 'Indicates poor glycemic control'
                }
            ]
        });

        console.log(`   ✓ Created ${5} lab orders (3 pending, 1 collected, 1 completed)`);

        // Create Imaging Orders
        console.log('📸 Creating radiology orders...');

        // Pending Imaging Orders (for radiology portal to process)
        const imagingOrder1 = await ImagingOrder.create({
            patientId: patients[0]._id,
            orderedBy: doctor1._id,
            imagingType: 'X-Ray',
            bodyPart: 'Chest',
            priority: 'stat',
            reasonForStudy: 'Suspected pneumonia, persistent cough for 2 weeks',
            status: 'ordered'
        });

        const imagingOrder2 = await ImagingOrder.create({
            patientId: patients[1]._id,
            orderedBy: doctor1._id,
            imagingType: 'MRI',
            bodyPart: 'Brain',
            priority: 'urgent',
            reasonForStudy: 'Severe headaches, rule out intracranial pathology',
            status: 'ordered'
        });

        const imagingOrder3 = await ImagingOrder.create({
            patientId: patients[2]._id,
            orderedBy: doctor2._id,
            imagingType: 'CT Scan',
            bodyPart: 'Abdomen',
            priority: 'routine',
            reasonForStudy: 'Abdominal pain, evaluate for appendicitis',
            status: 'scheduled',
            scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        });

        const imagingOrder4 = await ImagingOrder.create({
            patientId: patients[3]._id,
            orderedBy: doctor2._id,
            imagingType: 'Ultrasound',
            bodyPart: 'Abdomen',
            priority: 'urgent',
            reasonForStudy: 'Right upper quadrant pain, rule out gallstones',
            status: 'in-progress'
        });

        // Completed Imaging Order (with report)
        const imagingOrder5 = await ImagingOrder.create({
            patientId: patients[0]._id,
            orderedBy: doctor1._id,
            imagingType: 'X-Ray',
            bodyPart: 'Knee',
            priority: 'routine',
            reasonForStudy: 'Post-injury evaluation, knee pain',
            status: 'completed',
            scheduledAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });

        // Create Radiology Report for completed order
        await RadiologyReport.create({
            orderId: imagingOrder5._id,
            patientId: patients[0]._id,
            interpretedBy: radiologist1._id,
            findings: 'No acute fracture or dislocation identified. Mild degenerative changes noted in the medial compartment. Joint space is preserved. Soft tissues appear normal.',
            impression: 'No acute osseous abnormality. Mild osteoarthritic changes.',
            recommendations: 'Conservative management with NSAIDs and physical therapy. Follow-up if symptoms persist or worsen.',
            status: 'final',
            signedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        });

        console.log(`   ✓ Created ${5} imaging orders (2 pending, 1 scheduled, 1 in-progress, 1 completed with report)`);

        // Create Appointments
        console.log('📅 Creating appointments...');
        const today = new Date();
        today.setHours(9, 0, 0, 0);

        await Appointment.create({
            appointmentId: 'APP001',
            patientId: patients[0]._id,
            providerId: doctor1._id,
            startTime: new Date(today),
            endTime: new Date(today.getTime() + 30 * 60000),
            status: 'checked-in',
            type: 'consultation',
            reason: 'Diabetes Follow-up'
        });

        await Appointment.create({
            appointmentId: 'APP002',
            patientId: patients[1]._id,
            providerId: doctor1._id,
            startTime: new Date(today.getTime() + 60 * 60000),
            endTime: new Date(today.getTime() + 90 * 60000),
            status: 'scheduled',
            type: 'follow-up',
            reason: 'Review MRI results'
        });

        console.log(`   ✓ Created 2 appointments`);

        console.log('\n✨ Seeding complete!');
        console.log('\n📋 Login Credentials:');
        console.log('   Doctor: doctor@medicore.com / password123');
        console.log('   Doctor 2: doctor2@medicore.com / password123');
        console.log('   Lab Tech: lab@medicore.com / password123');
        console.log('   Radiologist: radiology@medicore.com / password123');
        console.log('   Patient: patient1@medicore.com / password123');
        console.log('   Admin: admin@medicore.com / password123');
        console.log('\n📊 Data Summary:');
        console.log(`   - ${6} Patients created`);
        console.log(`   - ${5} Lab orders (3 pending, 1 collected, 1 completed)`);
        console.log(`   - ${5} Radiology orders (2 pending, 1 scheduled, 1 in-progress, 1 completed)`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedWorkflowData();
