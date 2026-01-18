'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


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

interface LessonFormData {
  title: string;
  slug: string;
  description?: string;
  sequenceNo: number;
  content: string;
  duration?: string;
  isPreview: boolean;
  videoUrl?: string;
}

interface LessonFormProps {
  mode: 'new' | 'edit';
  courseId: string;
  initialData?: LessonFormData;
  onSubmit: (data: LessonFormData) => Promise<unknown> | void;
  onDelete?: () => void;
  onDataChange?: (data: LessonFormData) => void;
}

export default function LessonForm({ 
  mode, 
  courseId,
  initialData,
  onSubmit,
  onDelete,
  onDataChange
}: LessonFormProps) {
  const [formData, setFormData] = useState<LessonFormData>(
    initialData || {
      title: '',
      slug: '',
      description: undefined,
      sequenceNo: 1,
      content: '',
      duration: undefined,
      isPreview: false,
      videoUrl: undefined,
    }
  );
  const [loading, setLoading] = useState(false);

  // Notify parent of data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    const newSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setFormData({ ...formData, title: newTitle, slug: newSlug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="title">Lesson Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Enter lesson title"
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="lesson-url-slug"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || undefined })}
          placeholder="Brief description of this lesson"
          className="w-full min-h-20 p-3 border rounded-lg bg-background"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sequenceNo">Sequence Number</Label>
        <Input
          id="sequenceNo"
          type="number"
          min="1"
          value={formData.sequenceNo}
          onChange={(e) => setFormData({ ...formData, sequenceNo: parseInt(e.target.value) || 1 })}
          placeholder="1"
          required
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Order in which this lesson appears in the course
        </p>
      </div>

        <div>
          <Label htmlFor="duration">Duration (optional)</Label>
          <Input
            id="duration"
            value={formData.duration || ''}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value || undefined })}
            placeholder="e.g., 15 min, 30 min"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="videoUrl">Video URL (optional)</Label>
        <Input
          id="videoUrl"
          value={formData.videoUrl || ''}
          onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value || undefined })}
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPreview"
          checked={formData.isPreview}
          onChange={(e) => setFormData({ ...formData, isPreview: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="isPreview" className="cursor-pointer">
          Free Preview (accessible to non-enrolled students)
        </Label>
      </div>

      <div>
        <Label htmlFor="content">Content (MDX)</Label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your lesson content in MDX format..."
          className="w-full min-h-96 p-3 border rounded-lg bg-background font-mono text-sm"
          required
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Use MDX syntax for rich content with code blocks, headings, lists, etc.
        </p>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" size={18} />
              {mode === 'new' ? 'Creating...' : 'Updating...'}
            </span>
          ) : (
            mode === 'new' ? 'Create Lesson' : 'Update Lesson'
          )}
        </Button>
        {mode === 'edit' && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="gap-2"
            disabled={loading}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
