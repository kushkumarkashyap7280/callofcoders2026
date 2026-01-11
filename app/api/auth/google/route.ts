import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { getJwtSecret, NODE_ENV } from "@/config/env";

interface GoogleJwtPayload {
  email: string;
  name?: string;
  picture?: string;
  sub: string;
}

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "No credential provided" },
        { status: 400 }
      );
    }

    // Decode the Google JWT token
    const decoded = jwtDecode<GoogleJwtPayload>(credential);
    const { email, name, picture } = decoded;

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in Google account" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create a new one
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          passwordHash: "", // Empty password for Google OAuth users
          isAdmin: false,
        },
      });
    }

    // Create JWT token for our application
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        name: user.name,
        isAdmin: user.isAdmin,
      },
      getJwtSecret(),
      { expiresIn: "7d" }
    );

    // Set cookie
    const response = NextResponse.json({
      message: "Google login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin,
      },
    });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { error: "Internal server error during Google authentication" },
      { status: 500 }
    );
  }
}
