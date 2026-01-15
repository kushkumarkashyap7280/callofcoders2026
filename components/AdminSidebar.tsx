'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Briefcase, 
  Users,
  X,
  Home
} from 'lucide-react'
import React from 'react'

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { href: '/admin/blogs', icon: FileText, label: 'Blogs' },
    { href: '/admin/projects', icon: Briefcase, label: 'Projects' },
    { href: '/admin/users', icon: Users, label: 'Users' },
  ]

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
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-zinc-800 
        border-r border-zinc-200 dark:border-zinc-700 
        z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors z-10"
        >
          <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
        </button>

        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">
              Admin Panel
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your platform
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.exact 
                ? pathname === item.href 
                : pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-700">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
