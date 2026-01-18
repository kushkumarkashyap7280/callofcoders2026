import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET course by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ course_slug: string }> }
) {
  try {
    const { course_slug } = await params;
    const course = await prisma.course.findUnique({
      where: { slug: course_slug },
      include: {
        _count: {
          select: { 
            lessons: true,
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course by slug:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}
