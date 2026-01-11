# Google OAuth Setup Instructions

## Steps to Configure Google Login

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top
3. Click "NEW PROJECT"
4. Enter project name (e.g., "Call of Coders")
5. Click "CREATE"

### 2. Enable Google+ API

1. In the left sidebar, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and click "ENABLE"

### 3. Create OAuth Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "CREATE CREDENTIALS" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Call of Coders
     - User support email: Your email
     - Developer contact information: Your email
   - Click "SAVE AND CONTINUE"
   - Skip "Scopes" section
   - Add test users if needed (your email)
   - Click "SAVE AND CONTINUE"

4. After consent screen is configured, create OAuth client ID:
   - Application type: "Web application"
   - Name: Call of Coders Web Client
   - Authorized JavaScript origins:
     - http://localhost:3000
     - http://localhost:3001
     - (Add your production URL when deployed)
   - Authorized redirect URIs:
     - http://localhost:3000
     - http://localhost:3001
     - (Add your production URL when deployed)
   - Click "CREATE"

5. Copy the "Client ID" (looks like: `123456789-abc123.apps.googleusercontent.com`)

### 4. Add Client ID to Environment Variables

1. Open your `.env` or `.env.local` file
2. Add the following line:
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
```

3. Save the file
4. Restart your development server

### 5. Test Google Login

1. Go to http://localhost:3000/login or http://localhost:3000/signup
2. You should see a "Continue with Google" button
3. Click it and sign in with your Google account
4. You should be redirected to your dashboard after successful login

## Important Notes

- The `NEXT_PUBLIC_` prefix is required because the Client ID is used in client-side code
- Never commit your `.env` file to version control (it should be in `.gitignore`)
- For production, add your production domain to the authorized origins and redirect URIs
- Users who sign up with Google will have an empty password field in the database
- Google OAuth users can only log in via Google (not with email/password)

## Troubleshooting

**Error: "Google Client ID not configured"**
- Make sure you added `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to your `.env` file
- Restart your development server after adding the environment variable

**Error: "Redirect URI mismatch"**
- Add your current URL to the authorized redirect URIs in Google Cloud Console
- Make sure there are no trailing slashes in the URIs

**Google login button not appearing**
- Check browser console for errors
- Verify the packages are installed: `npm list @react-oauth/google jwt-decode`
- Clear browser cache and reload

## Security Considerations

- The Google Client ID is safe to expose in client-side code
- The JWT Secret should remain server-side only (no `NEXT_PUBLIC_` prefix)
- Always use HTTPS in production
- Consider implementing rate limiting for authentication endpoints
