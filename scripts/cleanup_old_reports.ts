import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-crm";

async function cleanupOldData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        const Patient = (await import('../src/lib/models/Patient')).default;
        const LabOrder = (await import('../src/lib/models/LabOrder')).default;
        const RadiologyReport = (await import('../src/lib/models/RadiologyReport')).default;
        const ImagingOrder = (await import('../src/lib/models/ImagingOrder')).default;

        const patient = await Patient.findOne({ firstName: 'shruti' });
        if (!patient) {
            console.log("❌ Patient not found");
            process.exit(1);
        }

        console.log(`📋 Cleaning up data for: ${patient.firstName} ${patient.lastName}\n`);

        // 1. Delete ALL old lab orders for this patient
        const deletedLabs = await LabOrder.deleteMany({ patientId: patient._id });
        console.log(`🗑️  Deleted ${deletedLabs.deletedCount} old lab orders`);

        // 2. Delete ALL old radiology reports and imaging orders
        const deletedRadiology = await RadiologyReport.deleteMany({ patientId: patient._id });
        console.log(`🗑️  Deleted ${deletedRadiology.deletedCount} old radiology reports`);

        const deletedImaging = await ImagingOrder.deleteMany({ patientId: patient._id });
        console.log(`🗑️  Deleted ${deletedImaging.deletedCount} old imaging orders`);

        console.log(`\n✅ Cleanup complete! Now run the seed script to create fresh data:\n`);
        console.log(`   npx tsx scripts/seed_submitted_reports.ts\n`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

cleanupOldData();
