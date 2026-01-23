import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export type Role = "admin" | "doctor" | "nurse" | "lab-tech" | "front-desk" | "pharmacist" | "billing" | "hr" | "inventory" | "patient" | "finance";

export async function protectRoute(allowedRoles: Role[]) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return {
            error: "Unauthorized: No active session found",
            status: 401,
            user: null
        };
    }

    const userRole = (session.user as any).role as Role;

    if (!allowedRoles.includes(userRole)) {
        return {
            error: `Forbidden: User role '${userRole}' is not authorized. Required: ${allowedRoles.join(", ")}`,
            status: 403,
            user: session.user
        };
    }

    return { session, user: session.user, error: null };
}
