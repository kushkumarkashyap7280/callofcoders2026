import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET lessons for a course by course slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course_slug: string }> }
) {
  try {
    const { course_slug } = await params;
    
    // First find the course by slug
    const course = await prisma.course.findUnique({
      where: { slug: course_slug },
      select: { id: true, title: true, slug: true }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Then get all lessons for that course
    const lessons = await prisma.lesson.findMany({
      where: { courseId: course.id },
      orderBy: { sequenceNo: 'asc' },
    });

    return NextResponse.json({
      course,
      lessons
    });
  } catch (error) {
    console.error('Error fetching lessons by course slug:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}
