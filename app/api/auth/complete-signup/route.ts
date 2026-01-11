import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { $Enums } from '@/app/generated/prisma/client'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, name, password, confirmPassword } = await request.json()

    // Validation
    if (!email || !name || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if OTP was verified
    const otpRecord = await prisma.otp.findUnique({
      where: { email }
    })

    if (!otpRecord || otpRecord.status !== $Enums.OtpStatus.VERIFIED) {
      return NextResponse.json(
        { success: false, message: 'Email not verified. Please verify your email first.' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    })

    // Delete OTP record after successful signup
    await prisma.otp.delete({
      where: { email }
    })

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user
    })

  } catch (error) {
    console.error('Error in complete-signup:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
