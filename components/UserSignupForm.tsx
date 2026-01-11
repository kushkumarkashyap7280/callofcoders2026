"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Shield, Check, Loader2 } from 'lucide-react'
import GoogleLoginButton from '@/components/GoogleLoginButton'

type Stage = 'email' | 'verify' | 'complete'

export default function UserSignupForm() {
  const [stage, setStage] = useState<Stage>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    verificationCode: '',
    name: '',
    password: '',
    confirmPassword: ''
  })

  // Countdown timer for OTP expiration (5 minutes)
  useEffect(() => {
    if (stage === 'verify' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [stage, countdown])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to send OTP')
        setLoading(false)
        return
      }

      // Set 5-minute countdown
      setCountdown(300)
      setStage('verify')
      
      // Log OTP in development
      if (data.otpCode) {
        console.log('OTP Code (dev only):', data.otpCode)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otpCode: formData.verificationCode 
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid OTP')
        setLoading(false)
        return
      }

      setStage('complete')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create account')
        setLoading(false)
        return
      }

      // Redirect to login or dashboard
      window.location.href = '/login?signup=success'
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleResendOtp = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to resend OTP')
        setLoading(false)
        return
      }

      setCountdown(300)
      
      if (data.otpCode) {
        console.log('OTP Code (dev only):', data.otpCode)
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStageNumber = () => {
    switch (stage) {
      case 'email': return 1
      case 'verify': return 2
      case 'complete': return 3
      default: return 1
    }
  }

  const getStageTitle = () => {
    switch (stage) {
      case 'email': return 'Enter Your Email'
      case 'verify': return 'Verify Your Email'
      case 'complete': return 'Complete Your Profile'
      default: return 'Create Account'
    }
  }

  const getStageDescription = () => {
    switch (stage) {
      case 'email': return 'Start your journey with us'
      case 'verify': return `We sent a code to ${formData.email}`
      case 'complete': return 'Just a few more details'
      default: return ''
    }
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
          className="absolute -top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"
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
          className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"
        />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-2 mb-6"
        >
          {[1, 2, 3].map((step) => (
            <motion.div
              key={step}
              className={`h-1.5 rounded-full transition-all ${
                step === getStageNumber() 
                  ? 'w-12 bg-linear-to-r from-primary to-purple-600' 
                  : step < getStageNumber()
                  ? 'w-8 bg-primary/50'
                  : 'w-8 bg-muted'
              }`}
              animate={{
                scale: step === getStageNumber() ? 1.1 : 1
              }}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-linear-to-br from-primary to-purple-600 shadow-lg shadow-primary/25"
          >
            {stage === 'verify' ? (
              <Mail className="w-8 h-8 text-white" />
            ) : stage === 'complete' ? (
              <Check className="w-8 h-8 text-white" />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </motion.div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-bold bg-linear-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {getStageTitle()}
              </h1>
              <p className="text-muted-foreground">{getStageDescription()}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="bg-card/50 backdrop-blur-xl p-8 rounded-2xl border border-border/50 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden">
          <AnimatePresence mode="wait" custom={getStageNumber()}>
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Stage 1: Email */}
            {stage === 'email' && (
              <motion.form
                key="email"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleEmailSubmit}
                className="space-y-5"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'email' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Mail className="w-4 h-4 text-primary" />
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
                      autoFocus
                      className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                    />
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pt-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 group bg-linear-to-r from-primary via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Continue
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
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center text-sm"
                >
                  <p className="text-muted-foreground">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary hover:text-purple-600 transition-colors font-medium hover:underline">
                      Sign in
                    </a>
                  </p>
                </motion.div>

                {/* Divider */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
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
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <GoogleLoginButton />
                </motion.div>
              </motion.form>
            )}

            {/* Stage 2: Verify */}
            {stage === 'verify' && (
              <motion.form
                key="verify"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleVerifySubmit}
                className="space-y-5"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="verificationCode" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'verificationCode' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Shield className="w-4 h-4 text-primary" />
                    </motion.div>
                    Verification Code
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="verificationCode"
                      name="verificationCode"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={formData.verificationCode}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('verificationCode')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoFocus
                      maxLength={6}
                      className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 text-center text-2xl tracking-widest"
                    />
                  </motion.div>
                  {countdown > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`text-xs text-center ${countdown < 60 ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                      Code expires in {formatTime(countdown)}
                    </motion.p>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-center text-sm"
                >
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading || countdown > 240}
                    className="text-primary hover:text-purple-600 transition-colors font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : countdown > 240 ? `Resend in ${formatTime(countdown - 240)}` : 'Resend code'}
                  </button>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="pt-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading || countdown === 0}
                      className="w-full h-12 group bg-linear-to-r from-primary via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Verifying...
                          </>
                        ) : countdown === 0 ? (
                          'Code Expired'
                        ) : (
                          <>
                            Verify Email
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
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center text-sm"
                >
                  <button
                    type="button"
                    onClick={() => setStage('email')}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Change email
                  </button>
                </motion.div>
              </motion.form>
            )}

            {/* Stage 3: Complete Profile */}
            {stage === 'complete' && (
              <motion.form
                key="complete"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleCompleteSubmit}
                className="space-y-5"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'name' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-4 h-4 text-primary" />
                    </motion.div>
                    Full Name
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      autoFocus
                      className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                    />
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'password' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Lock className="w-4 h-4 text-primary" />
                    </motion.div>
                    Password
                  </Label>
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
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'confirmPassword' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Shield className="w-4 h-4 text-primary" />
                    </motion.div>
                    Confirm Password
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    className="relative"
                  >
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('confirmPassword')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 pr-12"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={showConfirmPassword ? 'visible' : 'hidden'}
                          initial={{ opacity: 0, rotate: -180 }}
                          animate={{ opacity: 1, rotate: 0 }}
                          exit={{ opacity: 0, rotate: 180 }}
                          transition={{ duration: 0.2 }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </motion.div>
                      </AnimatePresence>
                    </motion.button>
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="pt-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 group bg-linear-to-r from-primary via-purple-600 to-pink-600 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      size="lg"
                    >
                      <span className="flex items-center gap-2">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <motion.div
                              animate={{ x: [0, 5, 0] }}
                              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            >
                              <Check className="w-4 h-4" />
                            </motion.div>
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
