import { redirect } from "next/navigation";
import { Metadata } from "next";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import ProfileContent from "@/components/profile/ProfileContent";
import PublicProfileView from "@/components/profile/PublicProfileView";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import prisma from "@/lib/prisma";
import { getAccessTokenSecret } from "@/config/env";

interface ProfilePageProps {
  params: Promise<{
    username: string;
  }>;
}

// Metadata for SEO
export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  
  // TODO: Fetch user data for dynamic metadata
  return {
    title: `${username} - Profile`,
    description: `View ${username}'s profile`,
  };
}

interface PublicUser {
  id: string;
  email: string;
  username: string | null;
  name: string | null;
  profileImageUrl: string | null;
  metadata: any;
  isAdmin?: boolean; // May be included for admin check
  createdAt: Date;
  enrollments: Array<{
    courseId: string;
    enrolledAt: Date;
    isCompleted: boolean;
    course: {
      title: string;
      slug: string;
      imageUrl: string | null;
    };
  }>;
}

// Check if user is logged in by verifying JWT token
async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    
    if (!token) {
      return { isAuthenticated: false, user: null };
    }

    const decoded = jwt.verify(token, getAccessTokenSecret()) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return { isAuthenticated: false, user: null };
    }

    return {
      isAuthenticated: true,
      user,
    };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

// Fetch public user data by username
async function fetchPublicUserData(username: string): Promise<PublicUser | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        name: true,
        profileImageUrl: true,
        metadata: true,
        isAdmin: true,
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
      },
    });

    return user;
  } catch (error) {
    console.error("Error fetching public user data:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Check if user is authenticated
  const { isAuthenticated, user } = await checkAuth();

  // Check if viewing own profile (compare usernames)
  const isOwnProfile = isAuthenticated && user?.username === decodedUsername;

  // If viewing own profile, show full dashboard
  if (isOwnProfile) {
    return <ProfileContent />;
  }

  // Viewing someone else's profile (or not logged in)
  // Fetch public profile data
  const publicUser = await fetchPublicUserData(decodedUsername);

  if (!publicUser) {
    // User not found
    return <ProfilePageClient error="User not found" />;
  }

  // Check if the profile being viewed is an admin
  if (publicUser.isAdmin === true) {
    // Don't allow viewing admin profiles
    return <ProfilePageClient error="This profile is not available" />;
  }

  // Show public profile view
  return <PublicProfileView user={publicUser} />;
}
