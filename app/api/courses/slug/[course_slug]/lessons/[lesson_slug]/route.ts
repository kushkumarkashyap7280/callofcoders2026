import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET lesson by course slug and lesson slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course_slug: string; lesson_slug: string }> }
) {
  try {
    const { course_slug, lesson_slug } = await params;
    
    // Find the lesson with its course
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: lesson_slug,
        course: { slug: course_slug }
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Get all lessons for navigation
    const allLessons = await prisma.lesson.findMany({
      where: { courseId: lesson.courseId },
      orderBy: { sequenceNo: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        sequenceNo: true
      }
    });

    // Find previous and next lessons
    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    const previous = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const next = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    return NextResponse.json({
      lesson,
      navigation: {
        previous,
        next
      },
      allLessons
    });
  } catch (error) {
    console.error('Error fetching lesson by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}
