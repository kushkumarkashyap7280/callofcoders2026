'use client'

import { useState, useEffect } from 'react'
import { createCourse, createLesson, getCourses } from '@/app/actions/upload'
import { Button } from '@/components/ui/button'

type Course = {
  id: string
  slug: string
  title: string
}

export default function UploadMdx() {
  const [activeTab, setActiveTab] = useState<'course' | 'lesson'>('course')
  const [courses, setCourses] = useState<Course[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  async function loadCourses() {
    const result = await getCourses()
    if (result.success && result.courses) {
      setCourses(result.courses)
    }
  }

  async function handleCourseSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await createCourse(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Course created successfully!' })
      e.currentTarget.reset()
      loadCourses()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create course' })
    }
  }

  async function handleLessonSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    
    const formData = new FormData(e.currentTarget)
    const result = await createLesson(formData)
    
    if (result.success) {
      setMessage({ type: 'success', text: 'Lesson created successfully!' })
      e.currentTarget.reset()
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to create lesson' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Course Content</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('course')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'course'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Create Course
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'lesson'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Add Lesson
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-4 p-4 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Course Form */}
      {activeTab === 'course' && (
        <form onSubmit={handleCourseSubmit} className="space-y-4">
          <div>
            <label htmlFor="slug" className="block font-medium mb-1">
              Slug (URL-friendly, e.g., "nextjs-mastery") *
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="nextjs-mastery"
            />
          </div>

          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Next.js Mastery Course"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              className="w-full border rounded px-3 py-2"
              placeholder="Learn Next.js from scratch..."
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="block font-medium mb-1">
              Image URL (optional)
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="w-full border rounded px-3 py-2"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label htmlFor="externalLink" className="block font-medium mb-1">
              External Link (optional)
            </label>
            <input
              type="url"
              id="externalLink"
              name="externalLink"
              className="w-full border rounded px-3 py-2"
              placeholder="https://github.com/..."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block font-medium mb-1">
              Tags (comma-separated) *
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="nextjs, react, typescript"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              className="w-4 h-4"
            />
            <label htmlFor="isPublished" className="font-medium">
              Published
            </label>
          </div>

          <Button type="submit" className="w-full">
            Create Course
          </Button>
        </form>
      )}

      {/* Lesson Form */}
      {activeTab === 'lesson' && (
        <form onSubmit={handleLessonSubmit} className="space-y-4">
          <div>
            <label htmlFor="courseId" className="block font-medium mb-1">
              Select Course *
            </label>
            <select
              id="courseId"
              name="courseId"
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">-- Choose a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title} ({course.slug})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lessonSlug" className="block font-medium mb-1">
              Lesson Slug (e.g., "introduction") *
            </label>
            <input
              type="text"
              id="lessonSlug"
              name="slug"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="introduction"
            />
          </div>

          <div>
            <label htmlFor="lessonTitle" className="block font-medium mb-1">
              Lesson Title *
            </label>
            <input
              type="text"
              id="lessonTitle"
              name="title"
              required
              className="w-full border rounded px-3 py-2"
              placeholder="Introduction to Next.js"
            />
          </div>

          <div>
            <label htmlFor="sequenceNo" className="block font-medium mb-1">
              Sequence Number *
            </label>
            <input
              type="number"
              id="sequenceNo"
              name="sequenceNo"
              required
              min="1"
              className="w-full border rounded px-3 py-2"
              placeholder="1"
            />
          </div>

          <div>
            <label htmlFor="content" className="block font-medium mb-1">
              MDX Content *
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={15}
              className="w-full border rounded px-3 py-2 font-mono text-sm"
              placeholder="# Introduction&#10;&#10;This is the first lesson...&#10;&#10;<Button>Click me</Button>"
            />
          </div>

          <Button type="submit" className="w-full">
            Add Lesson
          </Button>
        </form>
      )}
    </div>
  )
}
