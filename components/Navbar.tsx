'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { Code2, LogOut, User, Menu, X, Sparkles } from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const router = useRouter()
  const authContext = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
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

  const navLinks = [
    { href: '/', label: 'Home', show: true },
    { href: '/about', label: 'About', show: true },
    { href: '/compiler', label: 'Compiler', show: true },
    { href: '/profile', label: 'Profile', show: isAuthenticated && !isAdmin },
    { href: '/admin', label: 'Admin', show: isAdmin },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-zinc-900/60"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500/50 to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-600 rounded-xl blur-md opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Code2 className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                CallOfCoders
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 -mt-1">by Kush Kumar</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => link.show && (
              <Link 
                key={link.href}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
              >
                <span className="relative z-10">{link.label}</span>
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle with animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThemeToggle />
            </motion.div>
            
            {/* Desktop Auth Actions */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  {user?.email && (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-700 rounded-full border border-zinc-200 dark:border-zinc-600 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {user.email.split('@')[0]}
                      </span>
                      {isAdmin && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-linear-to-r from-amber-500 to-orange-500 text-white rounded-full">
                          ADMIN
                        </span>
                      )}
                    </motion.div>
                  )}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="gap-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push('/login')}
                      variant="outline"
                      size="sm"
                      className="border-zinc-300 dark:border-zinc-600"
                    >
                      Login
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => router.push('/signup')}
                      size="sm"
                      className="relative overflow-hidden bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      Sign Up
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              ) : (
                <Menu className="w-6 h-6 text-zinc-700 dark:text-zinc-300" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              {/* Mobile Nav Links */}
              {navLinks.map((link) => link.show && (
                <motion.div
                  key={link.href}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-linear-to-r hover:from-blue-500/10 hover:to-purple-500/10 dark:hover:from-blue-500/20 dark:hover:to-purple-500/20 font-medium transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile User Info */}
              {isAuthenticated && user?.email && (
                <div className="px-4 py-3 bg-linear-to-r from-zinc-100 to-zinc-50 dark:from-zinc-800 dark:to-zinc-700 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {user.email.split('@')[0]}
                      </p>
                      {isAdmin && (
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                          Administrator
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Auth Buttons */}
              <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                {isAuthenticated ? (
                  <Button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full gap-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        router.push('/login')
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      onClick={() => {
                        router.push('/signup')
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
