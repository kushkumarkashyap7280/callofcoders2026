'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import ProfileContent from '@/components/profile/ProfileContent'

export default function UserProfile() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth?.authState.loading && !auth?.authState.isAuthenticated) {
      router.push('/login')
    }
  }, [auth?.authState.loading, auth?.authState.isAuthenticated, router])

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

  return <ProfileContent />
}
