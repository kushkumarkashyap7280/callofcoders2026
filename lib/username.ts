import prisma from "@/lib/prisma";

/**
 * Validates username format
 * Rules: lowercase letters + numbers only, 3-10 characters
 */
export function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }
  
  if (username.length > 10) {
    return { valid: false, error: "Username must be at most 10 characters" };
  }
  
  if (!/^[a-z0-9]+$/.test(username)) {
    return { valid: false, error: "Username can only contain lowercase letters and numbers" };
  }
  
  return { valid: true };
}

/**
 * Generates a unique username from a name
 * Algorithm:
 * 1. Convert name to lowercase, remove spaces and special chars
 * 2. Keep only letters and numbers
 * 3. If too long, truncate to 10 chars
 * 4. If already exists, append random number
 * 5. Keep trying until unique username is found
 */
export async function generateUniqueUsername(name: string): Promise<string> {
  // Clean the name: lowercase, remove spaces and special chars
  let baseUsername = name
    .toLowerCase()
    .replace(/\s+/g, '') // Remove spaces
    .replace(/[^a-z0-9]/g, ''); // Keep only letters and numbers
  
  // If empty after cleaning, use a default
  if (!baseUsername) {
    baseUsername = 'user';
  }
  
  // Truncate to max 7 chars to leave room for numbers
  if (baseUsername.length > 7) {
    baseUsername = baseUsername.substring(0, 7);
  }
  
  // Try the base username first
  let username = baseUsername;
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts < maxAttempts) {
    // Check if username exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!existingUser) {
      // Username is available
      return username;
    }
    
    // Username exists, try with a number
    attempts++;
    const randomNum = Math.floor(Math.random() * 999) + 1;
    username = `${baseUsername}${randomNum}`;
    
    // Ensure it's not longer than 10 chars
    if (username.length > 10) {
      // Truncate base and try again
      baseUsername = baseUsername.substring(0, Math.max(3, 10 - randomNum.toString().length));
      username = `${baseUsername}${randomNum}`;
    }
  }
  
  // Fallback: use timestamp-based username
  const timestamp = Date.now().toString().slice(-6);
  return `user${timestamp}`;
}

/**
 * Checks if a username is available
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const existingUser = await prisma.user.findUnique({
    where: { username },
  });
  
  return !existingUser;
}
