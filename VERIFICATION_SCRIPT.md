# Verification Script for Vercel Refactor

This script outlines the steps to verify that the refactor was successful.

## 1. Check File Structure

Verify the following files/directories exist:
- [ ] `/api/shares.ts`
- [ ] `/api/cleanup.ts`
- [ ] `.env.example`
- [ ] Updated `vercel.json`
- [ ] Updated `server/storage.ts`
- [ ] Updated `server/routes.ts`

## 2. Check Dependencies

Verify the following dependencies are installed:
- [ ] `@vercel/node`
- [ ] `postgres`

## 3. Check TypeScript Compilation

Run:
```bash
npm run check
```

All files should compile without errors.

## 4. Test Local Development

Run:
```bash
npm run dev
```

Verify that:
- [ ] The application starts without errors
- [ ] The frontend loads correctly
- [ ] Creating a share works
- [ ] Retrieving a share works

## 5. Test Vercel Functions Locally (Optional)

Install Vercel CLI:
```bash
npm install -g vercel
```

Run functions locally:
```bash
vercel dev
```

Test API endpoints:
- [ ] POST /api/shares
- [ ] GET /api/shares/:id
- [ ] POST /api/cleanup

## 6. Check Environment Variables

Verify `.env.example` contains:
- [ ] OPENAI_API_KEY
- [ ] DATABASE_URL
- [ ] NODE_ENV

## 7. Review Documentation

Check that README.md contains:
- [ ] Overview of changes
- [ ] Development instructions
- [ ] Deployment instructions
- [ ] API endpoint documentation

## 8. Verify Vercel Configuration

Check that `vercel.json` contains:
- [ ] Builds configuration for API functions
- [ ] Routes configuration for API and static files

If all checks pass, the refactor is complete and ready for deployment!