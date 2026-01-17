import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { MDXRemote } from 'next-mdx-remote/rsc';
import CodeBlock from '@/components/blog/CodeBlock';
import BlogImage from '@/components/blog/BlogImage';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';
import prisma from '@/lib/prisma';
import Link from 'next/link';

const components = {
  CodeBlock,
  BlogImage,
  CustomLink,
  CustomList,
};

export default async function BlogPage({ params }: { params: Promise<{ blogSlug: string }> }) {
  const { blogSlug } = await params;
  const blog = await prisma.blogs.findUnique({
    where: { slug: blogSlug, isPublished: true },
  });
  if (!blog) return notFound();

  // Use a client component for the back button

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
       <Link href="/blogs" className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block">
        &larr; Back to all blogs
      </Link>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        By {blog.author} • {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
      </div>
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={blog.content} components={components} />
      </div>
    </div>
  );
}
