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

// Server-side environment variables (lazy evaluation to avoid client-side errors)
let _DATABASE_URL: string | undefined;
export const getDatabaseUrl = () => _DATABASE_URL || (_DATABASE_URL = getRequiredEnv('DATABASE_URL'));

let _RESEND_API_KEY: string | undefined;
export const getResendApiKey = () => _RESEND_API_KEY || (_RESEND_API_KEY = getRequiredEnv('RESEND_API_KEY'));

let _RESEND_FROM_EMAIL: string | undefined;
export const getResendFromEmail = () => _RESEND_FROM_EMAIL || (_RESEND_FROM_EMAIL = getRequiredEnv('RESEND_FROM_EMAIL'));

let _ACCESS_TOKEN_SECRET: string | undefined;
export const getAccessTokenSecret = () => _ACCESS_TOKEN_SECRET || (_ACCESS_TOKEN_SECRET = getRequiredEnv('ACCESS_TOKEN_SECRET'));

export const getRefreshTokenSecret = () => process.env.REFRESH_TOKEN_SECRET;
export const getJwtSecret = () => process.env.JWT_SECRET || getAccessTokenSecret();

// Client-side environment variables (immediate evaluation is safe)
export const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

// Node Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Validate required environment variables (server-side only)
 * Call this on server startup to ensure all required vars are present
 */
export function validateEnv() {
  const required = [
    'DATABASE_URL',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'ACCESS_TOKEN_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}

// Export all as a single object (server-side only - use lazy getters)
export const env = {
  get DATABASE_URL() { return getDatabaseUrl(); },
  get RESEND_API_KEY() { return getResendApiKey(); },
  get RESEND_FROM_EMAIL() { return getResendFromEmail(); },
  get ACCESS_TOKEN_SECRET() { return getAccessTokenSecret(); },
  get REFRESH_TOKEN_SECRET() { return getRefreshTokenSecret(); },
  get JWT_SECRET() { return getJwtSecret(); },
  NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NODE_ENV,
};

export default env;
