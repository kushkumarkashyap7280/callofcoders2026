'use client'


import type { Metadata } from "next";
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { useAuth } from "@/components/auth/AuthProvider"
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const auth = useAuth()
  const router = useRouter()

  // Protect admin routes
  useEffect(() => {
    if (!auth?.authState.loading) {
      // If not authenticated or not admin, redirect to home
      if (!auth?.authState.isAuthenticated || !auth?.authState.isAdmin) {
        router.push('/')
      }
    }
  }, [auth?.authState.loading, auth?.authState.isAuthenticated, auth?.authState.isAdmin, router])

  // Show loading while checking auth
  if (auth?.authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Don't render if not admin
  if (!auth?.authState.isAuthenticated || !auth?.authState.isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">

      {/* Sidebar Drawer */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="w-full">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </div>

      {/* Floating Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 hover:scale-110 active:scale-95"
      >
        <Menu className="w-6 h-6" />
      </button>
    </div>
  );
}
