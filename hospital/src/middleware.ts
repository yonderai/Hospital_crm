import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role as string | undefined;

        // 1. Redirect unauthenticated users is handled by withAuth automatically for matched pages,
        // but we add explicit checks for better control if needed.

        // Strict Role Guards

        // Doctor Portal
        if (path.startsWith("/doctor") && role !== "doctor") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Pharmacy Portal
        if (path.startsWith("/pharmacy") && role !== "pharmacist") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Inventory Portal (Accessible by Pharmacist and Inventory Manager)
        if (path.startsWith("/inventory") && role !== "inventory" && role !== "pharmacist") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Diagnostics Hub (Lab & Imaging) - Mapped to /lab-tech
        if (path.startsWith("/lab-tech") && role !== "lab-tech") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }
        // Also guard legacy /lab path if it exists or is used
        if (path.startsWith("/lab") && role !== "lab-tech") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Front Desk
        if ((path.startsWith("/front-desk") || path.startsWith("/frontdesk")) && role !== "front-desk") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Nurse Portal
        if (path.startsWith("/nurse") && role !== "nurse") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Revenue / Billing
        if (path.startsWith("/billing") && role !== "billing") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Finance / Back Office (Admin Only for now as per dashboard content)
        if (path.startsWith("/finance") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // HR Portal
        if (path.startsWith("/hr") && role !== "hr") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Admin Portal
        if (path.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        // Patient Portal
        if (path.startsWith("/patient-portal") && role !== "patient") {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        "/doctor/:path*",
        "/pharmacy/:path*",
        "/inventory/:path*",
        "/lab-tech/:path*",
        "/lab/:path*",
        "/front-desk/:path*",
        "/frontdesk/:path*",
        "/nurse/:path*",
        "/billing/:path*",
        "/finance/:path*",
        "/hr/:path*",
        "/admin/:path*",
        "/patient-portal/:path*"
    ]
};
