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

      // Successful login
      window.location.reload();
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
            className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-purple-500/40 relative"
          >
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0"
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <LogIn className="w-9 h-9 text-white relative z-10" />
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">Sign in to continue your coding journey</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-3xl border border-white/10 dark:border-zinc-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20"
        >
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-red-500/10 dark:bg-red-500/20 border border-red-500/50 text-red-600 dark:text-red-400 text-sm flex items-center gap-2"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-2"
        >
          <Label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            <motion.div
              animate={focusedField === 'email' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </motion.div>
            Email Address
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
              className="h-12 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all rounded-xl"
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
            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              <motion.div
                animate={focusedField === 'password' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </motion.div>
              Password
            </Label>
            <motion.a
              href="/forgot-password"
              whileHover={{ scale: 1.05 }}
              className="text-xs text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-semibold"
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
              className="h-12 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-purple-500 dark:focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all rounded-xl pr-12"
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/20"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={showPassword ? 'visible' : 'hidden'}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.2 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              className="w-full h-13 group relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-xl shadow-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base rounded-xl"
              size="lg"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <span className="flex items-center gap-2 relative z-10">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-5 h-5" />
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
          <p className="text-zinc-600 dark:text-zinc-400">
            Don't have an account?{' '}
            <a href="/signup" className="text-purple-600 dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors font-semibold hover:underline">
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
            <div className="w-full border-t border-zinc-200 dark:border-zinc-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-3 text-zinc-500 dark:text-zinc-400 font-medium">Or continue with</span>
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
