const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function seedTickets() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected.');

        const MaintenanceTicketSchema = new mongoose.Schema({
            title: String,
            description: String,
            category: String,
            priority: String,
            status: String,
            requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        }, { timestamps: true });

        const MaintenanceTicket = mongoose.models.MaintenanceTicket || mongoose.model('MaintenanceTicket', MaintenanceTicketSchema);
        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));

        const maintenanceUser = await User.findOne({ email: 'maintenance@medicore.com' });
        if (!maintenanceUser) throw new Error("Maintenance user not found");

        const tickets = [
            {
                title: "Broken AC in Server Room",
                description: "Urgent fix needed",
                category: "Other", // "HVAC" not in enum, using "Other" or valid enum. Valid: "Elevator", "Plumbing", "Electrical", "Equipment", "Furniture", "Other"
                priority: "Critical",
                status: "Approved",
                requestedBy: maintenanceUser._id
            },
            {
                title: "Leaky Faucet in Room 202",
                description: "Dripping constantly",
                category: "Plumbing",
                priority: "Low",
                status: "Approved",
                requestedBy: maintenanceUser._id
            },
            {
                title: "Flickering Light in Hallway",
                description: "Needs bulb replacement",
                category: "Electrical",
                priority: "Medium",
                status: "Pending Approval",
                requestedBy: maintenanceUser._id
            },
            {
                title: "Broken Chair in Waiting Area",
                description: "Leg is loose",
                category: "Furniture",
                priority: "Medium",
                status: "Rejected",
                requestedBy: maintenanceUser._id
            },
            {
                title: "Elevator Request",
                description: "Buttons stuck",
                category: "Elevator",
                priority: "High",
                status: "Rejected",
                requestedBy: maintenanceUser._id
            }
        ];

        // Clear existing just to be clean? Or append? Let's append but maybe log counts.
        // await MaintenanceTicket.deleteMany({}); 

        for (const t of tickets) {
            await MaintenanceTicket.create(t);
            console.log(`Created ticket: ${t.title} [${t.status}]`);
        }

        console.log('Seeding tickets complete!');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedTickets();
