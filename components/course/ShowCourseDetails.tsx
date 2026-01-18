'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Course } from '@/types'
import { useAuth } from '../auth/AuthProvider'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'



import { 
  BookOpen, 
  Clock, 
  Users, 
  BarChart3, 
  Award, 
  PlayCircle,
  CheckCircle2,
  Star,
  TrendingUp,
  Globe,
  Calendar,
  DollarSign
} from 'lucide-react'

interface Lesson {
  id: string
  slug: string
  title: string
  description: string | null
  sequenceNo: number
  duration: string | null
  isPreview: boolean
  videoUrl: string | null
}

function ShowCourseDetails({ course }: { course: Course }) {
  console.log('Course Details:', course);
  const router = useRouter()
  const auth = useAuth()

  const [isEnrolled, setIsEnrolled] = useState(false)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [enrollLoading, setEnrollLoading] = useState(false)
  const [unenrollLoading, setUnenrollLoading] = useState(false)

  const checkEnrollment = async () => {
    if (!auth || !auth.authState.isAuthenticated) {
      setIsEnrolled(false)
      return
    }
    try {
      const response = await fetch(`/api/enrollments/${course.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        }
      })
      const data = await response.json()
      setIsEnrolled(data.enrolled)
    } catch (error) {
      console.error('Error checking enrollment status:', error)
    }
  }

  const fetchLessons = async () => {
    try {
      const response = await fetch(`/api/courses/${course.id}/lessons`)
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched lessons: in showcoursedetails', data)
        setLessons(data)
      }
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const newEnrollment = async () => {
    if (!auth || !auth.authState.isAuthenticated) {
      toast.error('Please log in to enroll in the course.')
      router.push('/login')
      return
    }
    setEnrollLoading(true)
    try {
      const response = await fetch(`/api/enrollments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify({ courseId: course.id }),
      })
      if (response.ok) {
        toast.success('Successfully enrolled in the course!')
        setIsEnrolled(true)
        router.push(`/courses/${course.slug}/lessons`)
      } else {
        const errorData = await response.json()
        toast.error(`Enrollment failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      toast.error('An unexpected error occurred during enrollment.')
    } finally {
      setEnrollLoading(false)
    }
  }

  const deleteEnrollment = async () => {
    if (!auth || !auth.authState.isAuthenticated) {
      toast.error('Please log in to unenroll from the course.')
      router.push('/login')
      return
    }
    setUnenrollLoading(true)
    try {
      const response = await fetch(`/api/enrollments/${course.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
      })
      if (response.ok) {
        toast.success('Successfully unenrolled from the course.')
        setIsEnrolled(false)
      } else {
        const errorData = await response.json()
        toast.error(`Unenrollment failed: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error unenrolling from course:', error)
      toast.error('An unexpected error occurred during unenrollment.')
    } finally {
      setUnenrollLoading(false)
    }
  }

  useEffect(() => {
    checkEnrollment()
    fetchLessons()
  }, [])

  const courseFeatures = [
    { icon: BookOpen, label: 'Lessons', value: course._count.lessons },
    { icon: Users, label: 'Students Enrolled', value: course._count.enrollments },
    { icon: Clock, label: 'Duration', value: course.duration || 'Self-paced' },
    { icon: BarChart3, label: 'Level', value: course.level || 'All Levels' },
  ]

  const learningPoints = [
    'Master core concepts and fundamentals',
    'Build real-world projects from scratch',
    'Learn industry best practices',
    'Get hands-on coding experience',
    'Access to course resources and materials',
    'Certificate of completion',
  ]

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* What You'll Learn */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                What You'll Learn
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {learningPoints.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <p className="text-zinc-700 dark:text-zinc-300">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Course Curriculum */}
          <section className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Course Curriculum
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-700 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons.slice(0, 5).map((lesson, idx) => (
                  <div
                    key={lesson.id}
                    className="group flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {lesson.sequenceNo}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lesson.title}
                      </h3>
                      {lesson.duration && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                          <Clock className="w-3.5 h-3.5 inline mr-1" />
                          {lesson.duration}
                        </p>
                      )}
                    </div>
                    {lesson.isPreview && (
                      <span className="text-xs font-medium px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                        Preview
                      </span>
                    )}
                    <PlayCircle className="w-5 h-5 text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                ))}
                {lessons.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/courses/${course.slug}/lessons`)}
                    >
                      View All {lessons.length} Lessons
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-zinc-600 dark:text-zinc-400 text-center py-8">
                Course curriculum coming soon...
              </p>
            )}
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Enrollment Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6 shadow-sm sticky top-4">
            <div className="text-center mb-6">
              {course.price !== null && course.price > 0 ? (
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">Course Price</p>
                  <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                    ${course.price}
                  </p>
                </div>
              ) : (
                <div className="py-3 px-6 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-2xl">
                  FREE COURSE
                </div>
              )}
            </div>

            {isEnrolled ? (
              <div className="space-y-3">
                <Button
                  onClick={() => router.push(`/courses/${course.slug}/lessons`)}
                  className="w-full"
                  size="lg"
                  disabled={unenrollLoading}
                >
                  {unenrollLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      Loading...
                    </span>
                  ) : (
                    <><PlayCircle className="w-5 h-5 mr-2" />Continue Learning</>
                  )}
                </Button>
                <Button
                  onClick={deleteEnrollment}
                  variant="outline"
                  className="w-full"
                  size="lg"
                  disabled={unenrollLoading}
                >
                  {unenrollLoading ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      Loading...
                    </span>
                  ) : (
                    <>Unenroll from Course</>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={newEnrollment}
                className="w-full"
                size="lg"
                disabled={enrollLoading}
              >
                {enrollLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Loading...
                  </span>
                ) : (
                  <><Award className="w-5 h-5 mr-2" />Enroll Now</>
                )}
              </Button>
            )}

            <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Level</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {course.level || 'All Levels'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Duration</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {course.duration || 'Self-paced'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Lessons</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {course._count.lessons}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Students</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {course._count.enrollments}
                </span>
              </div>
            </div>
          </div>

          {/* Features Card */}
          <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-blue-200 dark:border-zinc-700 p-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-4">
              This course includes:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                Lifetime access
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                Mobile and desktop access
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                Certificate of completion
              </li>
              <li className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                Downloadable resources
              </li>
            </ul>
          </div>

          {/* Share Card */}
          <div className="bg-white dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-4">
              Share this course
            </h3>
            <div className="flex gap-3">
              <button className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
                Twitter
              </button>
              <button className="flex-1 py-2 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors text-sm font-medium">
                Facebook
              </button>
              <button className="flex-1 py-2 px-4 bg-zinc-700 hover:bg-zinc-800 text-white rounded-lg transition-colors text-sm font-medium">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShowCourseDetails
