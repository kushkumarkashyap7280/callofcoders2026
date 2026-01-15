'use client'
import Link from 'next/link'
import { Plus, Edit, Trash2, Calendar } from 'lucide-react'

export default function AdminBlogsPage() {
  // TODO: Fetch from API - prisma.blogs.findMany({ orderBy: { publishedAt: 'desc' } })
  const blogs = [
    {
      id: '1',
      title: 'Getting Started with Next.js 14',
      content: 'Complete guide to building modern web applications...',
      author: 'Admin',
      publishedAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-09'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: '2',
      title: '10 JavaScript Tips Every Developer Should Know',
      content: 'Improve your JavaScript skills with these essential tips...',
      author: 'Admin',
      publishedAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-04'),
      updatedAt: new Date('2026-01-05'),
    },
    {
      id: '3',
      title: 'Understanding React Server Components',
      content: 'Deep dive into the new React Server Components architecture...',
      author: 'Admin',
      publishedAt: new Date('2025-12-28'),
      createdAt: new Date('2025-12-27'),
      updatedAt: new Date('2025-12-28'),
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Manage Blogs
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Write and publish blog posts
            </p>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Blog Post
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Blog Posts</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{blogs.length}</p>
        </div>

        {/* Blogs List */}
        <div className="space-y-4">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  {blog.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-3">
                  {blog.content.substring(0, 150)}...
                </p>
                <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                  <span>By {blog.author}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {blog.publishedAt.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/blogs/${blog.id}/edit`}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => {
                    // TODO: Delete blog
                    if (confirm('Are you sure you want to delete this blog post?')) {
                      console.log('Delete:', blog.id)
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
