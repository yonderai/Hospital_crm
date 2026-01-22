import mongoose, { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
    staffId: mongoose.Types.ObjectId;
    month: number;
    year: number;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netPay: number;
    status: "pending" | "processed" | "paid";
    paymentDate?: Date;
    transactionReference?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PayrollSchema = new Schema<IPayroll>(
    {
        staffId: { type: Schema.Types.ObjectId, ref: "Staff", required: true, index: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        baseSalary: { type: Number, required: true },
        allowances: { type: Number, default: 0 },
        deductions: { type: Number, default: 0 },
        netPay: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["pending", "processed", "paid"],
            default: "pending"
        },
        paymentDate: { type: Date },
        transactionReference: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Payroll || mongoose.model<IPayroll>("Payroll", PayrollSchema);
