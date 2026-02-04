import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hospital-crm";

async function checkLabData() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("✅ Connected to MongoDB\n");

        const Patient = (await import('../src/lib/models/Patient')).default;
        const LabOrder = (await import('../src/lib/models/LabOrder')).default;
        const RadiologyReport = (await import('../src/lib/models/RadiologyReport')).default;

        const patient = await Patient.findOne({ firstName: 'shruti' });
        if (!patient) {
            console.log("❌ Patient not found");
            process.exit(1);
        }

        console.log(`📋 Patient: ${patient.firstName} ${patient.lastName} (${patient._id})\n`);

        // Check all lab orders
        const allLabs = await LabOrder.find({ patientId: patient._id });
        console.log(`📊 Total Lab Orders: ${allLabs.length}`);
        allLabs.forEach((lab, idx) => {
            console.log(`  ${idx + 1}. ${lab.orderId}`);
            console.log(`     Status: ${lab.status}`);
            console.log(`     Results: ${lab.results?.length || 0}`);
            console.log(`     Tests: ${lab.tests?.join(', ')}`);
        });

        // Check completed labs with results
        console.log(`\n🔍 Filtering: status='completed' AND results exist`);
        const completedLabs = await LabOrder.find({
            patientId: patient._id,
            status: 'completed',
            results: { $exists: true, $ne: [] }
        });
        console.log(`✅ Completed Labs with Results: ${completedLabs.length}\n`);

        // Check radiology reports
        const allRadiology = await RadiologyReport.find({ patientId: patient._id });
        console.log(`📸 Total Radiology Reports: ${allRadiology.length}`);
        allRadiology.forEach((report, idx) => {
            console.log(`  ${idx + 1}. Status: ${report.status}`);
        });

        const submittedRadiology = await RadiologyReport.find({
            patientId: patient._id,
            status: { $in: ['preliminary', 'final', 'corrected'] }
        });
        console.log(`✅ Submitted Radiology Reports: ${submittedRadiology.length}\n`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkLabData();
