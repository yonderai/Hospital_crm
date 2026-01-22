import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;

        // Check if the user's role matches the dashboard path
        // e.g., /doctor/dashboard requires role 'doctor'
        const roleMatch = path.match(/^\/([a-z-]+)\/dashboard/);
        if (roleMatch) {
            const dashboardRole = roleMatch[1];
            if (token?.role !== dashboardRole) {
                return NextResponse.redirect(new URL(`/login/${dashboardRole}`, req.url));
            }
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - login (login pages)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|login|$).*)",
    ],
};
