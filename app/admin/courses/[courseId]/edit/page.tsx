'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CourseForm from '@/components/course/CourseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    externalLink: '',
    tags: [] as string[],
    isPublished: false,
    isFeatured: false,
    instructor: '',
    level: 'Beginner',
    duration: '',
    price: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ courseId }) => {
      setCourseId(courseId);
      fetchCourse(courseId);
    });
  }, [params]);

  const fetchCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const course = await response.json();
      setFormData({
        title: course.title,
        slug: course.slug,
        description: course.description,
        imageUrl: course.imageUrl || '',
        externalLink: course.externalLink || '',
        tags: course.tags || [],
        isPublished: course.isPublished,
        isFeatured: course.isFeatured || false,
        instructor: course.instructor || '',
        level: course.level || 'Beginner',
        duration: course.duration || '',
        price: course.price || 0,
      });
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update course');

      toast.success('Course updated successfully!');
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all lessons.')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete course');

      toast.success('Course deleted successfully!');
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Courses
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Edit Course
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Modify the course details below
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <CourseForm
            mode="edit"
            initialData={formData}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
            onDataChange={setFormData}
          />
        </div>
      </div>
    </div>
  );
}
