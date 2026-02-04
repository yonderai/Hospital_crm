import dbConnect from '@/lib/db';
import AuditLog from "@/lib/models/AuditLog";

export const logClinicalAccess = async (
    userId: string,
    action: string,
    resource: string,
    resourceId: string,
    details?: any,
    severity: "info" | "warning" | "critical" = "info"
) => {
    try {
        await dbConnect();
        await AuditLog.create({
            userId,
            action,
            resource,
            resourceId,
            details,
            severity,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Clinical Audit Logging Failed:", error);
    }
};
