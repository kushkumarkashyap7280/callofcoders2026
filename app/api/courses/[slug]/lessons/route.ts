import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all lessons for a course
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { 
        course: { slug: params.slug } 
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST create a new lesson for a course
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();
    
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        order: data.order || 0,
        courseId: course.id,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
