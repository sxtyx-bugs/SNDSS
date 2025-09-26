# Qoder - Ephemeral Code Sharing Service

This is a secure, ephemeral code-sharing service built with Supabase Edge Functions and Upstash Redis. All shared code snippets are automatically deleted after exactly 30 seconds.

## Architecture

- **Runtime**: Supabase Edge Functions (Deno)
- **Storage**: Upstash Redis with 30-second TTL
- **Authentication**: JWT tokens for secure sharing

## Functions

### 1. Create Function (`create_qoder`)

**Endpoint**: `POST /create`

**Request Body**:
```json
{
  "snippet": "console.log('Hello World');",
  "language": "javascript"
}
```

**Response** (201 Created):
```json
{
  "url": "https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/share?token=<SIGNED_JWT>"
}
```

### 2. Share Function (`share_qoder`)

**Endpoint**: `GET /share?token=<SIGNED_JWT>`

**Responses**:
- **200 OK**: Returns the code snippet content
- **410 Gone**: Content has expired and been deleted
- **401/400**: Invalid token or request

## Environment Variables

Set these in your Supabase project settings:

```
UPSTASH_REDIS_REST_URL=your_upstash_redis_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_rest_token
JWT_SECRET=your_strong_jwt_secret
PROJECT_REF=your_supabase_project_reference
```

## Deployment

1. Create a Supabase project
2. Set up an Upstash Redis database
3. Configure the environment variables
4. Deploy the functions using the Supabase CLI:

```bash
supabase functions deploy create_qoder
supabase functions deploy share_qoder
```

## Guarantees

- **30-Second Ephemerality**: All data is physically deleted by Redis TTL after 30 seconds
- **No Proofs**: The 410 Gone response is the ultimate proof that data no longer exists
- **Security**: JWT tokens ensure only authorized users can access shared content