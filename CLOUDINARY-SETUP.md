# Cloudinary Setup

This project uses Cloudinary for image uploads, specifically for profile images.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## Getting Your Cloudinary Credentials

1. Sign up or log in to [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. You'll find your credentials:
   - **Cloud Name**: Found at the top of your dashboard
   - **API Key**: Found in the "Account Details" section
   - **API Secret**: Found in the "Account Details" section (click "Reveal" to see it)

## API Endpoint

### Upload Profile Image

**Endpoint:** `POST /api/upload/profile-image`

**Authentication:** Required (uses JWT token from `auth-token` cookie)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file`: The image file to upload (required)

**Constraints:**
- Maximum file size: 5MB
- Allowed formats: jpg, jpeg, png, webp
- Images are automatically transformed to 500x500px with face-detection cropping
- User must be authenticated

**Features:**
- **Auto-Delete Old Images**: If the user already has a profile image stored in Cloudinary, it will be automatically deleted before uploading the new one
- **Database Update**: The new image URL and Cloudinary public ID are automatically saved to the user's profile

**Example Usage:**

```javascript
// Must be called from an authenticated user session
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('/api/upload/profile-image', {
  method: 'POST',
  body: formData,
  credentials: 'include', // Important: includes authentication cookies
});

const result = await response.json();
// result.data.url contains the uploaded image URL
// This URL is automatically saved to the user's profile
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "profile-images/...",
    "width": 500,
    "height": 500,
    "format": "jpg"
  }
}
```

**Error Response (400/401/404/500):**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

**Possible Error Codes:**
- `401`: Not authenticated or invalid token
- `400`: No file provided, file too large, or invalid format
- `404`: User not found
- `500`: Server error during upload

## Features

- **Authentication Required**: Only authenticated users can upload profile images
- **Auto-Delete Previous Images**: When a user uploads a new profile image, their old image is automatically deleted from Cloudinary
- **Database Integration**: Image URLs and Cloudinary IDs are automatically stored in the user's profile
- **File Size Validation**: Ensures uploads are under 5MB
- **Format Validation**: Only accepts jpg, jpeg, png, and webp files
- **Auto-Optimization**: Images are automatically optimized for web delivery
- **Smart Cropping**: Uses face detection to ensure profile pictures are centered on faces
- **Auto-Formatting**: Cloudinary automatically serves the best format for the user's browser
- **Quality Optimization**: Images are compressed while maintaining visual quality

## Folder Structure

All profile images are stored in the `profile-images` folder in your Cloudinary account.
