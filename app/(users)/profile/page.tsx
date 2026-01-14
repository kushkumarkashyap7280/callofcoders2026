'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function page() {
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <Button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          variant="outline"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
      
      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow">
        <p>user profile page</p>
      </div>
    </div>
  )
}

export default page
