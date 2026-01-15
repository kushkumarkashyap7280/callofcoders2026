'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, Settings, X } from 'lucide-react'

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const pathname = usePathname()
  
  const menuItems = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/profile',
      description: 'View and edit your profile'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/profile/settings',
      description: 'Manage your account settings'
    },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Sidebar drawer */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-800 
          border-r border-zinc-200 dark:border-zinc-700 
          z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
        >
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
            My Account
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your profile
          </p>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${active 
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                  }
                `}
              >
                <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">
                    {item.label}
                  </div>
                  <div className={`text-xs mt-0.5 ${active ? 'text-blue-500 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`}>
                    {item.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
