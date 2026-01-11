import { NextRequest, NextResponse } from 'next/server'
import { NODE_ENV } from '@/config/env'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })

  // Clear the auth-token cookie
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/'
  })

  return response
}
