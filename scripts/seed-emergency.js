
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI;

const UserSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, required: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        permissions: {
            canView: { type: [String], default: [] },
            canEdit: { type: [String], default: [] },
            canDelete: { type: [String], default: [] },
            canApprove: { type: [String], default: [] },
        },
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to DB");

        const hashedPassword = await bcrypt.hash("emergency123", 10);

        const emergencyUser = {
            email: "emergency@hospital.com",
            password: hashedPassword,
            role: "emergency",
            firstName: "Emergency",
            lastName: "Manager",
            isActive: true,
            permissions: {
                canView: ["emergency"],
                canEdit: ["emergency"],
                canDelete: [],
                canApprove: []
            }
        };

        const existing = await User.findOne({ email: emergencyUser.email });
        if (existing) {
            console.log("Emergency user already exists. Updating...");
            await User.findOneAndUpdate({ email: emergencyUser.email }, emergencyUser);
        } else {
            await User.create(emergencyUser);
            console.log("Emergency user created.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding:", error);
        process.exit(1);
    }
}

seed();
