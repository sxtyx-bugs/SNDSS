# Deploying to Vercel

This guide will help you deploy the EphemeralShare application to Vercel with proper security measures.

## Prerequisites

1. Create an account at [vercel.com](https://vercel.com)
2. Install the Vercel CLI: `npm install -g vercel`
3. Make sure your project is committed to a Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Login to Vercel CLI
```bash
vercel login
```

### 2. Deploy the Project
Navigate to your project directory and run:
```bash
vercel
```

Follow the prompts:
- Set up and deploy? `Y`
- Which scope? Select your personal account or team
- Link to existing project? `N` (for first deployment)
- What's your project's name? You can use the default or enter a custom name
- In which directory is your code located? `./`

### 3. Configure Environment Variables

After deployment, you'll need to set up environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add the following variables:

| Variable Name | Required | Description |
|---------------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string (for persistent storage) |
| OPENAI_API_KEY | No | OpenAI API key for text manipulation (optional) |
| NODE_ENV | No | Set to "production" |

## Database Setup (Optional but Recommended)

For production deployments, you should use a persistent database instead of in-memory storage:

1. Sign up for a free PostgreSQL database at [Neon](https://neon.tech/) or [Supabase](https://supabase.com/)
2. Get your database connection string
3. Add it as the DATABASE_URL environment variable in Vercel

## Security Features

This application includes several built-in security features:

1. **Privacy-First Design**: Content automatically expires and is deleted
2. **No Permanent Storage**: Data is not permanently stored (except in the database for active shares)
3. **History Protection**: Special handling for the /app route to prevent browser history tracking
4. **No Referrer Policy**: Implemented to prevent referrer leakage
5. **Cache Control**: Proper cache headers to prevent caching of sensitive content

## API Endpoints

The application exposes the following API endpoints:

### Create a Share
```
POST /api/shares
Content-Type: application/json

{
  "originalContent": "Your content here",
  "expiresAt": "2023-12-31T23:59:59.000Z"
}
```

### Get a Share
```
GET /api/shares/:id
```

### Cleanup Expired Shares
```
POST /api/cleanup
```

## Scheduled Cleanup (Optional)

To automatically clean up expired shares, you can set up a Vercel Cron job:

1. In your Vercel project, go to Settings > Git Integration
2. Add the following to your `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 * * * *" 
    }
  ]
}
```

This will run the cleanup job every hour.

## Redeployment

To redeploy after making changes:
```bash
vercel --prod
```

## Safety Measures for Users

1. All content is automatically deleted after expiration
2. No user accounts or personal information are stored
3. All data transmission is over HTTPS
4. The /app route uses history replacement to prevent tracking
5. No cookies or local storage are used for sensitive data
6. OpenAI integration is optional and can be disabled

## For Your Safety

As the administrator:
1. Never commit sensitive environment variables to version control
2. Regularly monitor your Vercel usage and logs
3. Rotate API keys periodically
4. Monitor database access logs if using a persistent database
5. Keep dependencies updated for security patches