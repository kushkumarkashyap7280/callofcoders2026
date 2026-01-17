'use client'

import React from 'react'
import Image from 'next/image'

interface PublicProfileViewProps {
  user: {
    id: string
    email: string
    username: string | null
    name: string | null
    profileImageUrl: string | null
    metadata: any
    createdAt: Date
    enrollments: Array<{
      courseId: string
      enrolledAt: Date
      isCompleted: boolean
      course: {
        title: string
        slug: string
        imageUrl: string | null
      }
    }>
  }
}

export default function PublicProfileView({ user }: PublicProfileViewProps) {
  const metadata = user.metadata as {
    bio?: string
    location?: string
    website?: string
    twitter?: string
    github?: string
    linkedin?: string
  } | null

  const completedCourses = user.enrollments.filter((e) => e.isCompleted)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="shrink-0">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.name || 'User'}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {(user.name || user.email)[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.name || user.username || 'Anonymous User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">@{user.username || 'no-username'}</p>

              {metadata?.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">{metadata.bio}</p>
              )}

              {metadata?.location && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  📍 {metadata.location}
                </p>
              )}

              {/* Social Links */}
              <div className="flex gap-4 mt-4">
                {metadata?.website && (
                  <a
                    href={metadata.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                  >
                    🌐 Website
                  </a>
                )}
                {metadata?.github && (
                  <a
                    href={`https://github.com/${metadata.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-gray-900 dark:text-gray-400"
                  >
                    GitHub
                  </a>
                )}
                {metadata?.twitter && (
                  <a
                    href={`https://twitter.com/${metadata.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    Twitter
                  </a>
                )}
                {metadata?.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${metadata.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 dark:text-blue-500"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Completed Courses */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Completed Courses ({completedCourses.length})
          </h2>

          {completedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedCourses.map((enrollment) => (
                <div
                  key={enrollment.courseId}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  {enrollment.course.imageUrl && (
                    <div className="mb-3">
                      <Image
                        src={enrollment.course.imageUrl}
                        alt={enrollment.course.title}
                        width={400}
                        height={200}
                        className="rounded-lg w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Completed on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              No completed courses yet.
            </p>
          )}
        </div>

        {/* Member Since */}
        <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
          Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
      </div>
    </div>
  )
}
