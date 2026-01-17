'use client';

import { motion } from 'framer-motion';

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen w-full bg-white/70 dark:bg-zinc-900/80 backdrop-blur-sm">
      {/* Animated background elements (blurred circles) */}
      <div className="absolute inset-0 overflow-hidden w-full pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-40 right-20 w-64 h-64 sm:w-96 sm:h-96 bg-purple-400/20 dark:bg-purple-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-1/3 w-56 h-56 sm:w-80 sm:h-80 bg-pink-400/20 dark:bg-pink-600/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </div>
      {/* Loader icon and text */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
            <svg
              className="w-10 h-10 text-white animate-pulse"
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
        <motion.h2
          className="text-2xl font-bold bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading...
        </motion.h2>
        <p className="text-zinc-500 dark:text-zinc-300 text-base">Please wait while we verify your session</p>
      </motion.div>
    </div>
  );
}
