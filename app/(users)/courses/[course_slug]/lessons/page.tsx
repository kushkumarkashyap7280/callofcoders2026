'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Circle, Lock, BookOpen, Clock, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'
import Link from 'next/link'

interface Lesson {
  id: string
  slug: string
  title: string
  description: string | null
  sequenceNo: number
  duration: string | null
  isPreview: boolean
  isCompleted?: boolean
}

interface Course {
  id: string
  slug: string
  title: string
  description: string
  instructor: string | null
}

interface EnrollmentData {
  enrolled: boolean
  progress: number
  completedLessons: string[]
}

export default function CourseLessonsPage({ params }: { params: Promise<{ course_slug: string }> }) {
  const router = useRouter()
  const auth = useAuth()
  
  const [courseSlug, setCourseSlug] = useState<string>('')
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(({ course_slug }) => {
      setCourseSlug(course_slug)
      fetchCourseData(course_slug)
    })
  }, [params])

  const fetchCourseData = async (slug: string) => {
    try {
      // Fetch course and lessons
      const response = await fetch(`/api/courses/slug/${slug}/lessons`)
      if (!response.ok) throw new Error('Failed to fetch course data')
      
      const data = await response.json()
      setCourse(data.course)
      
      // Fetch enrollment status if authenticated
      if (auth?.authState.isAuthenticated && data.course) {
        const enrollmentResponse = await fetch(`/api/enrollments/${data.course.id}`)
        if (enrollmentResponse.ok) {
          const enrollmentData = await enrollmentResponse.json()
          setEnrollmentData(enrollmentData)
          
          // Mark completed lessons
          const lessonsWithCompletion = data.lessons.map((lesson: Lesson) => ({
            ...lesson,
            isCompleted: enrollmentData.completedLessons?.includes(lesson.id) || false
          }))
          setLessons(lessonsWithCompletion)
        } else {
          setLessons(data.lessons)
        }
      } else {
        setLessons(data.lessons)
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson: Lesson) => {
    // Check if user is enrolled or if lesson is preview
    if (!enrollmentData?.enrolled && !lesson.isPreview) {
      toast.error('Please enroll in this course to access this lesson')
      router.push(`/courses/${courseSlug}`)
      return
    }
    
    router.push(`/courses/${courseSlug}/lessons/${lesson.slug}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading course...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Course Not Found</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">The course you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>
    )
  }

  const completedCount = lessons.filter(l => l.isCompleted).length
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center text-white/90 hover:text-white mb-4"
          >
            ← Back to Course Overview
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
          {course.instructor && (
            <p className="text-white/90">by {course.instructor}</p>
          )}
          
          {/* Progress Bar */}
          {enrollmentData?.enrolled && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Your Progress</span>
                <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-400 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-white/80 mt-2">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {!enrollmentData?.enrolled && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 dark:text-yellow-200">
              <strong>Not enrolled:</strong> You can preview free lessons, but need to enroll to access all content.
            </p>
            <Button
              onClick={() => router.push(`/courses/${courseSlug}`)}
              className="mt-3"
            >
              Enroll Now
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson, index) => {
            const isLocked = !enrollmentData?.enrolled && !lesson.isPreview
            
            return (
              <div
                key={lesson.id}
                onClick={() => !isLocked && handleLessonClick(lesson)}
                className={`
                  bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6
                  transition-all duration-200
                  ${isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500'
                  }
                  ${lesson.isCompleted 
                    ? 'border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/10' 
                    : ''
                  }
                `}
              >
                {/* Status Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                        {lesson.sequenceNo}
                      </span>
                    </div>
                    
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-zinc-400" />
                    ) : lesson.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-zinc-400" />
                    )}
                  </div>
                  
                  {lesson.isPreview && (
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                      Preview
                    </span>
                  )}
                </div>

                {/* Lesson Info */}
                <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2">
                  {lesson.title}
                </h3>
                
                {lesson.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                    {lesson.description}
                  </p>
                )}

                {/* Duration */}
                {lesson.duration && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span>{lesson.duration}</span>
                  </div>
                )}

                {/* Status Badge */}
                {!isLocked && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    {lesson.isCompleted ? (
                      <span className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <PlayCircle className="w-4 h-4" />
                        Start Lesson
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
            <BookOpen className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No Lessons Yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              This course doesn't have any lessons at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
