'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Code2, LogOut, User } from 'lucide-react'
import { useAuth } from './AuthProvider'

export default function Navbar() {
  const router = useRouter()
  const authContext = useAuth()
  
  if (!authContext) {
    return null
  }

  const { authState, setAuthState } = authContext
  const { isAuthenticated, isAdmin, user } = authState

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setAuthState({
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isAdmin: false,
      })
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              CallOfCoders
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/compiler" 
              className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Compiler
            </Link>
            {isAuthenticated&& !isAdmin && (
              <Link 
                href="/profile" 
                className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Profile
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/admin" 
                className="text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.email && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <User className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {user.email.split('@')[0]}
                    </span>
                  </div>
                )}
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  size="sm"
                >
                  Login
                </Button>
                <Button
                  onClick={() => router.push('/signup')}
                  size="sm"
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
