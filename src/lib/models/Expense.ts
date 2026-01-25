import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
    category: "rent" | "internet" | "housekeeping" | "security" | "waste-disposal" | "laundry" | "cafeteria" | "other";
    description: string;
    amount: number;
    currency: string;
    vendorId?: mongoose.Types.ObjectId;
    invoiceNumber?: string;
    expenseDate: Date;
    status: "pending" | "approved" | "rejected" | "paid";
    approvedBy?: mongoose.Types.ObjectId;
    paymentMethod?: "bank-transfer" | "check" | "cash" | "card";
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpense>(
    {
        category: {
            type: String,
            required: true,
            enum: ["rent", "internet", "housekeeping", "security", "waste-disposal", "laundry", "cafeteria", "other"],
        },
        description: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "INR" },
        vendorId: { type: Schema.Types.ObjectId, ref: "Supplier" },
        invoiceNumber: { type: String },
        expenseDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "paid"],
            default: "pending",
        },
        approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
        paymentMethod: {
            type: String,
            enum: ["bank-transfer", "check", "cash", "card"],
        },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model<IExpense>("Expense", ExpenseSchema);
