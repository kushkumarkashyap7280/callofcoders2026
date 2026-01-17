'use client';

import { useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import CodeBlock from '@/components/blog/CodeBlock';
import BlogImage from '@/components/blog/BlogImage';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';
import { X } from 'lucide-react';

const components = {
  CodeBlock,
  BlogImage,
  CustomLink,
  CustomList,
};

interface MDXPreviewProps {
  title: string;
  content: string;
  onClose: () => void;
}

export default function MDXPreview({ title, content, onClose }: MDXPreviewProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    const loadMDX = async () => {
      try {
        const mdx = await serialize(content);
        setMdxSource(mdx);
      } catch (err) {
        console.error('Error parsing MDX:', err);
        setError('Invalid MDX syntax. Please check your content.');
      } finally {
        setLoading(false);
      }
    };
    loadMDX();
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Preview: {title || 'Untitled'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <p className="text-zinc-500">Loading preview...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : mdxSource ? (
            <div className="prose dark:prose-invert max-w-none">
              <MDXRemote {...mdxSource} components={components} />
            </div>
          ) : (
            <p className="text-zinc-500">No content to preview...</p>
          )}
        </div>
      </div>
    </div>
  );
}
