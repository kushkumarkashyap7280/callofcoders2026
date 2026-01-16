import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as jwt from "jsonwebtoken";
import { getJwtSecret } from "@/config/env";
import ProfileSettings from "@/components/ProfileSettings";

interface SettingsPageProps {
  params: Promise<{
    username: string;
  }>;
}

async function getAuthenticatedUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token.value, getJwtSecret()) as {
      email: string;
      id: string;
      name: string | null;
      isAdmin: boolean;
    };

    return decoded;
  } catch (error) {
    return null;
  }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);

  // Get authenticated user
  const authenticatedUser = await getAuthenticatedUser();

  // Fetch user by username to verify ownership
  // Note: You'll need to add username to JWT or fetch from DB
  // For now, redirect if not authenticated
  if (!authenticatedUser) {
    redirect("/login");
  }

  return <ProfileSettings />;
}
