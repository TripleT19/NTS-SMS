import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require an authenticated session.
// Adjust this list as you add pages in Parts 2+.
const PROTECTED_PREFIXES = [
  '/dashboard',
  '/admin',
  '/students',
  '/grades',
  '/report-cards',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Laravel Sanctum stores the session in this cookie.
  // If it is missing, send the user to the login page.
  const sessionCookie =
    request.cookies.get('laravel_session') ??
    request.cookies.get('XSRF-TOKEN');

  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Optional: limit the proxy to the routes it actually needs to inspect.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/students/:path*',
    '/grades/:path*',
    '/report-cards/:path*',
  ],
};