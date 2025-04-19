import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/admin/:path*', 
    '/api/admin/:path*', 
  ],
};

export async function middleware(request: NextRequest) {
  // Skip auth check for the login page
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // For API routes, let the route handlers handle authentication
  if (pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // For admin UI routes, check if user has an auth cookie
  const authCookie = request.cookies.get('auth_token');

  // If no auth cookie, redirect to login page
  if (!authCookie?.value) {
    const url = new URL('/admin/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Let the request proceed
  return NextResponse.next();
} 