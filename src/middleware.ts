import { NextRequest, NextResponse } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
  '/auth/admin',
  '/api/public',
];

// Check if the path is public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => path.startsWith(publicPath));
};

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const pathname = request.nextUrl.pathname;

  // Skip auth check for public paths
  if (isPublicPath(pathname)) {
    console.log('Public path, skipping auth check:', pathname);
    return NextResponse.next();
  }

  // For API routes, let the route handlers handle authentication
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin/')) {
    return NextResponse.next();
  }

  // For admin UI routes, check if user has an auth cookie
  const authCookie = request.cookies.get('auth_token');

  // If no auth cookie, redirect to login page
  if (!authCookie?.value) {
    console.log('No auth token found, redirecting to login page');
    const url = new URL('/auth/admin', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Let the request proceed
  return NextResponse.next();
}

// Only run the middleware on admin paths
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}; 