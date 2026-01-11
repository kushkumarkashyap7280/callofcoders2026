"use client"

import { useEffect, useState } from 'react'

interface User {
  id: string
  email: string
  name: string | null
  isAdmin: boolean
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success && data.isAuthenticated) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: data.user
        })
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      })

      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return {
    ...authState,
    logout,
    refetch: checkAuth
  }
}
