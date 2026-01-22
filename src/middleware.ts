import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default function middleware(req: any) {
    // Demo Mode: Allow all requests without authentication checks
    return NextResponse.next();
}

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
