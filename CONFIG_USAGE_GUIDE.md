# How to Use the Config Module

## Quick Start

Instead of accessing environment variables directly via `process.env`, import them from the centralized config:

```typescript
// ❌ Old way (don't do this)
const secret = process.env.JWT_SECRET;
const apiKey = process.env.RESEND_API_KEY;

// ✅ New way (do this)
import { JWT_SECRET, RESEND_API_KEY } from '@/config/env';
// or
import { JWT_SECRET, RESEND_API_KEY } from '@/config';
```

## Available Exports

### Individual Exports
```typescript
import {
  DATABASE_URL,
  RESEND_API_KEY,
  RESEND_FROM_EMAIL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  JWT_SECRET,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NODE_ENV
} from '@/config/env';
```

### Default Object Export
```typescript
import env from '@/config/env';

console.log(env.JWT_SECRET);
console.log(env.NODE_ENV);
```

### All Named Exports
```typescript
import * as config from '@/config/env';

console.log(config.JWT_SECRET);
console.log(config.DATABASE_URL);
```

## Real-World Examples

### API Route Example
```typescript
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, NODE_ENV } from '@/config/env';

export async function POST(request: NextRequest) {
  const token = jwt.sign(payload, JWT_SECRET!, { expiresIn: '7d' });
  
  response.cookies.set('auth-token', token, {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  return response;
}
```

### Client Component Example
```typescript
'use client';
import { NEXT_PUBLIC_GOOGLE_CLIENT_ID } from '@/config/env';

export default function GoogleButton() {
  const clientId = NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  // Use clientId...
}
```

### Library Example
```typescript
import { DATABASE_URL, NODE_ENV } from '@/config/env';
import { PrismaClient } from '@/app/generated/prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

if (NODE_ENV !== 'production') {
  global.prisma = prisma;
}
```

## Validation

Check if all required environment variables are set:

```typescript
import { validateEnv } from '@/config/env';

try {
  validateEnv();
  console.log('✅ All required environment variables are set');
} catch (error) {
  console.error('❌ Missing variables:', error.message);
  process.exit(1);
}
```

## Benefits

1. **Type Safety**: TypeScript knows about these imports
2. **Autocomplete**: Your IDE suggests available variables
3. **Refactoring**: Easy to find all usages
4. **Testing**: Mock the entire config module
5. **Documentation**: All variables documented in one place
6. **Validation**: Built-in checking for required variables

## Common Patterns

### Conditional Configuration
```typescript
import { NODE_ENV, DATABASE_URL } from '@/config/env';

const config = {
  database: DATABASE_URL,
  logging: NODE_ENV === 'development',
  cache: NODE_ENV === 'production',
};
```

### With Defaults
```typescript
import { RESEND_FROM_EMAIL } from '@/config/env';

const fromEmail = RESEND_FROM_EMAIL || 'noreply@default.com';
```

### Type Assertions
```typescript
import { JWT_SECRET } from '@/config/env';

// When you're sure it exists
const secret = JWT_SECRET!;

// With validation
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required');
}
const secret = JWT_SECRET;
```

## Migration Checklist

When updating existing code:

- [ ] Find all `process.env.VARIABLE_NAME` usages
- [ ] Add import: `import { VARIABLE_NAME } from '@/config/env'`
- [ ] Replace `process.env.VARIABLE_NAME` with `VARIABLE_NAME`
- [ ] Test the file
- [ ] Remove unused process.env references

## Tips

1. **Import at top**: Keep all config imports at the top of your file
2. **Use destructuring**: Import only what you need
3. **Avoid defaults**: Let validation catch missing vars early
4. **Document usage**: Comment why you're using each variable
5. **Update README**: When adding new variables, update `/config/README.md`

## Current .env Structure

Your `.env` file should have:

```env
# Database
DATABASE_URL="postgres://..."

# Email (Resend)
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="Your Name <email@domain.com>"

# JWT Secrets
ACCESS_TOKEN_SECRET="your-secret-here"
REFRESH_TOKEN_SECRET="your-refresh-secret-here"

# Google OAuth (Public)
NEXT_PUBLIC_GOOGLE_CLIENT_ID="your-google-client-id"
```

## Security Reminders

- ✅ Server-only variables: No `NEXT_PUBLIC_` prefix
- ✅ Client-safe variables: Use `NEXT_PUBLIC_` prefix
- ❌ Never commit `.env` to git
- ❌ Never log sensitive values
- ❌ Never send secrets to the client

## Need Help?

- Check `/config/README.md` for detailed documentation
- See `/ENV_MIGRATION.md` for migration guide
- Look at existing API routes for examples
