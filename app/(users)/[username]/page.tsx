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
    console.log('  [checkAuth] Calling verify API...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/verify`, {
      cache: 'no-store',
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log('  [checkAuth] Verify API response:', data);
    
    if (data.success && data.isAuthenticated) {
      return {
        isAuthenticated: true,
        user: data.user,
        isAdmin: data.user?.isAdmin || false,
      };
    }
    
    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('  [checkAuth] Error:', error);
    return { isAuthenticated: false, user: null };
  }
}

// Fetch public user data by username
async function fetchPublicUserData(username: string): Promise<PublicUser | null> {
  try {
    console.log('  [fetchPublicUserData] Fetching data for:', username);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/user/public/${encodeURIComponent(username)}`,
      { cache: 'no-store' }
    );
    
    console.log('  [fetchPublicUserData] Response status:', response.status, response.ok);
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    console.log('  [fetchPublicUserData] API response:', data);
    return data.success ? data.user : null;
  } catch (error) {
    console.error("  [fetchPublicUserData] Error:", error);
    return null;
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  
  console.log('=== ProfilePage Start ===');
  console.log('1. Requested username:', decodedUsername);

  // Check if user is authenticated using verify API
  const { isAuthenticated, user } = await checkAuth();
  console.log('2. Auth check result:', { 
    isAuthenticated, 
    userEmail: user?.email, 
    userName: user?.name,
    userUsername: user?.username,
    userIsAdmin: user?.isAdmin 
  });

  // Check if viewing own profile (compare usernames)
  const isOwnProfile = isAuthenticated && user?.username === decodedUsername;
  console.log('3. Is own profile?', isOwnProfile, '(comparing:', user?.username, 'vs', decodedUsername, ')');

  // If viewing own profile, show full dashboard
  if (isOwnProfile) {
    console.log('4. Returning ProfileContent (own profile)');
    return <ProfileContent />;
  }

  // Viewing someone else's profile (or not logged in)
  // Fetch public profile data
  console.log('5. Fetching public user data for:', decodedUsername);
  const publicUser = await fetchPublicUserData(decodedUsername);
  console.log('6. Public user fetched:', publicUser ? {
    id: publicUser.id,
    username: publicUser.username,
    isAdmin: publicUser.isAdmin,
    email: publicUser.email
  } : 'null (not found)');

  if (!publicUser) {
    // User not found
    console.log('7. User not found - showing error');
    return <ProfilePageClient error="User not found" />;
  }

  // Check if the profile being viewed is an admin
  console.log('8. Checking if profile is admin:', publicUser.isAdmin);
  if (publicUser.isAdmin === true) {
    // Don't allow viewing admin profiles
    console.log('9. Admin profile detected - blocking access');
    return <ProfilePageClient error="This profile is not available" />;
  }

  // Show public profile view
  console.log('10. Showing public profile view');
  return <PublicProfileView user={publicUser} />;
}
