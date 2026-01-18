'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { 
  CheckCircle2, 
  Circle, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  BookOpen,
  Clock,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/AuthProvider'
import { toast } from 'sonner'
import CodeBlock from '@/components/blog/CodeBlock'
import CustomLink from '@/components/blog/CustomLink'
import CustomList from '@/components/blog/CustomList'
import BlogImage from '@/components/blog/BlogImage'

const components = {
  code: CodeBlock,
  a: CustomLink,
  ul: CustomList,
  ol: CustomList,
  CustomLink,
  CustomList,
  BlogImage,
}

interface Lesson {
  id: string
  slug: string
  title: string
  description: string | null
  sequenceNo: number
  content: string
  duration: string | null
  isPreview: boolean
  videoUrl: string | null
  courseId: string
  course: {
    id: string
    slug: string
    title: string
  }
}

interface SidebarLesson {
  id: string
  slug: string
  title: string
  sequenceNo: number
  duration: string | null
  isPreview: boolean
  isCompleted: boolean
}

interface EnrollmentData {
  enrolled: boolean
  completedLessons: string[]
}

export default function LessonPage({ params }: { params: Promise<{ course_slug: string; lesson_slug: string }> }) {
  const router = useRouter()
  const auth = useAuth()

  const [courseSlug, setCourseSlug] = useState<string>('')
  const [lessonSlug, setLessonSlug] = useState<string>('')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<SidebarLesson[]>([])
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData | null>(null)
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [markingComplete, setMarkingComplete] = useState(false)

  useEffect(() => {
    params.then(({ course_slug, lesson_slug }) => {
      setCourseSlug(course_slug)
      setLessonSlug(lesson_slug)
      fetchLessonData(course_slug, lesson_slug)
    })
  }, [params])

  const fetchLessonData = async (courseSlug: string, lessonSlug: string) => {
    try {
      // Fetch current lesson
      const lessonResponse = await fetch(`/api/courses/slug/${courseSlug}/lessons/${lessonSlug}`)
      if (!lessonResponse.ok) throw new Error('Failed to fetch lesson')
      
      const lessonData = await lessonResponse.json()
      setLesson(lessonData.lesson)

      // Serialize MDX content
      const mdx = await serialize(lessonData.lesson.content)
      setMdxSource(mdx)

      // Fetch all lessons for sidebar
      const allLessonsResponse = await fetch(`/api/courses/slug/${courseSlug}/lessons`)
      if (allLessonsResponse.ok) {
        const data = await allLessonsResponse.json()
        
        // Fetch enrollment status if authenticated
        if (auth?.authState.isAuthenticated && data.course) {
          const enrollmentResponse = await fetch(`/api/enrollments/${data.course.id}`)
          if (enrollmentResponse.ok) {
            const enrollment = await enrollmentResponse.json()
            setEnrollmentData(enrollment)
            
            // Mark completed lessons
            const lessonsWithCompletion = data.lessons.map((l: any) => ({
              ...l,
              isCompleted: enrollment.completedLessons?.includes(l.id) || false
            }))
            setAllLessons(lessonsWithCompletion)
          } else {
            setAllLessons(data.lessons.map((l: any) => ({ ...l, isCompleted: false })))
          }
        } else {
          setAllLessons(data.lessons.map((l: any) => ({ ...l, isCompleted: false })))
        }
      }
    } catch (error) {
      console.error('Error fetching lesson:', error)
      toast.error('Failed to load lesson')
    } finally {
      setLoading(false)
    }
  }

  const markAsComplete = async () => {
    if (!lesson || !enrollmentData?.enrolled || !auth?.authState.isAuthenticated) {
      toast.error('You must be enrolled to mark lessons as complete')
      return
    }

    setMarkingComplete(true)
    try {
      const response = await fetch(`/api/enrollments/${lesson.courseId}/complete-lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson.id })
      })

      if (response.ok) {
        toast.success('Lesson marked as complete!')
        // Update local state
        setAllLessons(prev => prev.map(l => 
          l.id === lesson.id ? { ...l, isCompleted: true } : l
        ))
        if (enrollmentData) {
          setEnrollmentData({
            ...enrollmentData,
            completedLessons: [...enrollmentData.completedLessons, lesson.id]
          })
        }
      } else {
        toast.error('Failed to mark lesson as complete')
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      toast.error('An error occurred')
    } finally {
      setMarkingComplete(false)
    }
  }

  const navigateToLesson = (slug: string) => {
    router.push(`/courses/${courseSlug}/lessons/${slug}`)
    setSidebarOpen(false)
    // Reload the page data
    setLoading(true)
    fetchLessonData(courseSlug, slug)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Lesson Not Found</h2>
          <Button onClick={() => router.push(`/courses/${courseSlug}/lessons`)}>
            Back to Course
          </Button>
        </div>
      </div>
    )
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id)
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isCurrentLessonCompleted = allLessons.find(l => l.id === lesson.id)?.isCompleted || false

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/courses/${courseSlug}/lessons`}
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div className="hidden sm:block">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{lesson.course.title}</p>
                <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Lesson {lesson.sequenceNo}: {lesson.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {enrollmentData?.enrolled && !isCurrentLessonCompleted && (
                <Button
                  onClick={markAsComplete}
                  disabled={markingComplete}
                  size="sm"
                  className="hidden sm:flex"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {markingComplete ? 'Saving...' : 'Mark Complete'}
                </Button>
              )}
              
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          {/* Left: Lesson Content */}
          <div className="min-w-0">
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              {/* Video Section */}
              {lesson.videoUrl && (
                <div className="aspect-video bg-zinc-900">
                  <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                </div>
              )}

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                        Lesson {lesson.sequenceNo}
                      </span>
                      {lesson.duration && (
                        <span className="flex items-center gap-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <Clock className="w-4 h-4" />
                          {lesson.duration}
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
                      {lesson.title}
                    </h1>
                    {lesson.description && (
                      <p className="text-zinc-600 dark:text-zinc-400">{lesson.description}</p>
                    )}
                  </div>
                </div>

                {/* MDX Content */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  {mdxSource ? (
                    <MDXRemote {...mdxSource} components={components} />
                  ) : (
                    <p>Loading content...</p>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  {previousLesson ? (
                    <Button
                      onClick={() => navigateToLesson(previousLesson.slug)}
                      variant="outline"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  ) : (
                    <div></div>
                  )}

                  {nextLesson ? (
                    <Button onClick={() => navigateToLesson(nextLesson.slug)}>
                      Next
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={() => router.push(`/courses/${courseSlug}`)}>
                      Back to Course
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Lessons Sidebar */}
          <div
            className={`
              fixed lg:static inset-y-0 right-0 z-50 w-80 lg:w-auto
              bg-white dark:bg-zinc-800 border-l lg:border lg:rounded-xl border-zinc-200 dark:border-zinc-700
              transform transition-transform duration-300 lg:transform-none
              ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}
          >
            <div className="h-full overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">
                  Course Lessons
                </h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              {enrollmentData?.enrolled && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                    Progress: {allLessons.filter(l => l.isCompleted).length}/{allLessons.length}
                  </p>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${(allLessons.filter(l => l.isCompleted).length / allLessons.length) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Lessons List */}
              <div className="space-y-2">
                {allLessons.map((l) => {
                  const isLocked = !enrollmentData?.enrolled && !l.isPreview
                  const isCurrent = l.id === lesson.id
                  
                  return (
                    <div
                      key={l.id}
                      onClick={() => !isLocked && navigateToLesson(l.slug)}
                      className={`
                        p-3 rounded-lg border transition-all
                        ${isCurrent 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-600' 
                          : 'border-zinc-200 dark:border-zinc-700'
                        }
                        ${isLocked 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:border-blue-500 dark:hover:border-blue-600 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center">
                          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                            {l.sequenceNo}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 mb-1">
                            {l.title}
                          </h3>
                          {l.duration && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {l.duration}
                            </p>
                          )}
                        </div>
                        
                        <div className="shrink-0">
                          {isLocked ? (
                            <Lock className="w-4 h-4 text-zinc-400" />
                          ) : l.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Overlay for mobile sidebar */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            ></div>
          )}
        </div>
      </div>
    </div>
  )
}
