"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, Shield, Check, Loader2 } from 'lucide-react'
import GoogleLoginButton from '@/components/auth/GoogleLoginButton'
import { toast } from 'sonner'

type Stage = 'email' | 'verify' | 'complete'

export default function UserSignupForm() {
  const router = useRouter()
  const auth = useAuth()
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
    username: '',
    password: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!auth?.authState.loading && auth?.authState.isAuthenticated) {
      // Use username from auth state
      if (auth.authState.user?.username) {
        router.push(`/${auth.authState.user.username}`);
      } else {
        router.push('/');
      }
    }
  }, [auth?.authState.loading, auth?.authState.isAuthenticated, auth?.authState.user?.username, router])

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
        toast.error(data.message || 'Failed to send OTP')
        setError(data.message || 'Failed to send OTP')
        setLoading(false)
        return
      }

      toast.success('OTP sent to your email!')
      // Set 5-minute countdown
      setCountdown(300)
      setStage('verify')
      
      // Log OTP in development
      if (data.otpCode) {
        console.log('OTP Code (dev only):', data.otpCode)
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.')
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
        toast.error(data.message || 'Invalid OTP')
        setError(data.message || 'Invalid OTP')
        setLoading(false)
        return
      }

      toast.success('Email verified! Complete your profile')
      setStage('complete')
    } catch (err) {
      toast.error('An error occurred. Please try again.')
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate username
    if (!formData.username || formData.username.length < 3) {
      toast.error('Username must be at least 3 characters')
      setError('Username must be at least 3 characters')
      setLoading(false)
      return
    }

    if (formData.username.length > 10) {
      toast.error('Username must be at most 10 characters')
      setError('Username must be at most 10 characters')
      setLoading(false)
      return
    }

    if (!/^[a-z0-9]+$/.test(formData.username)) {
      toast.error('Username can only contain lowercase letters and numbers')
      setError('Username can only contain lowercase letters and numbers')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
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
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Failed to create account')
        setError(data.message || 'Failed to create account')
        setLoading(false)
        return
      }

      toast.success('Account created successfully! Please login')
      // Redirect to login or dashboard
      router.push('/login?signup=success')
    } catch (err) {
      toast.error('An error occurred. Please try again.')
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
        toast.error(data.message || 'Failed to resend OTP')
        setError(data.message || 'Failed to resend OTP')
        setLoading(false)
        return
      }

      toast.success('OTP resent to your email!')
      setCountdown(300)
      
      if (data.otpCode) {
        console.log('OTP Code (dev only):', data.otpCode)
      }
    } catch (err) {
      toast.error('An error occurred. Please try again.')
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
        {/* Progress Indicator with Numbers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center items-center gap-3 mb-8"
        >
          {[1, 2, 3].map((step) => {
            const isActive = step === getStageNumber()
            const isCompleted = step < getStageNumber()
            
            return (
              <React.Fragment key={step}>
                <motion.div
                  className="flex flex-col items-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: step * 0.1 }}
                >
                  <motion.div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all ${
                      isActive 
                        ? 'bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-110' 
                        : isCompleted
                        ? 'bg-linear-to-r from-blue-500/80 to-purple-500/80 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'
                    }`}
                    animate={{
                      scale: isActive ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 2,
                      repeat: isActive ? Infinity : 0,
                      repeatType: "reverse"
                    }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      step
                    )}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50"
                        animate={{
                          scale: [1, 1.5],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>
                  <span className={`text-[10px] font-medium ${
                    isActive 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : isCompleted 
                      ? 'text-zinc-600 dark:text-zinc-400'
                      : 'text-zinc-400 dark:text-zinc-600'
                  }`}>
                    {step === 1 ? 'Email' : step === 2 ? 'Verify' : 'Complete'}
                  </span>
                </motion.div>
                {step < 3 && (
                  <motion.div
                    className={`w-12 h-0.5 rounded-full transition-all ${
                      step < getStageNumber() 
                        ? 'bg-linear-to-r from-blue-500 to-purple-500' 
                        : 'bg-zinc-200 dark:bg-zinc-700'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: step * 0.1 + 0.2 }}
                  />
                )}
              </React.Fragment>
            )
          })}
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
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-purple-500/40 relative"
          >
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0"
              animate={{ 
                opacity: [0, 0.5, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            {stage === 'verify' ? (
              <Mail className="w-9 h-9 text-white relative z-10" />
            ) : stage === 'complete' ? (
              <User className="w-9 h-9 text-white relative z-10" />
            ) : (
              <Sparkles className="w-9 h-9 text-white relative z-10" />
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
              <h1 className="text-4xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                {getStageTitle()}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">{getStageDescription()}</p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl p-8 rounded-3xl border border-white/10 dark:border-zinc-800/50 shadow-2xl shadow-black/5 dark:shadow-black/20 overflow-hidden">
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
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="username" className="flex items-center gap-2 text-sm font-medium">
                    <motion.div
                      animate={focusedField === 'username' ? { scale: 1.2, rotate: 360 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <User className="w-4 h-4 text-primary" />
                    </motion.div>
                    Username
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="johndoe123"
                      value={formData.username}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('username')}
                      onBlur={() => setFocusedField(null)}
                      required
                      minLength={3}
                      maxLength={10}
                      pattern="[a-z0-9]+"
                      title="Lowercase letters and numbers only, 3-10 characters"
                      className="h-12 transition-all border-2 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10"
                    />
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    3-10 characters, lowercase letters and numbers only
                  </p>
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
