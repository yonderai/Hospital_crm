
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabResult from '../src/lib/models/LabResult';
import ImagingOrder from '../src/lib/models/ImagingOrder';
import Patient from '../src/lib/models/Patient';
import User from '../src/lib/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seedPatientData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const email = 'patient@medicore.com';
        const patient = await Patient.findOne({ "contact.email": email });

        if (!patient) {
            console.error("Patient not found! Run the main seed script first.");
            process.exit(1);
        }

        console.log(`Seeding data for: ${patient.firstName} ${patient.lastName}`);

        // Find a doctor to assign as performer
        const doctor = await User.findOne({ role: 'doctor' });
        const doctorId = doctor ? doctor._id : patient.assignedDoctorId;

        // 1. Create Lab Results
        const lab1 = await LabResult.create({
            orderId: new mongoose.Types.ObjectId(),
            patientId: patient._id,
            testType: 'Comprehensive Metabolic Panel (CMP)',
            resultValue: 'Normal',
            unit: 'N/A',
            referenceRange: 'Standard',
            abnormalFlag: false,
            status: 'final',
            performedBy: doctorId,
            createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
        });

        const lab2 = await LabResult.create({
            orderId: new mongoose.Types.ObjectId(),
            patientId: patient._id,
            testType: 'Lipid Panel',
            resultValue: 'High Cholesterol',
            unit: 'mg/dL',
            referenceRange: '< 200',
            abnormalFlag: true,
            status: 'final',
            performedBy: doctorId,
            createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
        });

        console.log("✅ Seeded 2 Lab Results");

        // 2. Create Imaging Orders (Radiology)
        const imaging1 = await ImagingOrder.create({
            patientId: patient._id,
            providerId: doctorId,
            imagingType: 'X-Ray',
            bodyPart: 'Chest',
            reason: 'Persistent Cough',
            priority: 'routine',
            status: 'completed',
            scheduledDate: new Date(Date.now() - 86400000 * 10),
            report: {
                radiologistId: doctorId,
                findings: 'Clear lung fields. No consolidation or pneumothorax.',
                impression: 'Normal chest X-ray.',
                recommendations: 'No further imaging needed.',
                finalizedAt: new Date(Date.now() - 86400000 * 9)
            }
        });

        console.log("✅ Seeded 1 Imaging Order");

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedPatientData();
