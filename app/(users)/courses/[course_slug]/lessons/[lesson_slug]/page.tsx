import Link from 'next/link'

export default function LessonPage({ 
  params 
}: { 
  params: { course_slug: string; lesson_slug: string } 
}) {
  // TODO: Fetch lesson details from API using params.course_slug and params.lesson_slug
  // const lesson = await prisma.lesson.findFirst({
  //   where: {
  //     slug: params.lesson_slug,
  //     course: { slug: params.course_slug },
  //   },
  //   include: { course: true },
  // })
  // const allLessons = await prisma.lesson.findMany({
  //   where: { courseId: lesson.courseId },
  //   orderBy: { sequenceNo: 'asc' },
  // })

  const lesson = {
    id: '1',
    slug: params.lesson_slug,
    title: 'Introduction to JavaScript',
    description: 'Learn the basics of JavaScript programming language and set up your development environment.',
    sequenceNo: 1,
    content: `
      <h2>What is JavaScript?</h2>
      <p>JavaScript is a versatile programming language that runs in web browsers and on servers. 
      It's one of the core technologies of the web, alongside HTML and CSS.</p>
      
      <h3>Why Learn JavaScript?</h3>
      <ul>
        <li>Used in both frontend and backend development</li>
        <li>Large and active community</li>
        <li>Extensive ecosystem of libraries and frameworks</li>
        <li>High demand in the job market</li>
      </ul>

      <h3>Key Concepts</h3>
      <p>In this lesson, we'll cover:</p>
      <ul>
        <li>History of JavaScript</li>
        <li>JavaScript in the browser</li>
        <li>JavaScript on the server (Node.js)</li>
        <li>Setting up your development environment</li>
      </ul>
    `,
    courseId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const course = {
    id: '1',
    slug: params.course_slug,
    title: 'JavaScript Fundamentals',
  }

  // User's enrollment - tracks progress
  const userEnrollment: {
    id: string
    userId: string
    courseId: string
    enrolledAt: Date
    lastAccessedAt: Date
    currentLessonId: string
    isCompleted: boolean
  } | null = null // TODO: Fetch from API
  // {
  //   id: 'enrollment-id',
  //   userId: 'user-id',
  //   courseId: '1',
  //   enrolledAt: new Date('2026-01-10'),
  //   lastAccessedAt: new Date('2026-01-14'),
  //   currentLessonId: '1',
  //   isCompleted: false,
  // }

  const allLessons = [lesson] // TODO: Fetch all lessons for progress calculation
  const currentLessonIndex = userEnrollment?.currentLessonId 
    ? allLessons.findIndex(l => l.id === userEnrollment.currentLessonId)
    : 0
  const progressPercentage = allLessons.length > 0 
    ? ((currentLessonIndex + 1) / allLessons.length) * 100 
    : 0

  // Navigation between lessons (TODO: fetch from API based on sequenceNo)
  const navigation: {
    previous: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  } = {
    previous: null,
    next: {
      slug: 'variables-and-data-types',
      title: 'Variables and Data Types',
    },
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Video Section - Optional, can be embedded in MDX content */}
      <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <span className="text-sm font-medium">Lesson {lesson.sequenceNo}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="text-sm">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/courses" className="hover:text-blue-600 dark:hover:text-blue-400">
                Courses
              </Link>
              <span className="mx-2">/</span>
              <Link 
                href={`/courses/${course.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {course.title}
              </Link>
              <span className="mx-2">/</span>
              <Link 
                href={`/courses/${course.slug}/lessons`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                Lessons
              </Link>
            </div>

            {/* Lesson Header */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                    {lesson.title}
                  </h1>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {lesson.description}
                  </p>
                </div>
                <div className="shrink-0 ml-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium rounded-full">
                    Lesson {lesson.sequenceNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Lesson Content */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
              <div 
                className="prose prose-zinc dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {navigation.previous ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${navigation.previous.slug}`}
                  className="flex-1 group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all"
                >
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">← Previous</div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {navigation.previous.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}

              {navigation.next ? (
                <Link
                  href={`/courses/${course.slug}/lessons/${navigation.next.slug}`}
                  className="flex-1 group bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all text-right"
                >
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Next →</div>
                  <div className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {navigation.next.title}
                  </div>
                </Link>
              ) : (
                <div className="flex-1" />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Course Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-zinc-600 dark:text-zinc-400">Completed</span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                
                {userEnrollment && (
                  <>
                    <button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={userEnrollment.currentLessonId === lesson.id}
                      onClick={() => {
                        // TODO: Update enrollment.currentLessonId to next lesson
                        // TODO: Update enrollment.lastAccessedAt to now
                        console.log('Mark lesson as complete and move to next')
                      }}
                    >
                      {userEnrollment.currentLessonId === lesson.id ? '✓ Current Lesson' : 'Mark as Complete'}
                    </button>
                    
                    {userEnrollment.isCompleted && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">🎉 Course Completed!</span>
                      </div>
                    )}
                  </>
                )}
                
                <Link
                  href={`/courses/${course.slug}/lessons`}
                  className="block w-full text-center bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View All Lessons
                </Link>
                
                {userEnrollment?.enrolledAt && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
                    Enrolled: {new Date(userEnrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>

            {/* Resources */}
            <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                Resources
              </h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  📄 Lesson Notes (PDF)
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  💻 Code Examples
                </a>
                <a href="#" className="block text-blue-600 dark:text-blue-400 hover:underline">
                  📚 Additional Reading
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
