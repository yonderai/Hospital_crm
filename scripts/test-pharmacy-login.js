// Test pharmacy login credentials
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function testPharmacyLogin() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected\n');

        const userSchema = new mongoose.Schema({
            email: String,
            password: String,
            role: String,
            firstName: String,
            lastName: String,
            isActive: Boolean
        });

        const User = mongoose.models.User || mongoose.model('User', userSchema);

        // Test credentials
        const testEmail = 'pharmacy@medicore.com';
        const testPassword = 'a';

        console.log(`🔍 Looking for user: ${testEmail}`);
        const user = await User.findOne({ email: testEmail });

        if (!user) {
            console.log('❌ Pharmacy user NOT found in database!');
            console.log('\n📋 All users with pharmacy-related roles:');
            const pharmacyUsers = await User.find({
                $or: [
                    { role: 'pharmacy' },
                    { role: 'pharmacist' },
                    { email: /pharmacy/i }
                ]
            }, 'email role firstName lastName isActive');

            if (pharmacyUsers.length === 0) {
                console.log('   No pharmacy users found!');
            } else {
                pharmacyUsers.forEach(u => {
                    console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`);
                });
            }
        } else {
            console.log('✅ User found!');
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Name: ${user.firstName} ${user.lastName}`);
            console.log(`   Active: ${user.isActive}`);

            console.log(`\n🔐 Testing password: "${testPassword}"`);
            const isValid = await bcrypt.compare(testPassword, user.password);

            if (isValid) {
                console.log('✅ Password is CORRECT!');
            } else {
                console.log('❌ Password is INCORRECT!');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

testPharmacyLogin();
