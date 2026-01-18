import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/config/env';

// POST - Mark a lesson as complete
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const body = await request.json();
    const { lessonId } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Find the enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        lessonCompletions: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 404 });
    }

    // Check if already completed
    const alreadyCompleted = enrollment.lessonCompletions.some(
      lc => lc.lessonId === lessonId
    );

    if (alreadyCompleted) {
      return NextResponse.json({ message: 'Lesson already marked as complete' });
    }

    // Create lesson completion
    await prisma.lessonCompletion.create({
      data: {
        enrollmentId: enrollment.id,
        lessonId,
      },
    });

    // Get total lessons count for the course
    const totalLessons = await prisma.lesson.count({
      where: { courseId },
    });

    // Calculate new progress
    const completedCount = enrollment.lessonCompletions.length + 1;
    const progress = Math.round((completedCount / totalLessons) * 100);

    // Update enrollment progress
    const isCompleted = completedCount === totalLessons;
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: {
        progress,
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      message: 'Lesson marked as complete',
      progress,
      isCompleted,
    });
  } catch (error) {
    console.error('Error marking lesson as complete:', error);
    return NextResponse.json({ error: 'Failed to mark lesson as complete' }, { status: 500 });
  }
}
