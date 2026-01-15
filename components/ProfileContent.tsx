'use client'

import React from 'react'
import { useAuth } from '@/components/AuthProvider'

export default function ProfileContent() {
  const auth = useAuth()
  const user = auth?.authState.user

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="h-24 bg-linear-to-r from-blue-500 to-purple-500"></div>
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            {/* Profile Image */}
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-zinc-800 bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden shadow-lg">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt={user.name || 'Profile'} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-bold text-zinc-600 dark:text-zinc-300">
                  {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex-1 pt-4">
              <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                {user?.name || 'User'}
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
          Profile Information
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Full Name
              </label>
              <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                {user?.name || 'Not set'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Email Address
              </label>
              <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                {user?.email}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Account Type
              </label>
              <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                {user?.isAdmin ? 'Administrator' : 'User'}
              </p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Member Since
              </label>
              <p className="mt-1 text-zinc-900 dark:text-zinc-100">
                January 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left">
            <div className="font-medium text-zinc-800 dark:text-zinc-100">
              Update Profile Picture
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Upload a new profile image (max 5MB)
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left">
            <div className="font-medium text-zinc-800 dark:text-zinc-100">
              Change Password
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Update your account password
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left">
            <div className="font-medium text-zinc-800 dark:text-zinc-100">
              Notification Settings
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage email and push notifications
            </div>
          </button>
          
          <button className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all text-left">
            <div className="font-medium text-zinc-800 dark:text-zinc-100">
              Privacy Settings
            </div>
            <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Control your privacy preferences
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
