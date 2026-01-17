'use client'

import React, { useState } from 'react'
import ProfileSidebar from '@/components/profile/ProfileSidebar'
import { Menu } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'

export default function UsernameProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const authContext = useAuth()
  const username = authContext?.authState.user?.username

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar Drawer */}
      <ProfileSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        username={username}
      />
      
      {/* Main Content */}
      <div className="w-full">
        {/* Content Area */}
        <div className="max-w-5xl mx-auto p-8">
          {children}
        </div>
      </div>

      {/* Floating Menu Button - Only show for authenticated user viewing their own profile */}
      {username && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 hover:scale-110 active:scale-95"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}
