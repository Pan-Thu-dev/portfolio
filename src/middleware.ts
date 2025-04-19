import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // If it's the login path, allow access
  if (path === '/admin/login') {
    return NextResponse.next();
  }
  
  // Check if the path is an admin path
  const isAdminPath = path.startsWith('/admin') || path.startsWith('/api/admin');
  
  // If it's not an admin path, just continue
  if (!isAdminPath) {
    return NextResponse.next();
  }
  
  // For admin paths, check for session token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // If no token and trying to access admin page, redirect to login
  if (!token && isAdminPath) {
    const url = new URL('/admin/login', request.url);
    // Add the original path as a callback parameter
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    '/admin/:path*',  // Match all admin routes
    '/api/admin/:path*', // Match all admin API routes
  ]
}; 