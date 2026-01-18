'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import CodeBlock from '@/components/blog/CodeBlock';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';
import BlogImage from '@/components/blog/BlogImage';

interface LessonPreviewRenderProps {
  title: string;
  content: string;
  sequenceNo: number;
}

const components = {
  code: CodeBlock,
  a: CustomLink,
  ul: CustomList,
  ol: CustomList,
  CustomLink,
  CustomList,
  BlogImage,
};

export default function LessonPreviewRender({ title, content, sequenceNo }: LessonPreviewRenderProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const compileMDX = async () => {
      try {
        setError(null);
        const serialized = await serialize(content || '');
        setMdxSource(serialized);
      } catch (err) {
        console.error('MDX compilation error:', err);
        setError('Failed to compile MDX content. Check syntax.');
      }
    };

    compileMDX();
  }, [content]);

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      {/* Lesson Header */}
      <div className="not-prose mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-3 mb-3">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">
            {sequenceNo}
          </span>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 m-0">
            {title || 'Untitled Lesson'}
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 m-0">
          Lesson Preview
        </p>
      </div>

      {/* MDX Content */}
      {error ? (
        <div className="not-prose p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      ) : mdxSource ? (
        <MDXRemote {...mdxSource} components={components} />
      ) : (
        <div className="not-prose p-8 text-center">
          <p className="text-zinc-400 dark:text-zinc-500">Start writing to see preview...</p>
        </div>
      )}
    </div>
  );
}
