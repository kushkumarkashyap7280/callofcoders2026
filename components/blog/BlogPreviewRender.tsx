'use client';

import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import CodeBlock from '@/components/blog/CodeBlock';
import BlogImage from '@/components/blog/BlogImage';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';

const components = {
  CodeBlock,
  BlogImage,
  CustomLink,
  CustomList,
};

interface BlogPreviewRenderProps {
  title: string;
  content: string;
  author: string;
  publishedAt?: string | null;
}

export default function BlogPreviewRender({ title, content, author, publishedAt }: BlogPreviewRenderProps) {
  const [mdxSource, setMdxSource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    
    if (content) {
      loadMDX();
    } else {
      setLoading(false);
    }
  }, [content]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
        {title || 'Untitled'}
      </h1>
      
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        By {author} • {publishedAt 
          ? new Date(publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
          : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        }
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {loading ? (
          <p className="text-zinc-500">Loading preview...</p>
        ) : error ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        ) : mdxSource ? (
          <MDXRemote {...mdxSource} components={components} />
        ) : (
          <p className="text-zinc-500">No content to preview...</p>
        )}
      </div>
    </div>
  );
}
