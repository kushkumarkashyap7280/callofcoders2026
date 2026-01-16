import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { getJwtSecret, NODE_ENV, NEXT_PUBLIC_GOOGLE_CLIENT_ID } from "@/config/env";
import { generateUniqueUsername } from "@/lib/username";

export async function POST(request: NextRequest) {
  try {
    const { credential } = await request.json();

    if (!credential) {
      return NextResponse.json(
        { error: "No credential provided" },
        { status: 400 }
      );
    }

    // Verify the Google JWT token signature
    const client = new OAuth2Client(NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 400 }
      );
    }
    
    const { email, name, picture, sub } = payload; // ⚠️ Get sub (Google ID)

    if (!email) {
      return NextResponse.json(
        { error: "Email not found in Google account" },
        { status: 400 }
      );
    }

    // Check if user exists by googleId OR email
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: sub },
          { email: email },
        ],
      },
    });

    // If user doesn't exist, create a new one with auto-generated username
    if (!user) {
      // Generate unique username from name
      const username = await generateUniqueUsername(name || email.split("@")[0]);
      
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          username, // Auto-generated unique username
          googleId: sub, // ⚠️ Store Google ID
          profileImageUrl: picture || null, // Store Google profile picture
          passwordHash: "", // Empty password for Google OAuth users
          isAdmin: false,
        },
      });
    } else if (!user.googleId) {
      // User exists with email but no googleId - link the Google account
      // Also generate username if they don't have one
      const updateData: any = { 
        googleId: sub,
        name: name || user.name, // Update name if not set
        profileImageUrl: picture || user.profileImageUrl, // Update profile image if not set
      };
      
      // If user doesn't have a username, generate one
      if (!user.username) {
        updateData.username = await generateUniqueUsername(name || user.name || email.split("@")[0]);
      }
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    } else {
      // User exists with googleId - update their profile data from Google
      const updateData: any = {
        name: name || user.name, // Update name from Google
        profileImageUrl: picture || user.profileImageUrl, // Update profile image from Google
      };
      
      // If user doesn't have a username, generate one
      if (!user.username) {
        updateData.username = await generateUniqueUsername(name || user.name || email.split("@")[0]);
      }
      
      user = await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      });
    }

    // Create JWT token for our application
    const token = jwt.sign(
      {
        email: user.email,
        id: user.id,
        name: user.name,
        username: user.username,
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
        username: user.username,
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
