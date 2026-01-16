import { redirect } from "next/navigation";
import { Metadata } from "next";
import ProfileContent from "@/components/ProfileContent";
import PublicProfileView from "@/components/PublicProfileView";
import { ProfilePageClient } from "@/components/ProfilePageClient";

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

// Check if user is logged in by calling verify API
async function checkAuth() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify`, {
      cache: 'no-store',
      credentials: 'include',
    });
    
    const data = await response.json();
    
    if (data.success && data.isAuthenticated) {
      return {
        isAuthenticated: true,
        user: data.user,
        isAdmin: data.user?.isAdmin || false,
      };
    }
    
    return { isAuthenticated: false, user: null };
  } catch (error) {
    return { isAuthenticated: false, user: null };
  }
}

// Fetch public user data by username
async function fetchPublicUserData(username: string): Promise<PublicUser | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user/public/${encodeURIComponent(username)}`,
      { cache: 'no-store' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.user : null;
  } catch (error) {
    console.error("Error fetching public user data:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Check if user is authenticated using verify API
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
