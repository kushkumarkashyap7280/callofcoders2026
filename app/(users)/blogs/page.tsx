import Link from 'next/link';

const mockBlogs = [
  {
    slug: 'nextjs-magic',
    title: 'Next.js Magic: Unlocking SSR',
    summary: 'A deep dive into SSR with Next.js and how it powers modern web apps.',
    date: '2026-01-10',
  },
  {
    slug: 'react-mdx-power',
    title: 'React + MDX: Power Content',
    summary: 'How MDX lets you use React components in your markdown content.',
    date: '2026-01-08',
  },
  {
    slug: 'custom-components-mdx',
    title: 'Custom Components in MDX',
    summary: 'Showcase of custom blog components like CodeBlock, Image, and more.',
    date: '2026-01-05',
  },
];

export default function BlogsPage() {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">All Blogs</h1>
      <div className="space-y-6">
        {mockBlogs.map((blog) => (
          <div key={blog.slug} className="p-6 rounded-lg border bg-white dark:bg-zinc-900">
            <h2 className="text-xl font-semibold mb-2">
              <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 mb-2">{blog.summary}</p>
            <span className="text-xs text-zinc-400">{blog.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
