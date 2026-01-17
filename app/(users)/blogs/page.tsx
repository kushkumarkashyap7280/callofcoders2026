'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch('/api/blogs?published=true');
      const data = await response.json();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4">
        <p className="text-zinc-600 dark:text-zinc-400">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      {blogs.length === 0 ? (
        <div className="p-12 text-center border rounded-lg">
          <p className="text-zinc-600 dark:text-zinc-400">No published blogs yet. Check back soon!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="p-6 rounded-lg border bg-white dark:bg-zinc-900">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/blogs/${blog.slug}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {blog.title}
                </Link>
              </h2>
              <p className="text-zinc-600 dark:text-zinc-300 mb-2">
                {blog.content.substring(0, 150).replace(/<[^>]*>/g, '')}...
              </p>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>By {blog.author}</span>
                <span>•</span>
                <span>
                  {blog.publishedAt 
                    ? new Date(blog.publishedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : new Date(blog.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
