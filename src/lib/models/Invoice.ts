import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    code?: string; // CPT/HCPCS code
    isInsuranceCovered: boolean;
}

export interface IInvoice extends Document {
    patientId: mongoose.Types.ObjectId;
    encounterId?: mongoose.Types.ObjectId;
    invoiceNumber: string;
    items: IInvoiceItem[];
    totalAmount: number;
    amountPaid: number;
    insuranceCalculation: {
        totalBillAmount: number;
        insuranceCoveredAmount: number;
        totalPatientPayable: number;
        deductibleApplied: number;
        coPayApplied: number;
        coInsuranceApplied: number;
        claimStatus: "pending" | "approved" | "rejected" | "partial" | "not_initiated";
        claimId?: string;
    };
    paymentSplit: {
        payer: "patient" | "insurance" | "third_party";
        amount: number;
        status: "paid" | "pending" | "failed";
        method?: string;
        transactionId?: string;
        date?: Date;
    }[];
    insuranceCoverage: number;
    balanceDue: number;
    status: "draft" | "sent" | "partial" | "paid" | "void" | "overdue" | "claim_processing";
    dueDate: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
    description: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    unitPrice: { type: Number, required: true },
    total: { type: Number, required: true },
    code: { type: String },
    isInsuranceCovered: { type: Boolean, default: false },
});

const InvoiceSchema = new Schema<IInvoice>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter", index: true },
        invoiceNumber: { type: String, required: true, unique: true },
        items: [InvoiceItemSchema],
        totalAmount: { type: Number, required: true },
        amountPaid: { type: Number, default: 0 },
        insuranceCalculation: {
            totalBillAmount: { type: Number },
            insuranceCoveredAmount: { type: Number },
            totalPatientPayable: { type: Number },
            deductibleApplied: { type: Number, default: 0 },
            coPayApplied: { type: Number, default: 0 },
            coInsuranceApplied: { type: Number, default: 0 },
            claimStatus: {
                type: String,
                enum: ["pending", "approved", "rejected", "partial", "not_initiated"],
                default: "not_initiated"
            },
            claimId: { type: String }
        },
        paymentSplit: [{
            payer: { type: String, enum: ["patient", "insurance", "third_party"], required: true },
            amount: { type: Number, required: true },
            status: { type: String, enum: ["paid", "pending", "failed"], default: "pending" },
            method: { type: String },
            transactionId: { type: String },
            date: { type: Date }
        }],
        insuranceCoverage: { type: Number, default: 0 },
        balanceDue: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["draft", "sent", "partial", "paid", "void", "overdue", "claim_processing"],
            default: "draft"
        },
        dueDate: { type: Date, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
