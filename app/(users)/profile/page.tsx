import type { Metadata } from "next";
import UserProfile from "@/components/UserProfile";

export const metadata: Metadata = {
  title: "My Profile - CallOfCoders | Developer Dashboard",
  description: "Manage your CallOfCoders profile, track your coding progress, and customize your developer experience.",
};

export default function ProfilePage() {
  return <UserProfile />;
}
