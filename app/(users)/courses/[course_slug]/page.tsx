// Revalidate this page every 5 minutes (300 seconds)
export const revalidate = 300;
// server component
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Course } from '@/types';
import ShowCourseDetails from '@/components/course/ShowCourseDetails';
import { cache } from 'react';

interface EnrollmentStatus {
  enrolled: boolean;
  enrollment: {
    id: string;
    enrolledAt: string;
    progress: number;
    isCompleted: boolean;
  } | null;
}

type Props = {
  params: Promise<{ course_slug: string }>
};

// Cache the course fetch by slug
const getCourseBySlug = cache(async (course_slug: string) => {
   console.log('Fetching course with slug:', course_slug);
  return prisma.course.findUnique({
    where: { slug: course_slug },
    include: {
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
  });
});
  


//dynamic metadata
export async function generateMetadata({ params }: Props) {
  const { course_slug } = await params;
  const course = await getCourseBySlug(course_slug);
  if (!course) {
    return {
      title: 'Course Not Found',
      description: 'The requested course does not exist.',
    };
  }
  return {
    title: course.title,
    description: course.description || 'Explore this course on our platform.',
  };
}

interface lesson {
  slug: string;
  title: string;

}

export default async function CoursePage({ params }: Props) {
  const { course_slug } = await params;
  const course: Course | null = await getCourseBySlug(course_slug);
  if (!course) {
    return <div>Course not found</div>;
  }
  return (<ShowCourseDetails course={course} />);
}


