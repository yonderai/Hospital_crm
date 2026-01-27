// Check if pharmacy inventory data exists
const mongoose = require('mongoose');

const MONGODB_URI = "mongodb+srv://yuvrajsingh02608_db_user:yuvrajsingh@yondermedicareai.b6dwyv5.mongodb.net/yonder_medicare?retryWrites=true&w=majority";

async function checkInventory() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected\n');

        const inventorySchema = new mongoose.Schema({}, { strict: false });
        const InventoryItem = mongoose.models.InventoryItem || mongoose.model('InventoryItem', inventorySchema, 'inventoryitems');

        console.log('📦 Checking inventory items...');
        const count = await InventoryItem.countDocuments();
        console.log(`   Total items: ${count}`);

        if (count > 0) {
            console.log('\n📋 Sample items:');
            const samples = await InventoryItem.find().limit(5);
            samples.forEach(item => {
                console.log(`   - ${item.name} (SKU: ${item.sku}) - Stock: ${item.quantityOnHand}`);
            });
        } else {
            console.log('   ❌ No inventory items found!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected');
    }
}

checkInventory();
