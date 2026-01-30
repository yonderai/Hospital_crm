import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // DEBUG: Explicit bypass for queue debugging
    if (pathname === "/api/frontdesk/queue") {
        console.log("Middleware: Debug Bypass for /api/frontdesk/queue");
        // Add debug header to confirm this middleware version is active
        const res = NextResponse.next();
        res.headers.set('X-Middleware-Debug-Bypass', 'true');
        return res;
    }

    const token = await getToken({ req });
    const isAuth = !!token;

    // Public Paths
    if (pathname.startsWith("/api")) {
        console.log(`Middleware: API request to ${pathname}, method: ${req.method}`);
    }

    // Public Paths whitelist
    const publicPaths = ["/register", "/api/public"];
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next();
    }

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/favicon.ico") ||
        pathname === "/login" ||
        pathname === "/access-denied"
    ) {
        if (isAuth && pathname === "/login") {
            const dashboardUrl = getDashboardUrl(token.role as string);
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
        if (pathname.startsWith("/api")) {
            return NextResponse.json({
                error: "Unauthorized",
                debug_reason: "Middleware blocked request",
                path: pathname
            }, { status: 401 });
        }
        console.log(`[Middleware] No token found for ${pathname}. Redirecting to /login`);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // RBAC Check
    const role = token?.role as string;
    if (!isAccessAllowed(role, pathname)) {
        console.log(`[Middleware] Access DENIED for role: ${role} on path: ${pathname}`);
        return NextResponse.redirect(new URL("/access-denied", req.url));
    }

    console.log(`[Middleware] Access ALLOWED for role: ${role} on path: ${pathname}`);

    return NextResponse.next();
}

function getDashboardUrl(role: string) {
    switch (role) {
        case 'doctor': return '/doctor/dashboard';
        case 'nurse': return '/nurse/dashboard';
        case 'admin': return '/admin/dashboard';
        case 'frontdesk': return '/frontdesk/dashboard';
        case 'labtech':
        case 'lab': return '/lab/dashboard';
        case 'pathology': return '/pathology/overview';
        case 'billing': return '/billing/dashboard';
        case 'pharmacist':
        case 'pharmacy': return '/pharmacy/overview';
        case 'hr': return '/hr/dashboard';
        case 'patient': return '/patient/dashboard';
        case 'finance': return '/finance/dashboard';
        case 'emergency': return '/emergency/dashboard';
        case 'maintenance': return '/maintenance/dashboard';
        case 'backoffice': return '/backoffice/dashboard';
        default: return '/login';
    }
}

function isAccessAllowed(role: string, path: string) {
    if (path.startsWith("/api")) return true;

    if (role === 'doctor' && path.startsWith('/doctor')) return true;
    if (role === 'nurse' && path.startsWith('/nurse')) return true;
    if (role === 'admin' && path.startsWith('/admin')) return true;
    if (role === 'frontdesk' && path.startsWith('/frontdesk')) return true;
    if ((role === 'labtech' || role === 'lab') && path.startsWith('/lab')) return true;
    if (role === 'pathology' && path.startsWith('/pathology')) return true;
    if (role === 'billing' && path.startsWith('/billing')) return true;
    if ((role === 'pharmacist' || role === 'pharmacy') && path.startsWith('/pharmacy')) return true;
    if (role === 'hr' && path.startsWith('/hr')) return true;
    if (role === 'patient' && path.startsWith('/patient')) return true;
    if (role === 'finance' && path.startsWith('/finance')) return true;
    if (role === 'emergency' && path.startsWith('/emergency')) return true;
    if (role === 'maintenance' && path.startsWith('/maintenance')) return true;
    if (role === 'backoffice' && path.startsWith('/backoffice')) return true;

    return false;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
