'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Lesson {
  id: string;
  slug: string;
  title: string;
  sequenceNo: number;
  content: string;
}

interface Course {
  id: string;
  slug: string;
  title: string;
}

export default function CourseLessonsPage({ params }: { params: Promise<{ course_slug: string }> }) {
  const [courseSlug, setCourseSlug] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ course_slug }) => {
      setCourseSlug(course_slug);
      fetchLessons(course_slug);
    });
  }, [params]);

  const fetchLessons = async (slug: string) => {
    try {
      const response = await fetch(`/api/courses/slug/${slug}/lessons`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setCourse(data.course);
      setLessons(data.lessons);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading lessons...</p>
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
        {lessons.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-400">No lessons available yet</p>
          </div>
        ) : (
          lessons.map((lesson) => (
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
                    {lesson.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
