import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET single lesson by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json({ error: 'Failed to fetch lesson' }, { status: 500 });
  }
}

// PUT update lesson by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const body = await request.json();
    const { slug, title, sequenceNo, content } = body;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        slug,
        title,
        sequenceNo,
        content,
      },
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

// DELETE lesson by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    await prisma.lesson.delete({
      where: { id: lessonId },
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
