// app/courses/[courseSlug]/[lessonSlug]/page.tsx
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

// 1. Import your DB client (Adjust path if your prisma instance is elsewhere)
import prisma from "@/app/lib/prisma";

// 2. Import Client Components you want to use inside MDX
// (Make sure these paths exist in your project, or comment them out for now)
import { Button } from "@/components/ui/button"; 
import CodeBlock from "@/components/CodeBlock";   // The one we discussed earlier
import Quiz from "@/components/Quiz";             // The one we discussed earlier

// 3. Define the component map
// This tells MDX: "When you see <Button> in the DB text, render this React component"
const components = {
  Button: (props: any) => <Button {...props} />, // Shadcn Button
  Quiz: Quiz,
  
  // Custom mapping for code blocks to use your Copy logic
  pre: CodeBlock, 
};

type Props = {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
};

export default async function LessonPage({ params }: Props) {
  // Await params (Required in Next.js 15+)
  const { courseSlug, lessonSlug } = await params;

  // 4. Fetch the specific lesson
  const lesson = await prisma.lesson.findFirst({
    where: {
      slug: lessonSlug,
      course: {
        slug: courseSlug, // Ensures this lesson belongs to the correct course
      },
    },
    include: {
      course: true, // Optional: Include course details if you need them for a "Back" button
    },
  });

  // 5. Handle invalid URLs
  if (!lesson) {
    return notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="mb-8">
        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
          {lesson.course.title}
        </p>
        <h1 className="text-4xl font-bold text-gray-900">{lesson.title}</h1>
      </div>

      {/* 6. Render the MDX Content */}
      <article className="prose prose-slate lg:prose-lg dark:prose-invert">
        <MDXRemote 
          source={lesson.content} 
          components={components} 
        />
      </article>
    </div>
  );
}