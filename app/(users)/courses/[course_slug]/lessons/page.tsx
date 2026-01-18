
import Link from 'next/link';
import { CheckCircle2, Circle, Lock, BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

// Helper to decode JWT and extract userId
function getUserIdFromAuthToken(token: string | undefined): string | null {
  if (!token) return null;
  try {
    // JWT format: header.payload.signature
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'));
    // Adjust this according to your JWT payload structure
    return decoded.id || decoded.userId || null;
  } catch (e) {
    return null;
  }
}
import { cache } from 'react';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  sequenceNo: number;
  duration: string | null;
  isPreview: boolean;
  isCompleted?: boolean;
}

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  instructor: string | null;
}

interface EnrollmentData {
  enrolled: boolean;
  progress: number;
  completedLessons: string[];
}


// Revalidate this page every 5 minutes (300 seconds)
export const revalidate = 300;

// Cache the fetch for course, lessons, and enrollment
const getCourseLessonsAndEnrollment = cache(async (course_slug: string, userId: string | null) => {
  console.log('[Server] Fetching course and lessons for slug:', course_slug);
  // Fetch course
  const course = await prisma.course.findUnique({
    where: { slug: course_slug },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      instructor: true,
      lessons: {
        orderBy: { sequenceNo: 'asc' },
        select: {
          id: true,
          slug: true,
          title: true,
          description: true,
          sequenceNo: true,
          duration: true,
          isPreview: true,
        },
      },
    },
  });
  if (!course) {
    console.log('[Server] No course found for slug:', course_slug);
    return { course: null, lessons: [], enrollmentData: null };
  }
  console.log('[Server] Course found:', course.title);

  // Fetch enrollment if userId exists
  let enrollmentData: EnrollmentData | null = null;
  if (userId) {
    console.log('[Server] Fetching enrollment for user:', userId);
    const enrollment = await prisma.enrollment.findFirst({
      where: { courseId: course.id, userId },
      select: {
        id: true,
        progress: true,
        lessonCompletions: {
          select: { lessonId: true },
        },
      },
    });
    if (enrollment) {
      console.log('[Server] Enrollment found for user:', userId);
      enrollmentData = {
        enrolled: true,
        progress: enrollment.progress,
        completedLessons: enrollment.lessonCompletions.map((lc: { lessonId: string }) => lc.lessonId),
      };
    } else {
      console.log('[Server] No enrollment found for user:', userId);
    }
  } else {
    console.log('[Server] No userId provided, skipping enrollment fetch.');
  }
  // Mark completed lessons
  const lessons = course.lessons.map((lesson: Lesson) => ({
    ...lesson,
    isCompleted: enrollmentData?.completedLessons?.includes(lesson.id) || false,
  }));
  console.log('[Server] Lessons fetched:', lessons.length);
  return { course, lessons, enrollmentData };
});

export default async function CourseLessonsPage({ params }: { params: Promise<{ course_slug: string }> }) {
  const { course_slug } = await params;
  // Get userId from 'auth-token' cookie (JWT)
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth-token')?.value;
  const userId = getUserIdFromAuthToken(authToken);

  const { course, lessons, enrollmentData } = await getCourseLessonsAndEnrollment(course_slug, userId);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Course Not Found</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">The course you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const completedCount = lessons.filter(l => l.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/courses/${course.slug}`}
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
            <Button asChild className="mt-3">
              <Link href={`/courses/${course.slug}`}>Enroll Now</Link>
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lessons.map((lesson) => {
            const isLocked = !enrollmentData?.enrolled && !lesson.isPreview;
            return (
              <div
                key={lesson.id}
                className={
                  `bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 transition-all duration-200 ` +
                  (isLocked
                    ? 'opacity-60 cursor-not-allowed'
                    : 'cursor-pointer hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500') +
                  (lesson.isCompleted
                    ? ' border-green-500 dark:border-green-600 bg-green-50 dark:bg-green-900/10'
                    : '')
                }
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
                      <Link
                        href={`/courses/${course.slug}/lessons/${lesson.slug}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                      >
                        <PlayCircle className="w-4 h-4" />
                        Start Lesson
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
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
  );
}
