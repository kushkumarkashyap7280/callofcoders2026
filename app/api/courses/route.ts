import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all courses
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST create a new course
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const course = await prisma.course.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        order: data.order || 0,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
