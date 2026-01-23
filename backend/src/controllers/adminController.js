import Expense from '../models/Expense.js';
import Inventory from '../models/Inventory.js';
import User from '../models/User.js';
import Billing from '../models/Billing.js';

// @desc    Get Admin Dashboard Summary
// @route   GET /api/admin/summary
// @access  Private (Admin only)
export const getAdminDashboard = async (req, res) => {
    try {
        const totalExpenses = await Expense.aggregate([
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        const totalRevenue = await Billing.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        const lowStockItems = await Inventory.countDocuments({
            $expr: { $lte: ["$quantity", "$reorderLevel"] }
        });

        const activeStaff = await User.countDocuments({ role: { $ne: 'PATIENT' } });

        res.json({
            summary: {
                totalExpenses: totalExpenses[0]?.total || 0,
                totalRevenue: totalRevenue[0]?.total || 0,
                lowStockItems,
                activeStaff
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get All Expenses
// @route   GET /api/admin/expenses
// @access  Private (Admin only)
export const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Stock Overview
// @route   GET /api/admin/stock
// @access  Private (Admin only)
export const getStockOverview = async (req, res) => {
    try {
        const stock = await Inventory.find();
        res.json(stock);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Staff Overview
// @route   GET /api/admin/staff
// @access  Private (Admin only)
export const getStaffOverview = async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: 'PATIENT' } }).select('-password');
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Billing Overview (Read-only)
// @route   GET /api/admin/billing
// @access  Private (Admin only)
export const getBillingOverview = async (req, res) => {
    try {
        const bills = await Billing.find().populate('patient', 'name email');
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
