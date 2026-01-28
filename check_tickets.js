
const mongoose = require('mongoose');

// Define MaintenanceTicket Schema Inline
const ticketSchema = new mongoose.Schema({
    title: String,
    status: String,
    category: String,
    priority: String,
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const MaintenanceTicket = mongoose.models.MaintenanceTicket || mongoose.model('MaintenanceTicket', ticketSchema);

mongoose.connect('mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority')
    .then(async () => {
        console.log('Connected to DB');

        try {
            const count = await MaintenanceTicket.countDocuments();
            console.log(`Total Tickets: ${count}`);

            const tickets = await MaintenanceTicket.find({});
            console.log('--- TICKETS ---');
            tickets.forEach(t => {
                console.log(`ID: ${t._id}`);
                console.log(`Title: ${t.title}`);
                console.log(`Status: ${t.status}`);
                console.log(`Requester: ${t.requestedBy}`);
                console.log('----------------');
            });

        } catch (e) {
            console.error(e);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error(err));
