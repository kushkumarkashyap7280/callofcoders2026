'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string | null;
  externalLink: string | null;
  tags: string[];
  isPublished: boolean;
  instructor: string | null;
  level: string | null;
  duration: string | null;
  price: number | null;
  createdAt: string;
  updatedAt: string;
  _count: {
    lessons: number;
    enrollments: number;
  };
}

interface EnrollmentStatus {
  enrolled: boolean;
  enrollment: {
    id: string;
    enrolledAt: string;
    progress: number;
    isCompleted: boolean;
  } | null;
}

export default function CoursePage({ params }: { params: Promise<{ course_slug: string }> }) {
  const router = useRouter();
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus>({ enrolled: false, enrollment: null });
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    params.then(({ course_slug }) => {
      setCourseSlug(course_slug);
      fetchCourse(course_slug);
    });
  }, [params]);

  const fetchCourse = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/courses');
          return;
        }
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      setCourse(data);
      
      // Check enrollment status
      if (data.id) {
        checkEnrollment(data.id);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (courseId: string) => {
    try {
      const response = await fetch(`/api/enrollments/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setEnrollmentStatus(data);
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    setEnrolling(true);
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      if (response.ok) {
        await checkEnrollment(course.id);
        toast.success('Successfully enrolled in course!');
        router.push(`/courses/${course.slug}/lessons`);
      } else {
        const data = await response.json();
        if (response.status === 401) {
          toast.error('Please login to enroll in this course');
          router.push('/login');
        } else {
          toast.error(data.error || 'Failed to enroll in course');
        }
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading course...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Course not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Course Header */}
      <div className="bg-linear-to-r from-blue-500 to-purple-600 rounded-lg p-6 sm:p-8 mb-8 text-white">
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
              <span>📚 {course._count.lessons} lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥 {course._count.enrollments.toLocaleString()} enrolled</span>
            </div>
            {course.level && (
              <div className="flex items-center gap-2">
                <span>📊 {course.level}</span>
              </div>
            )}
            {course.duration && (
              <div className="flex items-center gap-2">
                <span>⏱️ {course.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <span>📅 Updated {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
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
              {course.instructor && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Instructor</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{course.instructor}</span>
                </div>
              )}
              {course.level && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Level</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{course.level}</span>
                </div>
              )}
              {course.duration && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Duration</span>
                  <span className="text-zinc-900 dark:text-zinc-100">{course.duration}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Lessons</span>
                <span className="text-zinc-900 dark:text-zinc-100">{course._count.lessons}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Enrolled</span>
                <span className="text-zinc-900 dark:text-zinc-100">{course._count.enrollments.toLocaleString()}</span>
              </div>
              {course.price !== null && (
                <div className="flex justify-between">
                  <span className="text-zinc-600 dark:text-zinc-400">Price</span>
                  <span className="text-zinc-900 dark:text-zinc-100 font-semibold">
                    {course.price === 0 ? 'Free' : `$${course.price}`}
                  </span>
                </div>
              )}
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
                  {new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-600 dark:text-zinc-400">Last Updated</span>
                <span className="text-zinc-900 dark:text-zinc-100">
                  {new Date(course.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              {enrollmentStatus.enrolled ? (
                <>
                  <Link
                    href={`/courses/${course.slug}/lessons`}
                    className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    {enrollmentStatus.enrollment?.isCompleted 
                      ? 'Review Course' 
                      : 'Continue Learning'}
                  </Link>
                  {enrollmentStatus.enrollment && (
                    <div className="text-center">
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                        Progress: {enrollmentStatus.enrollment.progress}%
                      </p>
                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${enrollmentStatus.enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    {enrolling ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Enrolling...
                      </>
                    ) : (
                      course.price && course.price > 0 ? `Enroll - $${course.price}` : 'Enroll for Free'
                    )}
                  </button>
                  <Link
                    href={`/courses/${course.slug}/lessons`}
                    className="w-full block text-center bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Preview Lessons
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
