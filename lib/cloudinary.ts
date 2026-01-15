/**
 * Cloudinary Configuration
 * Centralized Cloudinary setup and utilities
 */

import { v2 as cloudinary } from 'cloudinary';

// Helper to get required env variable
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: getRequiredEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: getRequiredEnv('CLOUDINARY_API_KEY'),
  api_secret: getRequiredEnv('CLOUDINARY_API_SECRET'),
});

export default cloudinary;

// Upload preset configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  FOLDER: 'profile-images',
} as const;
