import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; lessonSlug: string } }
) {
  try {
    const lesson = await prisma.lesson.findFirst({
      where: {
        slug: params.lessonSlug,
        course: { slug: params.slug },
      },
      include: {
        course: true,
      },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}

// PATCH update lesson
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string; lessonSlug: string } }
) {
  try {
    const data = await request.json();
    
    const lesson = await prisma.lesson.updateMany({
      where: {
        slug: params.lessonSlug,
        course: { slug: params.slug },
      },
      data,
    });

    return NextResponse.json(lesson);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
}

// DELETE lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; lessonSlug: string } }
) {
  try {
    await prisma.lesson.deleteMany({
      where: {
        slug: params.lessonSlug,
        course: { slug: params.slug },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  }
}
