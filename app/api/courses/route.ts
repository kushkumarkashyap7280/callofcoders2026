import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const courses = await prisma.course.findMany({
      where: published === 'true' ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { lessons: true }
        }
      }
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST create new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, description, imageUrl, externalLink, tags, isPublished } = body;

    const course = await prisma.course.create({
      data: {
        slug,
        title,
        description,
        imageUrl: imageUrl || null,
        externalLink: externalLink || null,
        tags: tags || [],
        isPublished: isPublished || false,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
