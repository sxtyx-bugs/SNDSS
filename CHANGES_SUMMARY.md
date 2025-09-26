# EphemeralShare Vercel Refactor - Summary of Changes

## Files Added

1. `api/shares.ts` - Vercel serverless function for handling share creation and retrieval
2. `api/cleanup.ts` - Vercel serverless function for cleaning up expired shares
3. `.env.example` - Example environment variables file
4. `README.md` - Documentation for the refactored project

## Files Modified

1. `server/storage.ts` - Updated to support both in-memory and database storage
2. `server/routes.ts` - Removed cleanup endpoint (now handled by Vercel functions)
3. `vercel.json` - Updated configuration for Vercel deployment
4. `package.json` - Added @vercel/node dependency and postgres dependency
5. `tsconfig.json` - Added api directory to include list

## Key Features Implemented

### 1. Vercel Serverless Functions
- Created dedicated API endpoints in the `api/` directory
- Each function handles specific operations (shares, cleanup)
- Proper CORS handling for cross-origin requests

### 2. Storage Abstraction
- Added support for both in-memory storage (development) and database storage (production)
- Automatic fallback to in-memory storage when database is not configured
- Database storage uses Drizzle ORM with PostgreSQL

### 3. Environment Configuration
- Added `.env.example` for easy environment setup
- Proper handling of environment variables for both development and production

### 4. Vercel Compatibility
- Updated `vercel.json` for proper routing of API and static file requests
- Ensured frontend files are served correctly
- Maintained compatibility with local development using Express

## API Endpoints

### Create a Share
```
POST /api/shares
```

### Get a Share
```
GET /api/shares/:id
```

### Cleanup Expired Shares
```
POST /api/cleanup
```

## Development Workflow

The application maintains full compatibility with local development:

```bash
npm run dev
```

## Deployment to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `OPENAI_API_KEY` (optional)
   - `DATABASE_URL` (for persistent storage)
4. Deploy!

## Architecture

- Frontend: Vite + React (served as static files)
- Backend: Vercel serverless functions
- Storage: In-memory (dev) or PostgreSQL (prod)
- AI: OpenAI GPT (optional)