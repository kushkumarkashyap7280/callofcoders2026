import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { getJwtSecret } from '@/config/env';

// POST - Enroll in a course
export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isPublished) {
      return NextResponse.json({ error: 'Course is not published' }, { status: 400 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        lastAccessedAt: new Date(),
      },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    });

    return NextResponse.json({ 
      message: 'Successfully enrolled in course',
      enrollment 
    }, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json({ error: 'Failed to enroll in course' }, { status: 500 });
  }
}

// GET - Get user's enrollments
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(getJwtSecret());
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id as string;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            slug: true,
            title: true,
            description: true,
            imageUrl: true,
            tags: true,
            _count: {
              select: { lessons: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json({ error: 'Failed to fetch enrollments' }, { status: 500 });
  }
}
