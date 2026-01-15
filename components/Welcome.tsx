'use client'

import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'

export default function Welcome() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Generate fixed positions for particles to avoid hydration mismatch
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
    }))
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 w-full">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden w-full">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 40, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo or Icon */}
        <motion.div
          animate={{
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
          }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Welcome text */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl font-heading font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent tracking-tight"
        >
          Welcome
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl font-heading font-medium text-zinc-600 dark:text-zinc-300 mb-4 max-w-2xl"
        >
          Embark on your learning journey
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg font-medium text-zinc-500 dark:text-zinc-400 mb-12 max-w-xl leading-relaxed"
        >
          Discover courses, expand your knowledge, and transform your skills with our comprehensive learning platform
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push('/signup')}
              className="px-8 py-4 text-lg font-heading font-semibold bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push('/')}
              className="px-8 py-4 text-lg font-heading font-semibold bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 text-zinc-800 dark:text-zinc-100 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        >
          {[
            {
              icon: '📚',
              title: 'Rich Content',
              description: 'Access a wide variety of courses'
            },
            {
              icon: '🎯',
              title: 'Track Progress',
              description: 'Monitor your learning journey'
            },
            {
              icon: '🏆',
              title: 'Achieve Goals',
              description: 'Complete courses and earn certificates'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/50 dark:bg-zinc-800/50 backdrop-blur-lg rounded-2xl p-6 border border-zinc-200/50 dark:border-zinc-700/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all"
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">
                {feature.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      {isMounted && particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-500/30 dark:bg-blue-400/30 rounded-full"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  )
}
