const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function fetchIds() {
    try {
        await mongoose.connect(MONGODB_URI);
        const Patient = mongoose.models.Patient || mongoose.model('Patient', new mongoose.Schema({}, { strict: false }));
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const patients = await Patient.find({});
        console.log('\n--- PATIENT IDs (For Front Desk Booking) ---');
        patients.forEach(p => console.log(`Name: ${p.firstName}, ID: ${p._id}`));

        const frontDesk = await User.findOne({ email: 'frontdesk@medicore.com' });
        console.log('\n--- FRONT DESK LOGIN ---');
        console.log(`Email: ${frontDesk?.email}`);

    } catch (e) { console.error(e); }
    finally { await mongoose.disconnect(); }
}

fetchIds();
