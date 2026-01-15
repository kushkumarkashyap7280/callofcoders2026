'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, BookOpen } from 'lucide-react'

export default function AdminCoursesPage() {
  // TODO: Fetch from API - prisma.course.findMany({ include: { lessons, enrollments } })
  const courses = [
    {
      id: '1',
      slug: 'javascript-fundamentals',
      title: 'JavaScript Fundamentals',
      description: 'Learn the core concepts of JavaScript programming',
      imageUrl: null,
      externalLink: null,
      tags: ['JavaScript', 'Beginner', 'Web Development'],
      isPublished: true,
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-15'),
      _count: { lessons: 24, enrollments: 524 },
    },
    {
      id: '2',
      slug: 'react-complete-guide',
      title: 'React Complete Guide',
      description: 'Master React from basics to advanced concepts',
      imageUrl: null,
      externalLink: null,
      tags: ['React', 'JavaScript', 'Frontend'],
      isPublished: true,
      createdAt: new Date('2025-12-15'),
      updatedAt: new Date('2026-01-10'),
      _count: { lessons: 36, enrollments: 432 },
    },
    {
      id: '3',
      slug: 'nextjs-fullstack',
      title: 'Next.js Fullstack Development',
      description: 'Build modern fullstack applications with Next.js',
      imageUrl: null,
      externalLink: null,
      tags: ['Next.js', 'React', 'Fullstack'],
      isPublished: false,
      createdAt: new Date('2025-11-20'),
      updatedAt: new Date('2026-01-12'),
      _count: { lessons: 28, enrollments: 387 },
    },
  ]

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Manage Courses
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Create and manage your course content
            </p>
          </div>
          <Link
            href="/admin/courses/new"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Course
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Courses</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{courses.length}</p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Published</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {courses.filter(c => c.isPublished).length}
            </p>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Drafts</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {courses.filter(c => !c.isPublished).length}
            </p>
          </div>
        </div>

        {/* Courses List */}
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Course Image */}
                <div className="w-full sm:w-32 h-32 shrink-0 bg-zinc-200 dark:bg-zinc-700 rounded-lg overflow-hidden flex items-center justify-center">
                  {course.imageUrl ? (
                    <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookOpen className="w-12 h-12 text-zinc-400 dark:text-zinc-500" />
                  )}
                </div>

                {/* Course Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {course.title}
                        </h2>
                        {course.isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
                            <Eye className="w-3 h-3" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded">
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {course.tags.map((tag) => (
                          <span 
                            key={tag}
                            className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                    <span>{course._count.lessons} lessons</span>
                    <span>•</span>
                    <span>{course._count.enrollments} students</span>
                    <span>•</span>
                    <span>Updated {course.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/courses/${course.id}/lessons`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm font-medium"
                    >
                      <BookOpen className="w-4 h-4" />
                      Manage Lessons
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/edit`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        // TODO: Toggle isPublished
                        console.log('Toggle publish:', course.id)
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium ${
                        course.isPublished
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30'
                          : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {course.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Delete course
                        if (confirm('Are you sure you want to delete this course?')) {
                          console.log('Delete:', course.id)
                        }
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
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
