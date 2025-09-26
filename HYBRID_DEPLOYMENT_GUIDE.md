# Hybrid Deployment Guide: Vercel + Supabase Edge Functions

This guide provides complete instructions for deploying the hybrid approach that combines your existing Vercel/PostgreSQL implementation with Supabase Edge Functions for true 30-second ephemerality.

## Overview

The hybrid deployment allows users to choose between:
1. **Flexible Expiration** (Vercel/PostgreSQL): Custom expiration times with application-level deletion
2. **Guaranteed 30-Second Ephemerality** (Supabase/Redis): Physically deleted after exactly 30 seconds

## Prerequisites

1. Vercel account with existing deployment
2. Supabase account
3. Upstash Redis database
4. Supabase CLI installed (`npm install -g supabase`)
5. Environment variables configured

## Deployment Steps

### 1. Configure Upstash Redis

1. Sign up at [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Note the REST URL and token from the database settings

### 2. Set Up Supabase Project

1. Sign up at [Supabase](https://supabase.com/)
2. Create a new project
3. Note your project reference (found in project settings)
4. Link your project locally:
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

### 3. Configure Environment Variables

Set these environment variables in your Supabase project dashboard:

```
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
JWT_SECRET=generate_a_strong_secret_here
PROJECT_REF=your_supabase_project_reference
```

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
```

### 4. Deploy Supabase Edge Functions

Deploy the existing functions:

```bash
supabase functions deploy create_qoder
supabase functions deploy share_qoder
```

### 5. Configure Frontend Environment Variables

In your Vercel project settings, add these environment variables:

```
# Enable Supabase integration
VITE_USE_SUPABASE=true

# Supabase project URL
VITE_SUPABASE_PROJECT_URL=https://your-project-ref.supabase.co

# Supabase API key (anon key from Supabase project settings)
VITE_SUPABASE_API_KEY=your_anon_key
```

### 6. Redeploy Frontend

Trigger a new deployment in Vercel to apply the environment variables.

## API Endpoints

After deployment, you'll have these endpoints available:

### Vercel API (Existing)
- **Create Share**: `https://your-vercel-app.vercel.app/api/shares` (POST)
- **View Share**: `https://your-vercel-app.vercel.app/api/shares/{id}` (GET)

### Supabase Edge Functions (New)
- **Create Share**: `https://your-project-ref.supabase.co/functions/v1/create_qoder` (POST)
- **View Share**: `https://your-project-ref.supabase.co/functions/v1/share_qoder?token={JWT_TOKEN}` (GET)

## How It Works

### Client-Side Logic

The frontend automatically detects which API to use based on the `VITE_USE_SUPABASE` environment variable:

1. When `VITE_USE_SUPABASE=false` or not set:
   - Uses existing Vercel API
   - Supports custom expiration times
   - Application-level deletion

2. When `VITE_USE_SUPABASE=true`:
   - Uses Supabase Edge Functions
   - Fixed 30-second expiration
   - Guaranteed physical deletion via Redis TTL

### User Experience

Users don't need to make any changes - the application automatically uses the configured backend. You can add UI elements to let users choose between implementations if desired.

## Benefits of Hybrid Approach

1. **Backward Compatibility**: Existing functionality remains unchanged
2. **Enhanced Privacy**: True 30-second ephemerality for sensitive content
3. **Flexibility**: Choice between flexible expiration and guaranteed deletion
4. **Scalability**: Edge Functions automatically scale with demand
5. **Cost Efficiency**: Redis storage is more cost-effective for ephemeral data

## Testing the Integration

### Test Supabase Functions Locally

1. Install Supabase CLI
2. Link your project
3. Serve functions locally:
   ```bash
   supabase functions serve --env-file .env.local
   ```

### Test End-to-End

1. Create a share using the frontend
2. Verify the share URL uses the Supabase endpoint
3. Access the share before 30 seconds (should work)
4. Wait 30+ seconds and try again (should return 410 Gone)

## Monitoring and Maintenance

### Supabase Functions

- Monitor function logs in Supabase dashboard
- Check for errors in function invocations
- Monitor Upstash Redis usage

### Vercel Application

- Continue monitoring existing Vercel deployment
- Ensure both backends are functioning properly

## Troubleshooting

### Common Issues

1. **CORS Errors**: Configure CORS settings in Supabase dashboard to allow your Vercel domain
2. **401 Unauthorized**: Check that `VITE_SUPABASE_API_KEY` is correctly set
3. **410 Gone Immediately**: Verify Upstash Redis TTL settings
4. **Environment Variables Not Loading**: Ensure variables are set for the correct environment (Production/Preview)

### Debugging Steps

1. Check browser console for network errors
2. Verify environment variables are correctly set
3. Test Supabase functions directly with curl
4. Check Supabase function logs

## Security Considerations

1. **JWT Secret**: Keep the JWT secret secure and rotate it periodically
2. **API Keys**: Use the anon key for frontend, not the service key
3. **CORS**: Restrict CORS to only your Vercel domain in production
4. **Rate Limiting**: Consider implementing rate limiting for public functions

## Cost Considerations

### Supabase Edge Functions
- Generous free tier available
- Pay-per-execution model
- Very cost-effective for low to moderate usage

### Upstash Redis
- Pay-per-request and storage
- Very cost-effective for ephemeral data
- 30-second TTL minimizes storage costs

## Next Steps

1. Test the integration thoroughly
2. Update user documentation
3. Consider adding UI elements to let users choose between implementations
4. Monitor usage and costs
5. Set up alerts for function errors