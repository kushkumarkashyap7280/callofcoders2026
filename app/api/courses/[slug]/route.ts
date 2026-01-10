import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single course by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.slug },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PATCH update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const data = await request.json();
    
    const course = await prisma.course.update({
      where: { slug: params.slug },
      data,
    });

    return NextResponse.json(course);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE course
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.course.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
