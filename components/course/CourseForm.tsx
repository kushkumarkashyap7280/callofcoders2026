'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CourseFormData {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  externalLink: string;
  tags: string[];
  isPublished: boolean;
  isFeatured: boolean;
  instructor: string;
  level: string;
  duration: string;
  price: number;
}

interface CourseFormProps {
  mode: 'new' | 'edit';
  initialData?: CourseFormData;
  onSubmit: (data: CourseFormData) => void;
  onDelete?: () => void;
  onDataChange?: (data: CourseFormData) => void;
}

export default function CourseForm({ mode, initialData, onSubmit, onDelete, onDataChange }: CourseFormProps) {
  const [formData, setFormData] = useState<CourseFormData>(
    initialData || {
      title: '',
      slug: '',
      description: '',
      imageUrl: '',
      externalLink: '',
      tags: [],
      isPublished: false,
      isFeatured: false,
      instructor: '',
      level: 'Beginner',
      duration: '',
      price: 0,
    }
  );
  const [tagInput, setTagInput] = useState('');
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

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
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
          placeholder="Enter course title"
          required
        />
      </div>

      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="course-url-slug"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the course"
          className="w-full min-h-24 p-3 border rounded-lg bg-background"
          required
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div>
        <Label htmlFor="externalLink">External Link (optional)</Label>
        <Input
          id="externalLink"
          value={formData.externalLink}
          onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
          placeholder="https://external-resource.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="instructor">Instructor Name</Label>
          <Input
            id="instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="level">Difficulty Level</Label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full p-2 border rounded-lg bg-background"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 4 weeks, 10 hours"
          />
        </div>

        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="0 for free"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Type tag and press Enter"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Press Enter to add tags
        </p>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
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

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isFeatured"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="isFeatured" className="cursor-pointer">
            Featured Course
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" className="flex-1" disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="animate-spin" size={18} />
              {mode === 'new' ? 'Creating...' : 'Updating...'}
            </span>
          ) : (
            mode === 'new' ? 'Create Course' : 'Update Course'
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
