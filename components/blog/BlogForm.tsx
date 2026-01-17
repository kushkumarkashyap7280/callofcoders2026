'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2 } from 'lucide-react';

interface BlogFormData {
  title: string;
  slug: string;
  author: string;
  content: string;
  isPublished: boolean;
}

interface BlogFormProps {
  mode: 'new' | 'edit';
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => void;
  onDelete?: () => void;
  onDataChange?: (data: BlogFormData) => void;
}


export default function BlogForm({ mode, initialData, onSubmit, onDelete, onDataChange }: BlogFormProps) {
  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: '',
      slug: '',
      author: '',
      content: '',
      isPublished: false,
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
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={handleTitleChange}
          placeholder="Enter blog title"
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="blog-url-slug"
          required
        />
      </div>

      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={formData.author}
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          placeholder="Author name"
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content (MDX)</Label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Write your MDX content here..."
          className="w-full min-h-75 p-3 border rounded-lg bg-background font-mono text-sm"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          checked={formData.isPublished}
          onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
          className="w-4 h-4"
        />
        <Label htmlFor="isPublished" className="cursor-pointer">
          Published
        </Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" size={18} />
              {mode === 'new' ? 'Creating...' : 'Updating...'}
            </span>
          ) : (
            mode === 'new' ? 'Create Blog' : 'Update Blog'
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
