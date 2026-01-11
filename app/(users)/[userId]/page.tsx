'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, CheckCircle2, LogOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserData {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
  createdAt: string
}

export default function UserDashboard() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        const data = await response.json()

        if (!response.ok || !data.isAuthenticated) {
          router.push('/login')
          return
        }

        // Check if the logged-in user matches the route param
        if (data.user.id !== params.userId) {
          router.push(`/${data.user.id}`)
          return
        }

        // Fetch full user data
        setUser({
          ...data.user,
          createdAt: new Date().toISOString() // You can add this to the API if needed
        })
      } catch (err) {
        setError('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [params.userId, router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      // Use window.location to force full page reload and clear auth cache
      window.location.href = '/login'
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'User not found'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 mb-6 border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-linear-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
              >
                <User className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {user.name || 'User'}
                </h1>
                <p className="text-muted-foreground">Student Dashboard</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-semibold">{user.name || 'Not set'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="font-semibold text-green-600 dark:text-green-400">Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-semibold text-xs">{user.id}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-6 bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
          <p className="opacity-90">
            Start exploring courses and continue your learning journey.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

