
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LabResult from '../src/lib/models/LabResult';
import ImagingOrder from '../src/lib/models/ImagingOrder';
import Patient from '../src/lib/models/Patient';
import User from '../src/lib/models/User';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-crm";

async function debugResults() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const email = 'patient@medicore.com';
        console.log(`Checking for patient email: ${email}`);

        const patient = await Patient.findOne({ "contact.email": email });
        if (!patient) {
            console.log("❌ Patient not found!");
            return;
        }
        console.log(`✅ Patient Found: ${patient.firstName} ${patient.lastName} (ID: ${patient._id})`);

        // Check Labs
        const allLabs = await LabResult.find({ patientId: patient._id });
        console.log(`\nFound ${allLabs.length} total Lab Results for patient.`);
        allLabs.forEach(lab => {
            console.log(`- Lab: ${lab.testType}, Status: ${lab.status}`);
        });

        // Check Radiology
        const allImaging = await ImagingOrder.find({ patientId: patient._id });
        console.log(`\nFound ${allImaging.length} total Imaging Orders for patient.`);
        allImaging.forEach(img => {
            console.log(`- Imaging: ${img.imagingType}, Status: ${img.status}`);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugResults();
