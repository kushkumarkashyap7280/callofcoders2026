"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, Loader2 } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

export default function UserLoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        setLoading(false)
        return
      }

      // Redirect based on user role
      if (data.user.isAdmin) {
        window.location.href = '/admin'
      } else {
        window.location.href = `/${data.user.id}`
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="w-full max-w-md mx-auto relative">
      {/* Floating background elements */}
      <motion.div
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          y: [10, -10, 10],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "loop",
        }}
        className="absolute -bottom-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-linear-to-br from-blue-600 to-purple-600 shadow-lg shadow-blue-600/25"
          >
            <LogIn className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground">Sign in to continue your learning</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border/50 shadow-2xl shadow-black/10 dark:shadow-black/50"
        >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
            <motion.div
              animate={focusedField === 'email' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Mail className="w-4 h-4 text-primary" />
            </motion.div>
            Email
          </Label>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
            />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
              <motion.div
                animate={focusedField === 'password' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Lock className="w-4 h-4 text-primary" />
              </motion.div>
              Password
            </Label>
            <motion.a
              href="/forgot-password"
              whileHover={{ scale: 1.05 }}
              className="text-xs text-primary hover:text-purple-600 transition-colors font-medium"
            >
              Forgot password?
            </motion.a>
          </div>
          <motion.div
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 pr-12"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={showPassword ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="pt-2"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 group bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              <span className="flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  </>
                )}
              </span>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center text-sm"
        >
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary hover:text-purple-600 transition-colors font-medium hover:underline">
              Sign up
            </a>
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="relative"
        >
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </motion.div>

        {/* Google Login Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <GoogleLoginButton />
        </motion.div>
      </motion.form>
      </motion.div>
    </div>
  )
}
