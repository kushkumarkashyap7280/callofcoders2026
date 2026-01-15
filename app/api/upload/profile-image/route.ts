/**
 * API Route: Upload Profile Image
 * Handles profile image uploads to Cloudinary
 */

import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import cloudinary, { UPLOAD_CONFIG } from '@/lib/cloudinary';
import prisma from '@/lib/prisma';
import { getJwtSecret } from '@/config/env';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token');

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token.value, getJwtSecret()) as {
        id: string;
        email: string;
      };
      userId = decoded.id;
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !(UPLOAD_CONFIG.ALLOWED_FORMATS as readonly string[]).includes(fileExtension)) {
      return NextResponse.json(
        { error: `Invalid file format. Allowed formats: ${UPLOAD_CONFIG.ALLOWED_FORMATS.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if user exists and has an existing profile image
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { cloudinaryImageId: true, profileImageUrl: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete old image from Cloudinary if it exists
    if (user.cloudinaryImageId) {
      try {
        await cloudinary.uploader.destroy(user.cloudinaryImageId);
        console.log('Deleted old profile image:', user.cloudinaryImageId);
      } catch (deleteError) {
        console.error('Failed to delete old image:', deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64Data}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
      folder: UPLOAD_CONFIG.FOLDER,
      resource_type: 'image',
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ],
    });

    // Update user in database with new image URL and public ID
    await prisma.user.update({
      where: { id: userId },
      data: {
        profileImageUrl: uploadResponse.secure_url,
        cloudinaryImageId: uploadResponse.public_id,
      }
    });

    // Return the uploaded image details
    return NextResponse.json({
      success: true,
      data: {
        url: uploadResponse.secure_url,
        publicId: uploadResponse.public_id,
        width: uploadResponse.width,
        height: uploadResponse.height,
        format: uploadResponse.format,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
