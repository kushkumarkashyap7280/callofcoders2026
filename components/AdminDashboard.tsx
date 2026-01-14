'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminDashboard() {
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
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">Admin Dashboard</h1>
        <Button 
          onClick={handleLogout} 
          disabled={isLoggingOut}
          variant="outline"
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Total Users</h2>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1,234</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Active Sessions</h2>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">567</p>
        </div>
        
        <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold mb-2 text-zinc-700 dark:text-zinc-300">Revenue</h2>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">$12,345</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">Recent Activity</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-700 dark:text-zinc-300">New user registration</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">2 minutes ago</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-zinc-700 dark:text-zinc-300">Settings updated</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">15 minutes ago</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-700 dark:text-zinc-300">Database backup completed</span>
            <span className="text-sm text-zinc-500 dark:text-zinc-400">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
