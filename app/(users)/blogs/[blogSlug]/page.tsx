import { notFound } from 'next/navigation';
import CodeBlock from '@/components/blog/CodeBlock';
import BlogImage from '@/components/blog/BlogImage';
import CustomLink from '@/components/blog/CustomLink';
import CustomList from '@/components/blog/CustomList';

const mockBlogs = [
  {
    slug: 'nextjs-magic',
    title: 'Next.js Magic: Unlocking SSR',
    content: (
      <>
        <h1>Next.js Magic: Unlocking SSR</h1>
        <p>This blog demonstrates how to use <CustomLink href="https://nextjs.org" color="purple">Next.js</CustomLink> for server-side rendering.</p>
        <CodeBlock language="js" code={`export async function getServerSideProps() {\n  return { props: {} }\n}`} />
        <BlogImage src="https://nextjs.org/static/twitter-cards/home.jpg" alt="Next.js" css="w-1/2" />
        <CustomList heading="SSR Benefits" items={["SEO Friendly", "Faster Load", "Dynamic Data"]} />
      </>
    ),
  },
  {
    slug: 'react-mdx-power',
    title: 'React + MDX: Power Content',
    content: (
      <>
        <h1>React + MDX: Power Content</h1>
        <p>MDX lets you use React components like <strong>CodeBlock</strong> and <strong>CustomList</strong> in your markdown.</p>
        <CodeBlock language="jsx" code={`<CustomList heading=\"Features\" items={[\"JSX\", \"Markdown\", \"Components\"]} />`} />
        <CustomList heading="Features" items={["JSX", "Markdown", "Components"]} ordered />
      </>
    ),
  },
  {
    slug: 'custom-components-mdx',
    title: 'Custom Components in MDX',
    content: (
      <>
        <h1>Custom Components in MDX</h1>
        <p>Showcase of <CodeBlock language="js" code={`console.log('Custom!')`} /> and <BlogImage src="https://placehold.co/600x200" alt="Demo" />.</p>
        <CustomList heading="Why use custom components?" items={["Reusable", "Consistent", "Powerful"]} listStyle="none" />
      </>
    ),
  },
];

export default function BlogPage({ params }: { params: { blogSlug: string } }) {
  const blog = mockBlogs.find((b) => b.slug === params.blogSlug);
  if (!blog) return notFound();
  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {blog.content}
    </div>
  );
}
