# Configuration Module

This folder contains centralized configuration for all environment variables used in the application.

## Usage

Instead of directly accessing `process.env`, import from the config module:

```typescript
// ❌ Don't do this
const secret = process.env.JWT_SECRET;

// ✅ Do this instead
import { JWT_SECRET } from '@/config/env';
// or
import { JWT_SECRET } from '@/config';
```

## Available Environment Variables

### Database
- `DATABASE_URL` - PostgreSQL connection string

### Email (Resend)
- `RESEND_API_KEY` - API key for Resend email service
- `RESEND_FROM_EMAIL` - Email address to send from

### JWT Authentication
- `ACCESS_TOKEN_SECRET` - Secret for JWT token signing
- `REFRESH_TOKEN_SECRET` - Secret for refresh tokens
- `JWT_SECRET` - Alias for ACCESS_TOKEN_SECRET

### OAuth
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID` - Google OAuth Client ID (public)

### Environment
- `NODE_ENV` - Current environment (development, production, test)

## File Structure

```
config/
├── env.ts          # Environment variable exports and validation
├── index.ts        # Main export file
└── README.md       # This file
```

## Benefits

1. **Type Safety** - All env vars are typed and validated
2. **Centralized** - Single source of truth for configuration
3. **Easy to Test** - Can mock config in tests
4. **Better DX** - Autocomplete and documentation
5. **Validation** - `validateEnv()` function to check required vars
6. **No Typos** - Import errors instead of undefined runtime errors

## Validation

Call `validateEnv()` to ensure all required environment variables are set:

```typescript
import { validateEnv } from '@/config/env';

validateEnv(); // Throws error if any required vars are missing
```

## Adding New Variables

1. Add to `.env` file
2. Add export in `config/env.ts`
3. Add to validation in `validateEnv()` if required
4. Update this README

## Security Notes

- Variables with `NEXT_PUBLIC_` prefix are exposed to the client
- Server-only secrets should NOT have `NEXT_PUBLIC_` prefix
- Never commit `.env` files to version control
- Use different values for development and production
