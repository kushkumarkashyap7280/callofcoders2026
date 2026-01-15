import Link from 'next/link'

export default function CoursesPage() {
  // TODO: Fetch courses from API
  // const courses = await prisma.course.findMany({
  //   where: { isPublished: true },
  //   include: {
  //     lessons: { select: { id: true } },
  //     enrollments: { select: { id: true } },
  //   },
  //   orderBy: { createdAt: 'desc' },
  // })

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
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: new Array(24),
      enrollments: new Array(1234),
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
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: new Array(36),
      enrollments: new Array(2345),
    },
    {
      id: '3',
      slug: 'nextjs-fullstack',
      title: 'Next.js Fullstack Development',
      description: 'Build modern fullstack applications with Next.js',
      imageUrl: null,
      externalLink: null,
      tags: ['Next.js', 'React', 'Fullstack'],
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: new Array(28),
      enrollments: new Array(876),
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
          All Courses
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Browse our comprehensive collection of programming courses
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.slug}`}
            className="group bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="aspect-video bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center overflow-hidden">
              {course.imageUrl ? (
                <img 
                  src={course.imageUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-zinc-400 dark:text-zinc-500">Course Image</span>
              )}
            </div>
            
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {course.title}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 line-clamp-2">
                {course.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {course.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>{course.lessons.length} lessons</span>
                <span>{course.enrollments.length.toLocaleString()} enrolled</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
