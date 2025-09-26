# Supabase Edge Functions Integration Guide

This guide explains how to integrate Supabase Edge Functions with your existing EphemeralShare application. This hybrid approach allows you to use the guaranteed 30-second ephemerality of Supabase Edge Functions with Upstash Redis while maintaining your existing Vercel/PostgreSQL implementation.

## Overview

Your current application uses:
- **Frontend**: React/Vite deployed on Vercel
- **Backend**: Node.js/Express deployed on Vercel with PostgreSQL storage
- **Ephemerality**: Application-level expiration (not guaranteed physical deletion)

The Supabase integration adds:
- **Supabase Edge Functions**: Serverless functions with Deno runtime
- **Upstash Redis**: Guaranteed physical deletion after 30 seconds
- **True Ephemerality**: Redis TTL ensures data is physically deleted

## Architecture Comparison

### Current Implementation (Vercel)
```
Frontend (Vercel) ↔ API Routes (Vercel) ↔ PostgreSQL Database
```

### Enhanced Implementation (Hybrid)
```
Frontend (Vercel) ↔ API Routes (Vercel) ↔ PostgreSQL Database
Frontend (Vercel) ↔ Supabase Edge Functions ↔ Upstash Redis (30-second TTL)
```

## Integration Approach

You can use both implementations simultaneously:
1. Keep your existing Vercel/PostgreSQL implementation as the default
2. Add Supabase Edge Functions as an alternative for true 30-second ephemerality
3. Allow users to choose between the two approaches

## Prerequisites

1. Supabase account
2. Upstash Redis database
3. Supabase CLI installed
4. Environment variables configured

## Implementation Steps

### 1. Set Up Supabase Project

1. Create a new project in Supabase
2. Note your project reference (used in URLs)
3. Install the Supabase CLI: `npm install -g supabase`
4. Link your project: `supabase link --project-ref your-project-ref`

### 2. Configure Upstash Redis

1. Create a new Redis database in Upstash
2. Note the REST URL and token
3. These will be used as environment variables

### 3. Environment Variables

Set these in your Supabase project settings:

```
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
JWT_SECRET=your_strong_jwt_secret (generate a secure secret)
PROJECT_REF=your_supabase_project_reference
```

### 4. Deploy Edge Functions

Deploy the existing functions:

```bash
supabase functions deploy create_qoder
supabase functions deploy share_qoder
```

### 5. Configure CORS (if needed)

In Supabase dashboard, you may need to configure CORS settings to allow requests from your Vercel frontend.

## API Endpoints

After deployment, you'll have these endpoints:

1. **Create Share**: `https://your-project-ref.supabase.co/functions/v1/create_qoder`
2. **View Share**: `https://your-project-ref.supabase.co/functions/v1/share_qoder?token=JWT_TOKEN`

## Benefits of Integration

1. **True Ephemerality**: Guaranteed deletion after 30 seconds via Redis TTL
2. **Backward Compatibility**: Existing functionality remains unchanged
3. **Choice**: Users can choose between flexible expiration (PostgreSQL) and guaranteed 30-second expiration (Redis)
4. **Scalability**: Edge Functions scale automatically
5. **Cost Efficiency**: Redis storage is more cost-effective for ephemeral data

## Next Steps

1. Update client-side code to support both APIs
2. Add UI elements to choose between implementations
3. Test the integration thoroughly
4. Update documentation for end users