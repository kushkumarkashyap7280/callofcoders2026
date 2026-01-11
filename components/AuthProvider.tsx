"use client"

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import AuthNotification from './AuthNotification'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const [showNotification, setShowNotification] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return

    // Redirect authenticated users away from login/signup pages
    if (isAuthenticated && user) {
      if (pathname === '/login' || pathname === '/signup') {
        // Redirect based on role
        if (user.isAdmin) {
          router.push('/admin')
        } else {
          router.push(`/${user.id}`)
        }
        return
      }
      
      // Show notification on other pages
      setShowNotification(true)
    }
  }, [isAuthenticated, user, pathname, router, isLoading])

  return (
    <>
      {children}
      {showNotification && user && !pathname.includes('/login') && !pathname.includes('/signup') && (
        <AuthNotification 
          user={user} 
          onClose={() => setShowNotification(false)} 
        />
      )}
    </>
  )
}
