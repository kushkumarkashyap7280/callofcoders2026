import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { getJwtSecret } from "@/config/env";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token.value, getJwtSecret()) as {
      email: string;
      id: string;
    };

    // Get the metadata from request body
    const body = await request.json();
    const { bio, location, website, twitter, github, linkedin } = body;

    // Update user metadata
    const user = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        metadata: {
          bio: bio || undefined,
          location: location || undefined,
          website: website || undefined,
          twitter: twitter || undefined,
          github: github || undefined,
          linkedin: linkedin || undefined,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        metadata: true,
        profileImageUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error updating metadata:", error);
    return NextResponse.json(
      { error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
