import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard - CallOfCoders | Analytics & Management",
  description: "Manage CallOfCoders platform analytics, user engagement, and platform settings.",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
