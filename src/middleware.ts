import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const { pathname } = req.nextUrl;

    // Public Paths
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/favicon.ico") ||
        pathname === "/login" ||
        pathname === "/access-denied"
    ) {
        if (isAuth && pathname === "/login") {
            const dashboardUrl = getDashboardUrl(token.role as string);
            // Only redirect if the dashboard URL is NOT /login (to avoid loops for invalid roles)
            if (dashboardUrl !== "/login") {
                return NextResponse.redirect(new URL(dashboardUrl, req.url));
            }
            return NextResponse.next();
        }
        return NextResponse.next();
    }

    // Handle root path -> Redirect to dashboard
    if (pathname === "/") {
        if (isAuth) {
            return NextResponse.redirect(new URL(getDashboardUrl(token?.role as string), req.url));
        } else {
            return NextResponse.redirect(new URL("/login", req.url));
        }
    }

    // Authentication Check
    if (!isAuth) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // RBAC Check
    const role = token?.role as string;
    if (!isAccessAllowed(role, pathname)) {
        // Redirect to their own dashboard if they try to access wrong one, or access-denied
        // For strict security, access-denied is better, or just redirect to their home.
        // User asked for "Redirect to /access-denied".
        return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    return NextResponse.next();
}

function getDashboardUrl(role: string) {
    switch (role) {
        case 'doctor': return '/doctor/dashboard';
        case 'nurse': return '/nurse/dashboard';
        case 'admin': return '/admin/dashboard';
        case 'frontdesk': return '/frontdesk/dashboard';
        case 'labtech': return '/lab/dashboard';
        case 'pathology': return '/pathology/overview';
        case 'billing': return '/billing/dashboard';
        case 'pharmacist': return '/pharmacy/overview';
        case 'hr': return '/hr/dashboard';
        case 'patient': return '/patient/dashboard';
        case 'finance': return '/finance/dashboard';
        case 'emergency': return '/emergency/dashboard';
        default: return '/login';
    }
}

function isAccessAllowed(role: string, path: string) {
    // API Access - refined strategy needed? For now allow API actions if authenticated, 
    // real backend should check RBAC too.
    if (path.startsWith("/api")) return true;

    if (role === 'doctor' && path.startsWith('/doctor')) return true;
    if (role === 'nurse' && path.startsWith('/nurse')) return true;
    if (role === 'admin' && path.startsWith('/admin')) return true;
    if (role === 'frontdesk' && path.startsWith('/frontdesk')) return true;
    if (role === 'labtech' && path.startsWith('/lab')) return true;
    if (role === 'pathology' && path.startsWith('/pathology')) return true;
    if (role === 'billing' && path.startsWith('/billing')) return true;
    if (role === 'pharmacist' && path.startsWith('/pharmacy')) return true;
    if (role === 'hr' && path.startsWith('/hr')) return true;
    if (role === 'patient' && path.startsWith('/patient')) return true;
    if (role === 'finance' && path.startsWith('/finance')) return true;
    if (role === 'emergency' && path.startsWith('/emergency')) return true;

    return false;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
