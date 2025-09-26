# EphemeralShare - Vercel Deployment Summary

## Project Status
✅ Ready for Vercel deployment

## Key Features for Your Safety
1. **Privacy-First Design**: Content automatically expires and is deleted
2. **No Permanent Storage**: Data is not permanently stored (except in database for active shares)
3. **History Protection**: Special handling for the /app route to prevent browser history tracking
4. **No User Tracking**: No accounts or personal information stored
5. **Transport Security**: All data transmission over HTTPS

## Deployment Instructions

### 1. Prepare Your Repository
1. Commit all changes to a Git repository
2. Push to GitHub, GitLab, or Bitbucket

### 2. Sign Up for Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up for a free account

### 3. Import Your Project
1. Click "New Project"
2. Connect your Git provider
3. Select your EphemeralShare repository
4. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build and Output Settings:
     - Build Command: `npm run vercel-build`
     - Output Directory: `dist`

### 4. Configure Environment Variables
In the Vercel dashboard, go to Settings > Environment Variables and add:

| Variable Name | Required | Value |
|---------------|----------|-------|
| DATABASE_URL | Recommended | PostgreSQL connection string (see below) |
| OPENAI_API_KEY | Optional | Your OpenAI API key (for text manipulation) |
| NODE_ENV | Auto-set | production |

### 5. Database Setup (Recommended)
For persistent storage of shares, set up a PostgreSQL database:

1. Sign up for a free PostgreSQL database:
   - [Neon](https://neon.tech/) - Serverless PostgreSQL (recommended)
   - [Supabase](https://supabase.com/) - Firebase alternative with PostgreSQL

2. Get your database connection string

3. Add it as DATABASE_URL in Vercel environment variables

### 6. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at your-project.vercel.app

## API Endpoints (After Deployment)

### Create a Share
```
POST https://your-project.vercel.app/api/shares
Content-Type: application/json

{
  "originalContent": "Your content here",
  "expiresAt": "2023-12-31T23:59:59.000Z"
}
```

### Get a Share
```
GET https://your-project.vercel.app/api/shares/:id
```

### Cleanup Expired Shares
```
POST https://your-project.vercel.app/api/cleanup
```

## Security Features for Your Protection

### For All Users:
- Automatic content expiration and deletion
- No permanent URLs or data storage
- History protection for sensitive navigation
- No cookies or local storage tracking
- HTTPS encryption for all data transmission

### For You (Administrator):
- No administrative interface exposed
- Environment variables securely managed by Vercel
- No persistent sessions or authentication for admin functions
- Regular security updates through dependency management

## Best Practices for Your Safety

1. **Never commit sensitive environment variables** to version control
2. **Regularly monitor your Vercel usage and logs**
3. **Rotate API keys periodically**
4. **Keep dependencies updated** for security patches
5. **Use the free tier** to start - no credit card required

## Scheduled Cleanup (Optional)

To automatically clean up expired shares:

1. Add this to your `vercel.json`:

```json
{
  "builds": [
    { "src": "api/**/*.ts", "use": "@vercel/node" },
    { "src": "client/dist/**", "use": "@vercel/static" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/$1" },
    { "src": "/(.*)", "dest": "/client/dist/$1" }
  ],
  "crons": [
    {
      "path": "/api/cleanup",
      "schedule": "0 * * * *" 
    }
  ]
}
```

This will run cleanup every hour.

## Need Help?

If you encounter any issues during deployment:
1. Check the Vercel logs in your project dashboard
2. Verify all environment variables are correctly set
3. Ensure your database connection string is correct (if using persistent storage)
4. Check that your build completes successfully

Your application is ready for deployment with strong privacy and security features that protect both you and your users!