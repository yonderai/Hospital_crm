
const mongoose = require('mongoose');

// Define minimal schema just for checking
const UserSchema = new mongoose.Schema({
    email: String,
    role: String,
    isActive: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function checkNurse() {
    try {
        const uri = "mongodb://localhost:27017/medicore";

        await mongoose.connect(uri);
        console.log("Connected to DB at", uri);

        const nurse = await User.findOne({ email: 'nurse@medicore.com' });
        if (!nurse) {
            console.log("Nurse NOT found");
        } else {
            console.log("Nurse Found:", JSON.stringify({
                email: nurse.email,
                role: nurse.role,
                isActive: nurse.isActive
            }, null, 2));
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

checkNurse();
