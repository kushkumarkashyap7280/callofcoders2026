import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes
const protectedRoutes = ['/admin'];
const publicRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if accessing admin routes
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Get session/auth token from cookies (adjust based on your auth solution)
  const token = request.cookies.get('auth-token')?.value;
  const isAdmin = request.cookies.get('is-admin')?.value === 'true';

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && (!token || !isAdmin)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if authenticated user tries to access public routes
  if (isPublicRoute && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
