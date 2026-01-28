import Billing from '../models/Billing.js';

import PatientModel from '../models/Patient.js';

// @desc    Generate a new invoice
// @route   POST /api/revenue/invoices
// @access  Private (Revenue Office only)
export const createInvoice = async (req, res) => {
    const { patientId, items, insuranceCovered, paymentMethod, insurancePreAuthToken } = req.body;

    try {
        const patient = await PatientModel.findById(patientId);
        if (!patient) return res.status(404).json({ message: 'Patient not found' });

        const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);
        const patientPayable = totalAmount - (insuranceCovered || 0);

        const invoice = await Billing.create({
            patient: patientId,
            items,
            totalAmount,
            insuranceCovered,
            patientPayable,
            paymentMethod,
            insurancePreAuthToken,
            invoiceNumber: `INV-${Date.now()}`
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment status
// @route   PUT /api/revenue/invoices/:id/pay
// @access  Private (Revenue Office only)
export const updatePaymentStatus = async (req, res) => {
    const { status, paymentMethod } = req.body;

    try {
        const invoice = await Billing.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

        invoice.paymentStatus = status;
        if (paymentMethod) invoice.paymentMethod = paymentMethod;

        await invoice.save();
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all invoices and insurance claims
// @route   GET /api/revenue/invoices
// @access  Private (Revenue Office only)
export const getInvoices = async (req, res) => {
    try {
        const invoices = await Billing.find().populate('patient', 'name email phone').sort({ createdAt: -1 });
        res.json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Insurance pre-authorization triage
// @route   POST /api/revenue/insurance/pre-auth
// @access  Private (Revenue Office only)
export const insurancePreAuth = async (req, res) => {
    const { patientId, amountRequested, diagnosis } = req.body;

    try {
        // Mock insurance API response
        const preAuthToken = `AUTH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        res.json({
            status: 'Approved',
            preAuthToken,
            maxCoveredAmount: amountRequested * 0.8 // 80% coverage mock
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
