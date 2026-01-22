import mongoose, { Schema, Document } from "mongoose";

export interface IInvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    code?: string; // CPT/HCPCS code
}

export interface IInvoice extends Document {
    patientId: mongoose.Types.ObjectId;
    encounterId?: mongoose.Types.ObjectId;
    invoiceNumber: string;
    items: IInvoiceItem[];
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    status: "draft" | "sent" | "partial" | "paid" | "void" | "overdue";
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
});

const InvoiceSchema = new Schema<IInvoice>(
    {
        patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
        encounterId: { type: Schema.Types.ObjectId, ref: "Encounter", index: true },
        invoiceNumber: { type: String, required: true, unique: true },
        items: [InvoiceItemSchema],
        totalAmount: { type: Number, required: true },
        amountPaid: { type: Number, default: 0 },
        balanceDue: { type: Number, required: true },
        status: {
            type: String,
            required: true,
            enum: ["draft", "sent", "partial", "paid", "void", "overdue"],
            default: "draft"
        },
        dueDate: { type: Date, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);
