
const mongoose = require('mongoose');
// Define schema inline to avoid TS issues
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String },
    password: { type: String, required: true },
    role: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority')
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const count = await User.countDocuments();
            console.log(`Total users in DB: ${count}`);

            const financeUser = await User.findOne({ email: 'finance@hospital.com' });
            console.log('Finance User:', financeUser);

            const users = await User.find({}).select('+password');
            console.log('--- ALL USERS DUMP ---');
            users.forEach(u => {
                console.log(`Email: ${u.email}, ID: ${u.employeeId}, Role: ${u.role}`);
            });
            console.log('-------------------');
        } catch (err) {
            console.error('Error querying users:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('Connection error:', err);
    });
