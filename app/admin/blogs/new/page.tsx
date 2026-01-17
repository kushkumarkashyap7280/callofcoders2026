'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BlogForm from '@/components/blog/BlogForm';
import BlogPreviewRender from '@/components/blog/BlogPreviewRender';
import { ArrowLeft } from 'lucide-react';

export default function NewBlogPage() {
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    author: '',
    content: '',
    isPublished: false,
  });

  const handleSubmit = async (data: typeof formData) => {
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog');
      }

      toast.success('Blog created successfully!');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error creating blog:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create blog');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Create New Blog Post
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Write your blog content in MDX format
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="gap-2"
          >
            {showPreview ? (
              <>
                <ArrowLeft size={16} />
                Back to Edit
              </>
            ) : (
              'Preview'
            )}
          </Button>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6">
          {showPreview ? (
            <BlogPreviewRender
              title={formData.title}
              content={formData.content}
              author={formData.author}
              publishedAt={formData.isPublished ? new Date().toISOString() : null}
            />
          ) : (
            <BlogForm
              mode="new"
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
