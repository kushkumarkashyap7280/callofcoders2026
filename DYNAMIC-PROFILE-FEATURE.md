# Dynamic User Profile Feature

## Overview
User profiles are now accessible via dynamic email-based URLs instead of the static `/profile` route. This allows:
- Public viewing of user profiles without authentication
- Authenticated users to view their full dashboard when accessing their own profile
- Easy profile sharing via email-based URLs

## URL Structure

### Public Profile Access
- **URL Format**: `/{email}`
- **Example**: `/john@example.com` or `/user%40example.com` (URL encoded)
- **Authentication**: Not required
- **Data Shown**: 
  - Name, email, profile image
  - Bio and social links (if set in metadata)
  - Completed courses
  - Member since date

### Own Profile Access
- **URL Format**: `/{your-email}`
- **Example**: When logged in as `john@example.com`, visiting `/john@example.com` shows full dashboard
- **Authentication**: Required
- **Data Shown**: Full profile dashboard with settings access

### Settings Page
- **URL Format**: `/{email}/settings`
- **Example**: `/john@example.com/settings`
- **Authentication**: Required (only accessible by the profile owner)
- **Functionality**: Profile settings and preferences

## Database Changes

### User Model
Added `metadata` field to store public profile information:

```prisma
model User {
  // ... existing fields
  metadata          Json?     // Public profile metadata (bio, social links, etc.)
  // ... rest of fields
}
```

### Metadata Structure
The metadata JSON field supports the following properties:
- `bio` (string): User biography
- `location` (string): User's location
- `website` (string): Personal website URL
- `twitter` (string): Twitter handle
- `github` (string): GitHub username
- `linkedin` (string): LinkedIn profile ID

## API Routes

### 1. Get Public User Data
**Endpoint**: `GET /api/user/public/{email}`
**Authentication**: Not required
**Returns**: Public user information (excludes sensitive data like passwordHash, googleId, isAdmin)

### 2. Update User Metadata
**Endpoint**: `PATCH /api/user/metadata`
**Authentication**: Required
**Body**:
```json
{
  "bio": "Full-stack developer passionate about web technologies",
  "location": "San Francisco, CA",
  "website": "https://example.com",
  "twitter": "username",
  "github": "username",
  "linkedin": "username"
}
```

## Components

### PublicProfileView
Displays public user profile with:
- Profile header (image, name, email)
- Bio and social links
- Completed courses grid
- Member since information

### ProfileContent (Updated)
Used for authenticated users viewing their own profile
- Shows full dashboard
- Access to settings
- Profile editing capabilities

## Navigation Updates

### Dynamic Profile Links
- Navigation now uses email-based profile URLs
- `createNavLinks()` function accepts optional `userEmail` parameter
- Profile link: `/{email}` (or `/login` if not authenticated)

### AuthProvider Changes
- After login, redirects to `/{user-email}` instead of `/profile`
- Admins still redirect to `/admin`

## Backward Compatibility

The old `/profile` route is kept for backward compatibility but is no longer actively used in navigation. It will:
- Redirect authenticated users to their email-based profile
- Redirect unauthenticated users to `/login`

## Usage Examples

### Sharing a Profile
```
Hey, check out my CallOfCoders profile:
https://callofcoders.com/john@example.com
```

### Updating Profile Metadata
```javascript
const response = await fetch('/api/user/metadata', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bio: 'Passionate developer learning Next.js',
    location: 'New York',
    github: 'johndoe',
  }),
});
```

### Server Component Data Fetching
```typescript
// In a server component
const user = await prisma.user.findUnique({
  where: { email: decodedEmail },
  select: {
    id: true,
    email: true,
    name: true,
    profileImageUrl: true,
    metadata: true,
    // ... other public fields
  },
});
```

## Security Considerations

1. **Sensitive Data Protection**: The public API route excludes sensitive fields like `passwordHash`, `googleId`, `isAdmin`, and `cloudinaryImageId`
2. **Settings Access Control**: Only the profile owner can access their settings page
3. **Metadata Validation**: Consider adding validation for social media usernames and URLs in the update API
4. **Email Encoding**: Emails are URL-encoded to handle special characters

## Future Enhancements

Consider implementing:
1. Custom usernames as an alternative to email-based URLs
2. Profile visibility settings (public/private)
3. Activity feed on public profiles
4. Profile statistics (total courses completed, badges earned, etc.)
5. Social features (follow/followers, profile views)
