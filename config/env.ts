/**
 * Environment Variables Configuration
 * Centralized access to all environment variables
 */

// Helper to get required env variable
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Database
export const DATABASE_URL = getRequiredEnv('DATABASE_URL');

// Email (Resend)
export const RESEND_API_KEY = getRequiredEnv('RESEND_API_KEY');
export const RESEND_FROM_EMAIL = getRequiredEnv('RESEND_FROM_EMAIL');

// JWT Secrets
export const ACCESS_TOKEN_SECRET = getRequiredEnv('ACCESS_TOKEN_SECRET');
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
export const JWT_SECRET = process.env.JWT_SECRET || ACCESS_TOKEN_SECRET;

// Google OAuth
export const NEXT_PUBLIC_GOOGLE_CLIENT_ID = getRequiredEnv('NEXT_PUBLIC_GOOGLE_CLIENT_ID');

// Node Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Validate required environment variables
 * Throws an error if any required variable is missing
 */
export function validateEnv() {
  const required = {
    DATABASE_URL,
    RESEND_API_KEY,
    RESEND_FROM_EMAIL,
    ACCESS_TOKEN_SECRET,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Export all as a single object
export const env = {
  DATABASE_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_SECRET,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NODE_ENV,
} as const;

export default env;
