import Inventory from '../models/Inventory.js';
import Prescription from '../models/Prescription.js';

// @desc    Dispense medicine based on prescription
// @route   POST /api/pharmacy/dispense
// @access  Private (Pharmacy only)
export const dispenseMedicine = async (req, res) => {
    const { prescriptionId, medicinesToDispense } = req.body;
    // medicinesToDispense: [{ medicineId, quantity }]

    try {
        const prescription = await Prescription.findById(prescriptionId);
        if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

        for (const item of medicinesToDispense) {
            const inventoryItem = await Inventory.findById(item.medicineId);
            if (!inventoryItem || inventoryItem.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${inventoryItem?.name || 'item'}` });
            }

            inventoryItem.quantity -= item.quantity;
            await inventoryItem.save();
        }

        res.json({ message: 'Medicines dispensed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Inventory Overview
// @route   GET /api/pharmacy/inventory
// @access  Private (Pharmacy only)
export const getInventoryOverview = async (req, res) => {
    try {
        const inventory = await Inventory.find().sort({ expiryDate: 1 });
        res.json(inventory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update Inventory (Restock)
// @route   POST /api/pharmacy/inventory
// @access  Private (Pharmacy only)
export const updateInventory = async (req, res) => {
    const { name, category, batchNumber, expiryDate, quantity, unit, unitPrice, supplier } = req.body;

    try {
        const item = await Inventory.create({
            name,
            category,
            batchNumber,
            expiryDate,
            quantity,
            unit,
            unitPrice,
            supplier
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Low Stock Alerts
// @route   GET /api/pharmacy/low-stock
// @access  Private (Pharmacy only)
export const getLowStockAlerts = async (req, res) => {
    try {
        const items = await Inventory.find({
            $expr: { $lte: ["$quantity", "$reorderLevel"] }
        });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
