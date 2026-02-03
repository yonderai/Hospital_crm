import mongoose, { Schema, Document } from "mongoose";

export interface ISupplier extends Document {
    name: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    taxId?: string;
    categories: string[]; // e.g., ["pharmaceuticals", "surgical", "equipment"]
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const SupplierSchema = new Schema<ISupplier>(
    {
        name: { type: String, required: true },
        contactPerson: { type: String },
        phone: { type: String, minlength: 10, maxlength: 10 },
        email: { type: String },
        address: { type: String },
        taxId: { type: String },
        categories: { type: [String], default: [] },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Supplier || mongoose.model<ISupplier>("Supplier", SupplierSchema);
