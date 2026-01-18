// server component
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Course } from '@/types';
import ShowCourseDetails from '@/components/course/ShowCourseDetails';

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
}
  

//dynamic metadata
export async function generateMetadata({ params }: Props) {

  const course = await prisma.course.findUnique({
    where: { slug: (await params).course_slug },
  });

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



export default async function CoursePage({ params }: Props) {
  // 2. Await the params object
  const { course_slug } = await params;

  // Fetch course data from the API
  const course: Course | null = await prisma.course.findUnique({
    where: { slug: course_slug },
    include: {
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
  });

  if (!course) {
    return <div>Course not found</div>;


  }

  return (<ShowCourseDetails course={course} />);

}


