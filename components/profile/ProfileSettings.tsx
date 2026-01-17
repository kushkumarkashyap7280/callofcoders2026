'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'

export default function ProfileSettings() {
  const router = useRouter()
  const auth = useAuth()

  useEffect(() => {
    if (!auth?.authState.loading && !auth?.authState.isAuthenticated) {
      router.push('/login')
    }
  }, [auth?.authState.loading, auth?.authState.isAuthenticated, router])

  if (auth?.authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!auth?.authState.isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-zinc-800 dark:text-zinc-100">
                Settings
              </h1>
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                Manage your account settings and preferences
              </p>
            </div>

            {/* Account Settings */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                Account Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Change Password
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Update your account password
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Change
                  </button>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Email Preferences
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Manage email notifications and updates
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Configure
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Two-Factor Authentication
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Add an extra layer of security
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700 p-6">
              <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                Privacy Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Profile Visibility
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Control who can see your profile
                    </div>
                  </div>
                  <select className="px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100">
                    <option>Public</option>
                    <option>Private</option>
                    <option>Friends Only</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Show Online Status
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Let others see when you're active
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-zinc-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Data Sharing
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Control how your data is used
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-red-200 dark:border-red-900/50 p-6">
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-zinc-200 dark:border-zinc-700">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Deactivate Account
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Temporarily disable your account
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    Deactivate
                  </button>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-zinc-800 dark:text-zinc-100">
                      Delete Account
                    </div>
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Permanently delete your account and all data
                    </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 rounded-lg transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
  )
}
