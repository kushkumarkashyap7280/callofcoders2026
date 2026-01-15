import Link from 'next/link'

export default function CourseLessonsPage({ params }: { params: { course_slug: string } }) {
  // TODO: Fetch course and lessons from API using params.course_slug
  // const session = await getServerSession()
  // const course = await prisma.course.findUnique({
  //   where: { slug: params.course_slug },
  //   include: {
  //     lessons: { orderBy: { sequenceNo: 'asc' } },
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
  }

  // User's enrollment (tracks currentLessonId and isCompleted)
  const userEnrollment = {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: '1',
    enrolledAt: new Date('2026-01-10'),
    lastAccessedAt: new Date('2026-01-14'),
    currentLessonId: '3',
    isCompleted: false,
  }

  const lessons = [
    {
      id: '1',
      slug: 'introduction-to-javascript',
      title: 'Introduction to JavaScript',
      sequenceNo: 1,
      content: 'Full MDX content here...',
      courseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      slug: 'variables-and-data-types',
      title: 'Variables and Data Types',
      sequenceNo: 2,
      content: 'Full MDX content here...',
      courseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      slug: 'functions-basics',
      title: 'Functions Basics',
      sequenceNo: 3,
      content: 'Full MDX content here...',
      courseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      slug: 'arrays-and-objects',
      title: 'Arrays and Objects',
      sequenceNo: 4,
      content: 'Full MDX content here...',
      courseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '5',
      slug: 'loops-and-iteration',
      title: 'Loops and Iteration',
      sequenceNo: 5,
      content: 'Full MDX content here...',
      courseId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/courses/${course.slug}`}
          className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
        >
          ← Back to Course
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          {course.title}
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          {lessons.length} lessons available
        </p>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${course.slug}/lessons/${lesson.slug}`}
            className="block bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 sm:p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
          >
            <div className="flex items-start gap-4">
              {/* Lesson Number */}
              <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {lesson.sequenceNo}
                </span>
              </div>

              {/* Lesson Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {lesson.title}
                  </h3>
                </div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
                  {lesson.content.substring(0, 100)}...
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Your Progress
          </h2>
          {userEnrollment && (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {userEnrollment.isCompleted ? (
                <span className="text-green-600 dark:text-green-400 font-medium">✓ Completed</span>
              ) : userEnrollment.currentLessonId ? (
                <span>In Progress</span>
              ) : (
                <span>Not Started</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all"
              style={{ 
                width: userEnrollment?.currentLessonId 
                  ? `${((lessons.findIndex(l => l.id === userEnrollment.currentLessonId) + 1) / lessons.length) * 100}%`
                  : '0%'
              }}
            />
          </div>
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {userEnrollment?.currentLessonId 
              ? `${lessons.findIndex(l => l.id === userEnrollment.currentLessonId) + 1}/${lessons.length}`
              : `0/${lessons.length}`}
          </span>
        </div>
        {userEnrollment?.lastAccessedAt && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
            Last accessed: {new Date(userEnrollment.lastAccessedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </div>
  )
}
