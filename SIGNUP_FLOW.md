# 3-Stage Signup Flow Documentation

## Overview
The signup process is divided into three stages with OTP verification for email validation.

## Flow Architecture

### Stage 1: Email Submission
**Endpoint**: `POST /api/auth/request-otp`
**Frontend**: [components/UserSignupForm.tsx](components/UserSignupForm.tsx#L42-L66)

**Process:**
1. User enters email address
2. Frontend sends email to `/api/auth/request-otp`
3. Backend performs:
   - Email validation (format check)
   - Existing user check (prevents duplicate registration)
   - **TTL Cleanup**: Deletes OTP sessions older than 15 minutes
   - **TTL Cleanup**: Deletes OTPs older than 5 minutes
   - **Attempt Limiting**: Checks if attempts >= 3 in current session
   - Deletes existing OTP for this email (if any)
   - Generates new 6-digit OTP code
   - Upserts OTP session with incremented attempt count
   - Sends OTP via Resend email service
4. Backend returns:
   - Success: `{ stage: 0, message: "OTP sent", otpCode: "123456" }` (otpCode only in dev)
   - Error: `{ message: "Too many attempts. Try again in 15 minutes" }` (429)

**Security Features:**
- Maximum 3 OTP requests per 15-minute window
- Automatic cleanup of expired sessions (>15 min)
- Automatic cleanup of expired OTPs (>5 min)

---

### Stage 2: OTP Verification
**Endpoint**: `POST /api/auth/verify-otp`
**Frontend**: [components/UserSignupForm.tsx](components/UserSignupForm.tsx#L68-L93)

**Process:**
1. User enters 6-digit OTP code
2. Countdown timer displays remaining time (5 minutes)
3. Frontend sends `{ email, otpCode }` to `/api/auth/verify-otp`
4. Backend performs:
   - **TTL Cleanup**: Deletes OTPs older than 5 minutes
   - Finds OTP record by email
   - Validates OTP hasn't expired (createdAt + 5min > now)
   - Prevents reuse of already-verified OTPs
   - Validates OTP code matches
   - Updates OTP status to VERIFIED
   - Deletes OTP session (clears attempt counter)
5. Backend returns:
   - Success: `{ stage: 1, message: "OTP verified" }`
   - Error: `{ message: "OTP expired. Please request a new one" }` (400)

**UI Features:**
- 5-minute countdown timer
- Auto-disable verify button when expired
- Resend OTP button (disabled for first 60 seconds)
- Auto-focus on OTP input field

---

### Stage 3: Complete Profile
**Endpoint**: `POST /api/auth/complete-signup`
**Frontend**: [components/UserSignupForm.tsx](components/UserSignupForm.tsx#L95-L145)

**Process:**
1. User fills in:
   - Full name
   - Password (minimum 8 characters)
   - Confirm password
2. Frontend validates passwords match
3. Frontend sends `{ email, name, password, confirmPassword }` to `/api/auth/complete-signup`
4. Backend performs:
   - Field validation (all required)
   - Password match validation
   - Password length check (8+ characters)
   - OTP verification status check (must be VERIFIED)
   - Existing user check
   - Password hashing with bcrypt (10 rounds)
   - User creation
   - OTP record deletion
5. Backend returns:
   - Success: `{ user: { id, email, name } }`
   - Error: `{ message: "Password must be at least 8 characters" }` (400)
6. Frontend redirects to `/login?signup=success`

**Password Security:**
- Minimum 8 characters required
- Hashed with bcrypt (salt rounds: 10)
- Stored as `passwordHash` in database

---

## Database Schema

### Otp Table
```prisma
model Otp {
  email     String   @id
  otpType   OtpType
  status    OtpStatus @default(SENT)
  otpCode   String
  createdAt DateTime @default(now())
}

enum OtpType {
  SIGNUP  // Value: 0
  RESET   // Value: 1
}

enum OtpStatus {
  SENT      // Value: 0
  VERIFIED  // Value: 1
}
```

### OtpSession Table
```prisma
model OtpSession {
  email     String   @id
  attempts  Int      @default(0)
  createdAt DateTime @default(now())
}
```

### User Table
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  name         String
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## Email Service

### Configuration
- **Provider**: Resend (https://resend.com)
- **Domain**: kushkumar.me
- **From Address**: noreply@kushkumar.me
- **Display Name**: Call of Coders

### Template
Located at: [templates/otp-email.html](templates/otp-email.html)

**Dynamic Placeholders:**
- `{{GRADIENT}}`: Header gradient background
- `{{HEADING}}`: Email heading text
- `{{MESSAGE}}`: Email body message
- `{{OTP_CODE}}`: 6-digit OTP code

**Email Types:**
- Signup: "Verify Your Email - Call of Coders"
- Password Reset: "Reset Your Password - Call of Coders" (future)

---

## TTL (Time To Live) Management

Since PostgreSQL doesn't have native TTL support, manual cleanup is performed on every request:

### OTP Session TTL: 15 Minutes
```typescript
async function cleanupExpiredSessions() {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000)
  await prisma.otpSession.deleteMany({
    where: { createdAt: { lt: fifteenMinutesAgo } }
  })
}
```

### OTP TTL: 5 Minutes
```typescript
async function cleanupExpiredOtps() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  await prisma.otp.deleteMany({
    where: { createdAt: { lt: fiveMinutesAgo } }
  })
}
```

**Cleanup Triggers:**
- Called at the start of every `/api/auth/request-otp` request
- Called at the start of every `/api/auth/verify-otp` request

---

## Error Handling

### API Error Responses

| Status Code | Message | Trigger |
|------------|---------|---------|
| 400 | "Email is required" | Missing email in request |
| 400 | "Invalid email format" | Email fails regex validation |
| 400 | "User already exists" | Email already registered |
| 429 | "Too many attempts. Try again in 15 minutes" | >= 3 OTP requests in 15min window |
| 400 | "Invalid or expired OTP" | OTP not found or expired |
| 400 | "OTP code does not match" | Incorrect OTP code entered |
| 400 | "All fields are required" | Missing required fields in final signup |
| 400 | "Passwords do not match" | Password !== confirmPassword |
| 400 | "Password must be at least 8 characters" | Password too short |
| 400 | "OTP not verified" | Attempting signup without verified OTP |
| 500 | "Failed to send OTP" | Email sending failure |
| 500 | "An error occurred" | Unexpected server error |

### Frontend Error Display
Errors are displayed in a red alert box above the form with animation:

```tsx
{error && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-500 text-sm"
  >
    {error}
  </motion.div>
)}
```

---

## Development vs Production

### Development Mode
- OTP code is returned in API response for testing
- Logged to browser console: `console.log('OTP Code (dev only):', data.otpCode)`
- No actual email sending required for testing

### Production Mode
- OTP code NOT included in response
- Email is sent via Resend
- Environment variables required:
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `DATABASE_URL`

---

## Testing the Flow

### 1. Start Development Server
```bash
npm run dev
```

### 2. Navigate to Signup
Open: http://localhost:3000/singup

### 3. Test Email Stage
- Enter any valid email format
- Check browser console for OTP code (dev mode)
- Verify email sent (check Resend dashboard)

### 4. Test OTP Verification
- Enter the 6-digit OTP code
- Watch the 5-minute countdown timer
- Test resend OTP functionality
- Test expiration handling (wait 5 minutes)

### 5. Test Profile Completion
- Enter full name
- Create password (8+ characters)
- Confirm password
- Submit and verify redirect to `/login?signup=success`

### 6. Test Error Cases
- Try registering same email twice
- Enter wrong OTP code
- Let OTP expire and try to verify
- Request OTP 4 times to trigger rate limit
- Submit mismatched passwords

---

## Future Enhancements

- [ ] Password strength indicator
- [ ] Email verification link as alternative to OTP
- [ ] Password reset flow using OtpType.RESET
- [ ] Session management after signup (JWT/NextAuth)
- [ ] Social authentication (Google, GitHub)
- [ ] Email template customization in admin panel
- [ ] Rate limiting on IP address level
- [ ] CAPTCHA for bot prevention
- [ ] 2FA setup during signup

---

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── request-otp/
│       │   └── route.ts          # Stage 1: Email submission
│       ├── verify-otp/
│       │   └── route.ts          # Stage 2: OTP verification
│       └── complete-signup/
│           └── route.ts          # Stage 3: User creation
├── (users)/
│   └── singup/
│       └── page.tsx              # Signup page wrapper
components/
└── UserSignupForm.tsx            # 3-stage form component
lib/
├── prisma.ts                     # Prisma client
├── resend.ts                     # Email service + OTP generation
└── utils.ts                      # Utility functions
prisma/
└── schema.prisma                 # Database schema
templates/
└── otp-email.html                # Email template
```

---

## Dependencies

### Core
- Next.js 16.1.1
- React 19.2.3
- Prisma 7.2.0
- PostgreSQL

### Authentication & Security
- bcryptjs: Password hashing
- @types/bcryptjs: TypeScript types

### Email
- resend: Email service SDK

### UI & Animations
- framer-motion 12.25.0: Animations
- tailwindcss 4: Styling
- lucide-react: Icons
- @radix-ui/react-label: Label component

---

## Environment Variables

Create a `.env` file:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Email Service
RESEND_API_KEY="re_your_api_key_here"
RESEND_FROM_EMAIL="noreply@kushkumar.me"
```

---

## Commands

### Database
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio
```

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
