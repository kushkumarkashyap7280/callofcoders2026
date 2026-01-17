import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { getJwtSecret } from '@/config/env'

interface JWTPayload {
  email: string
  id: string
  name: string | null
  isAdmin: boolean
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes - accessible to everyone
  // Note: Exact matches only, no '/' to avoid the "Open Door" bug
  const publicRoutes = [
    '/login',
    '/signup',
    '/about',
    '/courses',
    '/compiler',
    '/blogs',
    '/api/blogs',
    '/api/blogs/slug',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/auth/google',
    '/api/auth/request-otp',
    '/api/auth/verify-otp',
    '/api/auth/complete-signup',
    '/api/send-otp',
  ]

  // Admin-only routes
  const adminRoutes = ['/admin']

  // Check if the current path is public
  // For exact homepage match
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // Check other public routes with proper path matching
  const isPublicRoute = publicRoutes.some(route => {
    // Exact match or starts with route followed by a slash
    return pathname === route || pathname.startsWith(route + '/')
  })
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')

  // If no token, redirect to home/login
  if (!token) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  try {
    // Verify and decode the JWT token using jose (Edge Runtime compatible)
    const secret = new TextEncoder().encode(getJwtSecret())
    const { payload } = await jwtVerify(token.value, secret)
    const decoded = payload as unknown as JWTPayload

    // Check if trying to access admin routes
    const isAdminRoute = adminRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
    
    if (isAdminRoute && !decoded.isAdmin) {
      // Non-admin trying to access admin routes - redirect to home
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Allow access to other protected routes
    return NextResponse.next()

  } catch (error) {
    // Invalid or expired token - redirect to home/login
    console.error('Token verification failed:', error)
    const url = request.nextUrl.clone()
    url.pathname = '/'
    
    // Clear the invalid token
    const response = NextResponse.redirect(url)
    response.cookies.delete('auth-token')
    return response
  }
}

// Configure which routes should trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
