import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, PUBLIC_ROUTES, PROTECTED_ROUTES, STORAGE_KEYS } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const accessToken = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value;
  
  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  
  // Check if route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  
  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !accessToken) {
    const url = new URL(ROUTES.LOGIN, request.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if trying to access login/register with valid token
  if ((pathname === ROUTES.LOGIN || pathname === ROUTES.REGISTER) && accessToken) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }
  
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
