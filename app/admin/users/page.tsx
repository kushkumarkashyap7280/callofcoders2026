'use client'

import { Shield, Mail, Calendar, BookOpen } from 'lucide-react'

export default function AdminUsersPage() {
  // TODO: Fetch from API - prisma.user.findMany({ include: { enrollments } })
  const users = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      isAdmin: false,
      profileImageUrl: null,
      createdAt: new Date('2025-11-15'),
      _count: { enrollments: 3 },
    },
    {
      id: '2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      isAdmin: false,
      profileImageUrl: null,
      createdAt: new Date('2025-12-01'),
      _count: { enrollments: 5 },
    },
    {
      id: '3',
      email: 'admin@example.com',
      name: 'Admin User',
      isAdmin: true,
      profileImageUrl: null,
      createdAt: new Date('2025-10-01'),
      _count: { enrollments: 0 },
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Manage Users
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            View and manage user accounts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Users</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{users.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Admins</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {users.filter(u => u.isAdmin).length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Regular Users</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {users.filter(u => !u.isAdmin).length}
            </p>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.name || user.email} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-zinc-600 dark:text-zinc-300">
                      {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {user.name || 'No name'}
                    </h3>
                    {user.isAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                        <Shield className="w-3 h-3" />
                        Admin
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {user.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {user._count.enrollments} enrollments
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        // TODO: Toggle admin status
                        console.log('Toggle admin:', user.id)
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        user.isAdmin
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                      }`}
                    >
                      <Shield className="w-4 h-4" />
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                    <button
                      onClick={() => {
                        // TODO: View user enrollments
                        console.log('View enrollments:', user.id)
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors text-sm font-medium"
                    >
                      <BookOpen className="w-4 h-4" />
                      View Enrollments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
