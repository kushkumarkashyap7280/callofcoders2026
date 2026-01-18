'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import CourseForm from '@/components/course/CourseForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewCoursePage() {
  const router = useRouter();
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

  const handleSubmit = async (data: typeof formData) => {
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create course');
      }

      toast.success('Course created successfully!');
      router.push('/admin/courses');
      router.refresh();
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create course');
    }
  };

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
            Create New Course
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Fill in the course details below
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          <CourseForm
            mode="new"
            initialData={formData}
            onSubmit={handleSubmit}
            onDataChange={setFormData}
          />
        </div>
      </div>
    </div>
  );
}
