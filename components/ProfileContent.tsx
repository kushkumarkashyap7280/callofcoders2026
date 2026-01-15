'use client'

import React from 'react'
import { useAuth } from '@/components/AuthProvider'

export default function ProfileContent() {
  const auth = useAuth()
  const user = auth?.authState.user

  return (
    <div className="space-y-4 sm:space-y-6 pb-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="h-16 sm:h-24 bg-linear-to-r from-blue-500 to-purple-500"></div>
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 -mt-8 sm:-mt-12">
            {/* Profile Image */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden shadow-lg">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl sm:text-3xl font-bold text-zinc-600 dark:text-zinc-300">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {user?.name || 'User'}
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-3 sm:mb-4">
          Profile Information
        </h2>
        
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="border-b sm:border-b-0 pb-3 sm:pb-0 border-zinc-200 dark:border-zinc-700">
              <label className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Full Name
              </label>
              <p className="mt-1 text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                {user?.name || 'Not set'}
              </p>
            </div>
            
            <div className="border-b sm:border-b-0 pb-3 sm:pb-0 border-zinc-200 dark:border-zinc-700">
              <label className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <p className="mt-1 text-sm sm:text-base text-zinc-900 dark:text-zinc-100 truncate">
                {user?.email}
              </p>
            </div>
            
            <div className="border-b sm:border-b-0 pb-3 sm:pb-0 border-zinc-200 dark:border-zinc-700">
              <label className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Account Type
              </label>
              <p className="mt-1 text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                {user?.isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Member Since
              </label>
              <p className="mt-1 text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                January 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
