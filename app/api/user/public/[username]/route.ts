import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Decode the username parameter (in case it's URL encoded)
    const decodedUsername = decodeURIComponent(username);

    // Fetch only public user data - exclude sensitive fields
    const user = await prisma.user.findUnique({
      where: {
        username: decodedUsername,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profileImageUrl: true,
        metadata: true,
        createdAt: true,
        enrollments: {
          where: {
            isCompleted: true,
          },
          select: {
            courseId: true,
            enrolledAt: true,
            isCompleted: true,
            course: {
              select: {
                title: true,
                slug: true,
                imageUrl: true,
              },
            },
          },
        },
        // Exclude: passwordHash, googleId, isAdmin, cloudinaryImageId
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching public user data:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
