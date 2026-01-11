import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateOtpCode, sendOtp } from '@/lib/resend'
import { $Enums } from '@/app/generated/prisma/client'
import { NODE_ENV } from '@/config/env'

// Clean up expired OTP sessions (>15 min)
async function cleanupExpiredSessions() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
  await prisma.otpSession.deleteMany({
    where: {
      createdAt: {
        lt: fifteenMinutesAgo
      }
    }
  })
}

// Clean up expired OTPs (>5 min)
async function cleanupExpiredOtps() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  await prisma.otp.deleteMany({
    where: {
      createdAt: {
        lt: fiveMinutesAgo
      }
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      )
    }

    // Clean up expired sessions and OTPs
    await cleanupExpiredSessions()
    await cleanupExpiredOtps()

    // Check OTP session for attempt limits
    const session = await prisma.otpSession.findUnique({
      where: { email }
    })

    if (session && session.attempts >= 3) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Too many attempts. Please try again after 15 minutes.' 
        },
        { status: 429 }
      )
    }

    // Delete existing OTP if any
    await prisma.otp.deleteMany({
      where: { email }
    })

    // Generate new OTP
    const otpCode = generateOtpCode()

    // Create new OTP record
    await prisma.otp.create({
      data: {
        email,
        otpCode,
        otpType: $Enums.OtpType.SIGNUP,
        status: $Enums.OtpStatus.SENT
      }
    })

    // Create or update OTP session
    await prisma.otpSession.upsert({
      where: { email },
      update: {
        attempts: {
          increment: 1
        }
      },
      create: {
        email,
        attempts: 1
      }
    })

    // Send OTP email
    const emailResult = await sendOtp(email, otpCode, 'signup')

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: emailResult.message },
        { status: 500 }
      )
    }

    // Return stage 0 (need to verify OTP)
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      stage: 0,
      // Only in development
      ...(NODE_ENV === 'development' && { otpCode })
    })

  } catch (error) {
    console.error('Error in request-otp:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
