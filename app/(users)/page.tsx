'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, X } from 'lucide-react'

export default function HomePage() {
  const router = useRouter()
  const [showNotification, setShowNotification] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify')
        const data = await response.json()

        if (data.isAuthenticated && data.user) {
          // Redirect based on role
          if (data.user.isAdmin) {
            router.push('/admin')
          } else {
            router.push(`/${data.user.id}`)
          }
        } else {
          // Not authenticated, wait 10 seconds then show notification
          setIsLoading(false)
          
          const showTimer = setTimeout(() => {
            setShowNotification(true)
            
            // Hide notification after 2 minutes (120000ms)
            const hideTimer = setTimeout(() => {
              setShowNotification(false)
            }, 120000)

            return () => clearTimeout(hideTimer)
          }, 10000)

          return () => clearTimeout(showTimer)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoading(false)
        
        const showTimer = setTimeout(() => {
          setShowNotification(true)
          
          const hideTimer = setTimeout(() => {
            setShowNotification(false)
          }, 120000)

          return () => clearTimeout(hideTimer)
        }, 10000)

        return () => clearTimeout(showTimer)
      }
    }

    checkAuth()
  }, [router])

  const handleLoginNow = () => {
    router.push('/login')
  }

  const handleClose = () => {
    setShowNotification(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {isLoading ? (
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      ) : (
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-linear-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome to Call of Coders
          </h1>
          <p className="text-muted-foreground">Your coding learning platform</p>
        </div>
      )}

      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="bg-linear-to-r from-orange-500 to-red-500 rounded-xl shadow-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <AlertCircle className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-lg">Authentication Required</h3>
                    <p className="text-sm opacity-90">Please log in to continue</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="hover:bg-white/20 rounded-lg p-1 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-4">
                <button
                  onClick={handleLoginNow}
                  className="w-full bg-white text-orange-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Login Now
                </button>
                <p className="text-xs text-center mt-3 opacity-75">
                  This message will disappear in 2 minutes
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}