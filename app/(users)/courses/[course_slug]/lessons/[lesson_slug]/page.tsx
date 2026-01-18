'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import CodeBlock from '@/components/blog/CodeBlock';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';
import BlogImage from '@/components/blog/BlogImage';

const components = {
  code: CodeBlock,
  a: CustomLink,
  ul: CustomList,
  ol: CustomList,
  CustomLink,
  CustomList,
  BlogImage,
};

interface Lesson {
  id: string;
  slug: string;
  title: string;
  sequenceNo: number;
  content: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

interface NavigationLesson {
  id: string;
  slug: string;
  title: string;
  sequenceNo: number;
}

export default function LessonPage({ 
  params 
}: { 
  params: Promise<{ course_slug: string; lesson_slug: string }> 
}) {
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [lessonSlug, setLessonSlug] = useState<string>('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [navigation, setNavigation] = useState<{
    previous: NavigationLesson | null;
    next: NavigationLesson | null;
  }>({ previous: null, next: null });
  const [allLessons, setAllLessons] = useState<NavigationLesson[]>([]);
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ course_slug, lesson_slug }) => {
      setCourseSlug(course_slug);
      setLessonSlug(lesson_slug);
      fetchLesson(course_slug, lesson_slug);
    });
  }, [params]);

  useEffect(() => {
    if (lesson) {
      compileMDX(lesson.content);
    }
  }, [lesson]);

  const compileMDX = async (content: string) => {
    try {
      const serialized = await serialize(content || '');
      setMdxSource(serialized);
    } catch (err) {
      console.error('MDX compilation error:', err);
    }
  };

  const fetchLesson = async (course_slug: string, lesson_slug: string) => {
    try {
      const response = await fetch(`/api/courses/slug/${course_slug}/lessons/${lesson_slug}`);
      if (!response.ok) throw new Error('Failed to fetch lesson');
      const data = await response.json();
      setLesson(data.lesson);
      setNavigation(data.navigation);
      setAllLessons(data.allLessons);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Lesson not found</p>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const progressPercentage = allLessons.length > 0 ? ((currentIndex + 1) / allLessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Video Section - Optional, can be embedded in MDX content */}
      <div className="bg-linear-to-br from-blue-50 to-purple-50 dark:from-zinc-800 dark:to-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
            <span className="text-sm font-medium">Lesson {lesson.sequenceNo}</span>
            <span className="text-zinc-300 dark:text-zinc-600">•</span>
            <span className="text-sm">{lesson.course.title}</span>
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
                href={`/courses/${lesson.course.slug}`}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                {lesson.course.title}
              </Link>
              <span className="mx-2">/</span>
              <Link 
                href={`/courses/${lesson.course.slug}/lessons`}
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
              {mdxSource ? (
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <MDXRemote {...mdxSource} components={components} />
                </div>
              ) : (
                <p className="text-zinc-600 dark:text-zinc-400">Loading content...</p>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              {navigation.previous ? (
                <Link
                  href={`/courses/${lesson.course.slug}/lessons/${navigation.previous.slug}`}
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
                  href={`/courses/${lesson.course.slug}/lessons/${navigation.next.slug}`}
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
                Course Navigation
              </h3>
              <div className="space-y-4">
                <Link
                  href={`/courses/${lesson.course.slug}/lessons`}
                  className="block w-full text-center bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  View All Lessons
                </Link>
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
