import ProfileSettings from "@/components/ProfileSettings";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Settings - CallOfCoders | Account Settings",
  description: "Manage your account settings, preferences, and privacy options.",
};

export default function SettingsPage() {
  return <ProfileSettings/>;
}
