// Test login credentials
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yuvrajsingh02608_db_user.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function testLogin() {
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
        const testEmail = 'lab@medicore.com';
        const testPassword = 'a';

        console.log(`🔍 Looking for user: ${testEmail}`);
        const user = await User.findOne({ email: testEmail });

        if (!user) {
            console.log('❌ User NOT found in database!');
            console.log('\n📋 Available users:');
            const allUsers = await User.find({}, 'email role firstName lastName isActive');
            allUsers.forEach(u => {
                console.log(`   - ${u.email} (${u.role}) - Active: ${u.isActive}`);
            });
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
                console.log('\n✨ Login should work with:');
                console.log(`   Email: ${testEmail}`);
                console.log(`   Password: ${testPassword}`);
            } else {
                console.log('❌ Password is INCORRECT!');
                console.log('\n🔍 Testing other common passwords...');
                const testPasswords = ['password123', 'a', 'lab', 'admin'];
                for (const pwd of testPasswords) {
                    const valid = await bcrypt.compare(pwd, user.password);
                    if (valid) {
                        console.log(`✅ Correct password is: "${pwd}"`);
                        break;
                    }
                }
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

testLogin();
