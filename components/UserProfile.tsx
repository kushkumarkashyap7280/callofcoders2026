'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { Button } from '@/components/ui/button'

export default function UserProfile() {
  const router = useRouter()
  const auth = useAuth()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  useEffect(() => {
    if (!auth?.authState.loading && !auth?.authState.isAuthenticated) {
      router.push('/login')
    }
  }, [auth?.authState.loading, auth?.authState.isAuthenticated, router])

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

  if (auth?.authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!auth?.authState.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 p-8">
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
