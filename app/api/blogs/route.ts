import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');

    const blogs = await prisma.blogs.findMany({
      where: published === 'true' ? { isPublished: true } : undefined,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// POST create new blog
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, content, author, isPublished } = body;

    const blog = await prisma.blogs.create({
      data: {
        title,
        slug,
        content,
        author,
        isPublished,
        publishedAt: isPublished ? new Date() : undefined,
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
