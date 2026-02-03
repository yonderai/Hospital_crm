
const mongoose = require('mongoose');
const fs = require('fs');

const envPath = '/Users/yuvrajsingh/medical/Hospital_crm/.env';
const envContent = fs.readFileSync(envPath, 'utf8');
const MONGODB_URI = envContent.split('\n')
    .find(line => line.startsWith('MONGODB_URI='))
    .split('=')[1]
    .trim()
    .replace(/^["'](.+)["']$/, '$1');

async function diagnose() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', new mongoose.Schema({}, { strict: false }));

    const latestItem = await InventoryItem.findOne().sort({ createdAt: -1 });
    if (latestItem) {
        console.log("Latest Item Structure:");
        console.log(JSON.stringify(latestItem.toObject(), null, 2));
    } else {
        console.log("No items found.");
    }

    await mongoose.disconnect();
}

diagnose().catch(console.error);
