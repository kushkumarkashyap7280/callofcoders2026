'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LessonForm from '@/components/course/LessonForm';
import LessonPreviewRender from '@/components/course/LessonPreviewRender';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewLessonPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [course, setCourse] = useState<{ title: string } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    sequenceNo: 1,
    content: '',
    duration: '',
    isPreview: false,
    videoUrl: '',
  });

  useEffect(() => {
    params.then(({ courseId }) => {
      setCourseId(courseId);
      fetchCourse(courseId);
      fetchNextSequenceNo(courseId);
    });
  }, [params]);

  const fetchCourse = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      const data = await response.json();
      setCourse({ title: data.title });
    } catch (error) {
      console.error('Error fetching course:', error);
      toast.error('Failed to load course');
    }
  };

  const fetchNextSequenceNo = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${id}/lessons`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const lessons = await response.json();
      const nextSeq = lessons.length > 0 ? Math.max(...lessons.map((l: any) => l.sequenceNo)) + 1 : 1;
      setFormData(prev => ({ ...prev, sequenceNo: nextSeq }));
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create lesson');
      }

      toast.success('Lesson created successfully!');
      router.push(`/admin/courses/${courseId}/lessons`);
      router.refresh();
    } catch (error) {
      console.error('Error creating lesson:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create lesson');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href={`/admin/courses/${courseId}/lessons`}
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Lessons
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Create New Lesson
              </h1>
              {course && (
                <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                  for {course.title}
                </p>
              )}
            </div>
            
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg transition-colors"
            >
              {showPreview ? (
                <>
                  <ArrowLeft size={16} />
                  Back to Edit
                </>
              ) : (
                'Preview'
              )}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          {showPreview ? (
            <LessonPreviewRender
              title={formData.title}
              content={formData.content}
              sequenceNo={formData.sequenceNo}
            />
          ) : (
            <LessonForm
              mode="new"
              courseId={courseId}
              initialData={formData}
              onSubmit={handleSubmit}
              onDataChange={setFormData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
