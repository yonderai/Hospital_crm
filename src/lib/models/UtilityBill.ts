import mongoose, { Schema, Document } from "mongoose";

export interface IUtilityBill extends Document {
    utilityType: "electricity" | "water" | "diesel" | "gas" | "internet-utility";
    providerName: string;
    billNumber: string;
    consumption?: number; // e.g., kWh for electricity, Liters for water/diesel
    unit?: string; // e.g., "kWh", "L", "GB"
    amount: number;
    billingPeriodStart?: Date;
    billingPeriodEnd?: Date;
    billDate: Date;
    dueDate: Date;
    status: "unpaid" | "paid" | "overdue";
    paymentDate?: Date;
    department?: string; // For dept-wise tracking (ICU, Labs, etc.)
    meterReadingStart?: number;
    meterReadingEnd?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UtilityBillSchema = new Schema<IUtilityBill>(
    {
        utilityType: {
            type: String,
            required: true,
            enum: ["electricity", "water", "diesel", "gas", "internet"],
        },
        providerName: { type: String, required: true },
        billNumber: { type: String, required: true },
        consumption: { type: Number },
        unit: { type: String },
        amount: { type: Number, required: true },
        billingPeriodStart: { type: Date },
        billingPeriodEnd: { type: Date },
        billDate: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ["unpaid", "paid", "overdue"],
            default: "unpaid",
        },
        paymentDate: { type: Date },
        department: { type: String },
        meterReadingStart: { type: Number },
        meterReadingEnd: { type: Number },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.UtilityBill || mongoose.model<IUtilityBill>("UtilityBill", UtilityBillSchema);
