'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Lesson {
  id: string;
  slug: string;
  title: string;
  sequenceNo: number;
  content: string;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: string;
  title: string;
  slug: string;
}

export default function AdminCourseLessonsPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  const [courseId, setCourseId] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ courseId }) => {
      setCourseId(courseId);
      fetchCourse(courseId);
      fetchLessons(courseId);
    });
  }, [params]);

  const fetchCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    }
  };

  const fetchLessons = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}/lessons`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lesson');

      toast.success('Lesson deleted successfully!');
      fetchLessons(courseId);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson');
    }
  };

  // Reordering removed — sequence managed elsewhere

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Manage Lessons
              </h1>
              {course && (
                <p className="text-zinc-600 dark:text-zinc-400">
                  {course.title}
                </p>
              )}
            </div>
            <Link
              href={`/admin/courses/${courseId}/lessons/new`}
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Lesson
            </Link>
          </div>
        </div>

        {/* Lessons Count */}
        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 mb-6">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Lessons</p>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{lessons.length}</p>
        </div>

        {/* Lessons List */}
        {lessons.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">No lessons yet</p>
            <Link
              href={`/admin/courses/${courseId}/lessons/new`}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add First Lesson
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Sequence Number */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">
                      {lesson.sequenceNo}
                    </span>
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      Slug: <code className="text-xs bg-zinc-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
                        {lesson.slug}
                      </code>
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Updated {new Date(lesson.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions: Edit and Delete only */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href={`/admin/courses/${courseId}/lessons/${lesson.id}/edit`}
                      className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
