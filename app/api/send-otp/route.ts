import { NextRequest, NextResponse } from 'next/server'
import { generateOtpCode, sendOtp } from '@/lib/resend'
import { NODE_ENV } from '@/config/env'

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate OTP code
    const otpCode = generateOtpCode()

    // Send OTP email
    const result = await sendOtp(email, otpCode, type || 'signup')

    // In development, also return the OTP code for testing
    if (NODE_ENV === 'development') {
      return NextResponse.json({
        ...result,
        otpCode // Only in dev mode
      })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in send-otp API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
