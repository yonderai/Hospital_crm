import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, enum: ['Medicine', 'Equipment', 'Consumable'], required: true },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 0 },
    unit: { type: String, required: true }, // e.g., tablets, vials, pieces
    reorderLevel: { type: Number, default: 10 },
    supplier: { type: String },
    unitPrice: { type: Number, required: true },
    lastRestocked: { type: Date, default: Date.now }
});

export default mongoose.model('Inventory', inventorySchema);
