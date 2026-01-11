import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { getJwtSecret } from '@/config/env'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return NextResponse.json(
        { success: false, isAuthenticated: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    try {
      // Verify token
      const decoded = jwt.verify(token.value, getJwtSecret()) as {
        email: string
        id: string
        name: string | null
        isAdmin: boolean
      }

      return NextResponse.json({
        success: true,
        isAuthenticated: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          name: decoded.name,
          isAdmin: decoded.isAdmin
        }
      })
    } catch (jwtError) {
      // Token is invalid or expired
      return NextResponse.json(
        { success: false, isAuthenticated: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Error in verify:', error)
    return NextResponse.json(
      { success: false, isAuthenticated: false, message: 'An error occurred' },
      { status: 500 }
    )
  }
}
