'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function UserProfile() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">User Profile</h1>
          <Button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
            variant="outline"
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg">
          <p className="text-zinc-700 dark:text-zinc-300">Welcome to your profile page</p>
        </div>
      </div>
    </div>
  )
}
