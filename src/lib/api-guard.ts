import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function protectRoute(allowedRoles: string[] = []) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return { error: "Unauthorized", status: 401 };
    }

    const userRole = (session.user as any).role;

    // If roles provided, check permission
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return { error: "Forbidden", status: 403 };
    }

    return { session, user: session.user as any };
}
