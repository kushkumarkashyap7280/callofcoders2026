import Link from 'next/link'

export default function CoursePage({ params }: { params: { course_slug: string } }) {
  // TODO: Fetch course details from API using params.course_slug
  // const session = await getServerSession()
  // const course = await prisma.course.findUnique({
  //   where: { slug: params.course_slug },
  //   include: {
  //     lessons: { orderBy: { sequenceNo: 'asc' } },
  //     enrollments: { select: { id: true } },
  //   },
  // })
  // const userEnrollment = session?.user ? await prisma.enrollment.findUnique({
  //   where: {
  //     userId_courseId: {
  //       userId: session.user.id,
  //       courseId: course.id,
  //     },
  //   },
  // }) : null

  const course = {
    id: '1',
    slug: params.course_slug,
    title: 'JavaScript Fundamentals',
    description: 'Learn the core concepts of JavaScript programming from scratch. This comprehensive course covers everything you need to know to become proficient in JavaScript.',
    imageUrl: null,
    externalLink: null,
    tags: ['JavaScript', 'Beginner', 'Web Development'],
    isPublished: true,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-15'),
    lessons: new Array(24),
    enrollments: new Array(1234),
  }

  // User's enrollment in this course (null if not enrolled)
  const userEnrollment = {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: '1',
    enrolledAt: new Date('2026-01-10'),
    lastAccessedAt: new Date('2026-01-14'),
    currentLessonId: '3',
    isCompleted: false,
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 sm:p-8 mb-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg mb-6 opacity-90">{course.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.map((tag) => (
              <span 
                key={tag}
                className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm text-white rounded-full border border-white/30"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span>📚 {course.lessons.length} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥 {course.enrollments.length.toLocaleString()} enrolled</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅 Updated {course.updatedAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Info & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 space-y-6">
          {/* What You'll Learn */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              What you'll learn
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Core JavaScript concepts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">ES6+ features and syntax</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">Asynchronous programming</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-zinc-700 dark:text-zinc-300">DOM manipulation</span>
              </li>
            </ul>
          </div>

          {/* Course Description */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              About this course
            </h2>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              This comprehensive JavaScript course is designed for beginners who want to master the fundamentals 
              of web programming. You'll learn everything from basic syntax to advanced concepts like closures, 
              promises, and async/await. By the end of this course, you'll be able to build interactive web 
              applications with confidence.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Course Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Lessons</span>
                <span className="text-zinc-900 dark:text-zinc-100">{course.lessons.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Enrolled</span>
                <span className="text-zinc-900 dark:text-zinc-100">{course.enrollments.length.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Status</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {course.isPublished ? (
                    <span className="text-green-600 dark:text-green-400">Published</span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">Draft</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Created</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {course.createdAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Last Updated</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {course.updatedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            {userEnrollment ? (
              <div className="mt-6 space-y-3">
                {/* Enrollment Progress */}
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                    <span>✓</span>
                    <span>Enrolled</span>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-500">
                    {userEnrollment.enrolledAt && new Date(userEnrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                  {userEnrollment.lastAccessedAt && (
                    <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                      Last accessed: {new Date(userEnrollment.lastAccessedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>

                <Link
                  href={`/courses/${course.slug}/lessons`}
                  className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {userEnrollment.currentLessonId ? 'Continue Learning' : 'Start Course'}
                </Link>
                
                {userEnrollment.isCompleted && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-center">
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">🎉 Completed!</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  onClick={() => {
                    // TODO: Implement enrollment API call
                    console.log('Enroll in course')
                  }}
                >
                  Enroll Now
                </button>
                <Link
                  href={`/courses/${course.slug}/lessons`}
                  className="w-full block text-center bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Preview Lessons
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
