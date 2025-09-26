# EphemeralShare - Vercel Refactor

This project has been refactored to be compatible with Vercel's serverless deployment platform.

## Changes Made

### 1. Vercel Serverless Functions
- Created `/api` directory with serverless functions:
  - `api/shares.ts` - Handles creating and retrieving shares
  - `api/cleanup.ts` - Handles cleanup of expired shares

### 2. Storage Abstraction
- Updated `server/storage.ts` to support both:
  - In-memory storage (development)
  - Database storage (production with Vercel)

### 3. Configuration
- Updated `vercel.json` for proper routing:
  - `/api/*` routes to serverless functions
  - All other routes serve static frontend files

### 4. Environment Variables
- Added `.env.example` for required environment variables

## Development

The app still works locally with Express for development:

```bash
npm run dev
```

## Deployment to Vercel

Detailed deployment instructions can be found in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md).

1. Push to a GitHub repository
2. Connect to Vercel
3. Set environment variables in Vercel dashboard:
   - `OPENAI_API_KEY` (optional)
   - `DATABASE_URL` (for persistent storage)
4. Deploy!

## Security and Privacy

Security documentation can be found in [SECURITY.md](SECURITY.md).

Key security features:
- Ephemeral data storage (automatic deletion)
- History protection for sensitive routes
- No user tracking or personal data storage
- Transport security with HTTPS
- Input validation and sanitization

## API Endpoints

### Create a Share
```bash
POST /api/shares
Content-Type: application/json

{
  "originalContent": "Hello, world!",
  "expiresAt": "2023-12-31T23:59:59.000Z"
}
```

### Get a Share
```bash
GET /api/shares/:id
```

### Cleanup Expired Shares
```bash
POST /api/cleanup
```

## Architecture

- Frontend: Vite + React (served as static files)
- Backend: Vercel serverless functions
- Storage: In-memory (dev) or PostgreSQL (prod)
- AI: OpenAI GPT (optional)