# Vercel Deployment Instructions for EphemeralShare

This document provides step-by-step instructions for deploying the EphemeralShare application to Vercel with proper API connectivity between the frontend and backend.

## Overview

The EphemeralShare application consists of:
1. A frontend (React/Vite) that needs to communicate with the backend API
2. A backend (Node.js/Express) that serves the API endpoints

To make them work together in production, we need to deploy them as separate Vercel projects and configure environment variables.

## Step 1: Deploy the Backend API

1. Create a new Vercel project for the backend:
   - Go to your Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Set the "Root Directory" to `server`
   - Keep all other settings as default
   - Deploy the project

2. Once deployed, note the production URL of your backend project. It will look something like:
   ```
   https://your-backend-project.vercel.app
   ```

## Step 2: Deploy the Frontend Application

1. Create a new Vercel project for the frontend:
   - Go to your Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Set the "Root Directory" to `client`
   - Set the "Build and Output Settings" as follows:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Deploy the project

## Step 3: Configure Environment Variables

1. In your frontend Vercel project dashboard:
   - Go to "Settings" > "Environment Variables"
   - Add a new environment variable:
     - Name: `VITE_PUBLIC_API_URL`
     - Value: The URL of your deployed backend (e.g., `https://your-backend-project.vercel.app`)
   - Make sure it's set for the "Production" environment

2. In your backend Vercel project dashboard:
   - Go to "Settings" > "Environment Variables"
   - Add any required environment variables:
     - `OPENAI_API_KEY` (if using AI features)
     - `DATABASE_URL` (for database connectivity)
     - `NODE_ENV` = `production`

## Step 4: Redeploy

After setting the environment variables:
1. Redeploy your frontend project
2. Redeploy your backend project (if you added backend environment variables)

## How It Works

The frontend now uses the `VITE_PUBLIC_API_URL` environment variable to determine where to send API requests:

- In development: Uses `/api` (relative paths that work with the local dev server)
- In production: Uses the full backend URL (e.g., `https://your-backend-project.vercel.app`)

This approach ensures that:
1. API calls work correctly in both local development and production
2. The frontend and backend can be deployed and scaled independently
3. No code changes are needed between environments

## Troubleshooting

If you're still experiencing connectivity issues:

1. Check that both projects are deployed successfully
2. Verify the environment variable is set correctly in the frontend project
3. Ensure the backend API endpoints are working by testing them directly
4. Check the browser's developer console for any error messages
5. Make sure CORS headers are properly configured (they are in the current implementation)