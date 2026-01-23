import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, enum: ['Electricity', 'Water', 'Rent', 'Maintenance', 'AMC', 'Payroll', 'Procurement', 'Copex', 'Other'], required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    description: { type: String },
    paidTo: { type: String },
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' }
});

export default mongoose.model('Expense', expenseSchema);
