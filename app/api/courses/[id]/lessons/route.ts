import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all lessons for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lessons = await prisma.lesson.findMany({
      where: { courseId: id },
      orderBy: { sequenceNo: 'asc' },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 });
  }
}

// POST create new lesson for a course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, title, sequenceNo, content, description, duration, isPreview, videoUrl } = body;

    const lesson = await prisma.lesson.create({
      data: {
        slug,
        title,
        sequenceNo,
        content,
        // Optional fields - only set when provided
        description: description ?? undefined,
        duration: duration ?? undefined,
        isPreview: typeof isPreview === 'boolean' ? isPreview : undefined,
        videoUrl: videoUrl ?? undefined,
        courseId: id,
      },
    });

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}
