'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LessonForm from '@/components/course/LessonForm';
import LessonPreviewRender from '@/components/course/LessonPreviewRender';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* 
 lessons schema table

 model Lesson {
  id          String   @id @default(uuid())
  slug        String   // e.g. "setup-environment"
  title       String   // Needed for the sidebar
  description String?  // Short description for lesson overview
  sequenceNo  Int      @map("sequence_no")
  content     String   @db.Text // @db.Text is needed for long MDX strings
  duration    String?  // e.g., "15 min", "30 min"
  isPreview   Boolean  @default(false) @map("is_preview") // Free preview lessons
  videoUrl    String?  @map("video_url") // Optional video URL
  
  courseId    String   @map("course_id")
  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  completions LessonCompletion[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Unique constraint: A slug must be unique *within* a specific course, 
  // but two different courses can both have an "introduction" lesson.
  @@unique([courseId, slug])
  @@map("lessons")
  }
*/


export default function EditLessonPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; lessonId: string }> 
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState<string>('');
  const [lessonId, setLessonId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [course, setCourse] = useState<{ title: string } | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    description?: string;
    sequenceNo: number;
    content: string;
    duration?: string;
    isPreview: boolean;
    videoUrl?: string;
  }>({
    title: '',
    slug: '',
    description: '',
    sequenceNo: 1,
    content: '',
    duration: '',
    isPreview: false,
    videoUrl: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ courseId, lessonId }) => {
      setCourseId(courseId);
      setLessonId(lessonId);
      fetchLesson(lessonId);
    });
  }, [params]);

  const fetchLesson = async (id: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId || 'temp'}/lessons/${id}`);
      console.log('Fetching lesson with ID so in edit form :', id);
      if (!response.ok) throw new Error('Failed to fetch lesson');
      
      const lesson = await response.json();
      console.log('Fetched lesson data:', lesson);
      setFormData({
        title: lesson.title,
        slug: lesson.slug,
        description: lesson.description || '',
        sequenceNo: lesson.sequenceNo,
        content: lesson.content,
        duration: lesson.duration || '',
        isPreview: lesson.isPreview || false,
        videoUrl: lesson.videoUrl || '',
      });
      
      if (lesson.course) {
        setCourse({ title: lesson.course.title });
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      toast.error('Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: { title: string; slug: string; description?: string; sequenceNo: number; content: string; duration?: string; isPreview: boolean; videoUrl?: string; }) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update lesson');

      toast.success('Lesson updated successfully!');
      router.push(`/admin/courses/${courseId}/lessons`);
      router.refresh();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error('Failed to update lesson. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete lesson');

      toast.success('Lesson deleted successfully!');
      router.push(`/admin/courses/${courseId}/lessons`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error('Failed to delete lesson. Please try again.');
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
                Edit Lesson
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
              mode="edit"
              courseId={courseId}
              initialData={formData}
              onSubmit={handleSubmit}
              onDelete={handleDelete}
              onDataChange={setFormData}
            />
          )}
        </div>
      </div>
    </div>
  );
}
