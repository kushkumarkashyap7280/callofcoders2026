'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import BlogForm from '@/components/blog/BlogForm';
import BlogPreviewRender from '@/components/blog/BlogPreviewRender';
import { ArrowLeft } from 'lucide-react';

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [blogId, setBlogId] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    author: '',
    isPublished: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ id }) => {
      setBlogId(id);
      fetchBlog(id);
    });
  }, [params]);

  const fetchBlog = async (id: string) => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) throw new Error('Failed to fetch blog');
      
      const blog = await response.json();
      setFormData({
        title: blog.title,
        slug: blog.slug,
        content: blog.content,
        author: blog.author,
        isPublished: blog.isPublished,
      });
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: typeof formData) => {
    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update blog');

      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete blog');

      toast.success('Blog deleted successfully!');
      router.push('/admin/blogs');
      router.refresh();
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog. Please try again.');
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              Edit Blog Post
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">
              Modify your blog content in MDX format
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
              mode="edit"
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
