import Expense from '../models/Expense.js';
import User from '../models/User.js';
import Inventory from '../models/Inventory.js';

// @desc    Add a new expense (Electricity, Rent, etc.)
// @route   POST /api/finance/expenses
// @access  Private (Back Office only)
export const addExpense = async (req, res) => {
    const { title, category, amount, description, paidTo, status } = req.body;

    try {
        const expense = await Expense.create({
            title,
            category,
            amount,
            description,
            paidTo,
            status
        });
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Calculate and generate payroll data
// @route   GET /api/finance/payroll
// @access  Private (Back Office only)
export const getPayrollData = async (req, res) => {
    try {
        // In a real system, this would link with HR attendance
        const staff = await User.find({ role: { $ne: 'PATIENT' } }).select('name role email');

        const payroll = staff.map(s => ({
            staffId: s._id,
            name: s.name,
            role: s.role,
            baseSalary: 5000, // Mock base
            allowances: 500,
            deductions: 200,
            totalPayable: 5300,
            status: 'Pending'
        }));

        res.json(payroll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Procurement management (Linked to inventory)
// @route   POST /api/finance/procurement
// @access  Private (Back Office only)
export const manageProcurement = async (req, res) => {
    const { itemName, quantity, cost, supplier } = req.body;

    try {
        // Create an expense for the procurement
        const expense = await Expense.create({
            title: `Procurement: ${itemName}`,
            category: 'Procurement',
            amount: cost,
            paidTo: supplier,
            status: 'Paid'
        });

        // Update inventory (if item exists, add quantity; otherwise create)
        let item = await Inventory.findOne({ name: itemName });
        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            // Need more details to create new, but for demo:
            console.log(`New item ${itemName} procured. Please update details in Pharmacy Portal.`);
        }

        res.status(201).json({ expense, message: 'Procurement recorded and inventory update triggered.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Asset depreciation tracking
// @route   GET /api/finance/assets
// @access  Private (Back Office only)
export const getAssetOverview = async (req, res) => {
    // Mock asset data
    res.json([
        { asset: 'MRI Machine', value: 1000000, depreciation: '10% annually', currentVal: 900000 },
        { asset: 'Ambulance', value: 50000, depreciation: '15% annually', currentVal: 42500 }
    ]);
};
