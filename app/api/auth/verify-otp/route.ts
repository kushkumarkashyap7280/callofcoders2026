import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { $Enums } from '@/app/generated/prisma/client'

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
    const { email, otpCode } = await request.json()

    if (!email || !otpCode) {
      return NextResponse.json(
        { success: false, message: 'Email and OTP code are required' },
        { status: 400 }
      )
    }

    // Clean up expired OTPs
    await cleanupExpiredOtps()

    // Find OTP record
    const otpRecord = await prisma.otp.findUnique({
      where: { email }
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    // Check if OTP expired (5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    if (otpRecord.createdAt < fiveMinutesAgo) {
      // Delete expired OTP
      await prisma.otp.delete({
        where: { email }
      })
      
      return NextResponse.json(
        { success: false, message: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if already verified
    if (otpRecord.status === $Enums.OtpStatus.VERIFIED) {
      return NextResponse.json(
        { success: false, message: 'This OTP has already been used' },
        { status: 400 }
      )
    }

    // Verify OTP code
    if (otpRecord.otpCode !== otpCode) {
      return NextResponse.json(
        { success: false, message: 'Invalid OTP code' },
        { status: 400 }
      )
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { email },
      data: {
        status: $Enums.OtpStatus.VERIFIED
      }
    })

    // Delete OTP session (clear attempts)
    await prisma.otpSession.deleteMany({
      where: { email }
    })

    // Return stage 1 (verified, fill other details)
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      stage: 1
    })

  } catch (error) {
    console.error('Error in verify-otp:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
