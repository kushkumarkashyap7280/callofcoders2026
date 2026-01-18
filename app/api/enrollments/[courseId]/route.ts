import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/config/env';

// GET - Check enrollment status for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ enrolled: false, enrollment: null });
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      include: {
        lessonCompletions: {
          select: {
            lessonId: true,
            completedAt: true,
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json({ 
        enrolled: false, 
        enrollment: null,
        completedLessons: []
      });
    }

    return NextResponse.json({
      enrolled: true,
      enrollment,
      progress: enrollment.progress,
      completedLessons: enrollment.lessonCompletions.map(lc => lc.lessonId),
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json({ error: 'Failed to check enrollment' }, { status: 500 });
  }
}

// DELETE - Unenroll from a course
export async function DELETE(
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

    await prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return NextResponse.json({ message: 'Successfully unenrolled from course' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return NextResponse.json({ error: 'Failed to unenroll from course' }, { status: 500 });
  }
}
