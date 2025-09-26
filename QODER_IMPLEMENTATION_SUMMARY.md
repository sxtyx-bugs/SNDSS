# Qoder - Ephemeral Code Sharing Service Implementation

## Overview

This document provides a complete implementation of the Qoder ephemeral code-sharing service using Supabase Edge Functions and Upstash Redis. The implementation guarantees that all shared code snippets are automatically deleted after exactly 30 seconds.

## File Structure

```
supabase/
└── functions/
    ├── create_qoder/
    │   └── index.ts          # POST /create endpoint
    ├── share_qoder/
    │   └── index.ts          # GET /share endpoint
    ├── import_map.json       # Module import mappings
    ├── deno.json             # Deno configuration
    └── README.md             # Setup and deployment instructions
```

## Implementation Details

### 1. Create Function (`create_qoder/index.ts`)

Handles the creation of new code shares:

- Accepts POST requests with `{ snippet: string, language: string }`
- Generates a cryptographically secure random ID
- Stores data in Upstash Redis with 30-second TTL
- Creates a JWT token with the Redis key and 30-second expiration
- Returns a shareable URL with the signed JWT

### 2. Share Function (`share_qoder/index.ts`)

Handles retrieval of shared code snippets:

- Extracts JWT token from query parameters
- Verifies token signature and expiration
- Retrieves data from Redis using the key from the token
- Returns 410 Gone if data has expired (Redis TTL deleted it)
- Returns code snippet content with appropriate content-type headers

### 3. Security Features

- Cryptographically secure random IDs
- JWT-based access tokens with 30-second expiration
- Signature verification to prevent tampering
- Automatic deletion after TTL expiration

### 4. Ephemerality Guarantee

- Data is stored in Redis with EXPIRE set to 30 seconds
- Redis automatically deletes expired keys
- 410 Gone response proves data no longer exists
- No permanent storage of any code snippets

## Environment Variables

The following environment variables must be configured:

- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis authentication token
- `JWT_SECRET`: Secret key for signing JWT tokens
- `PROJECT_REF`: Supabase project reference for URL construction

## Deployment

1. Create a Supabase project
2. Set up an Upstash Redis database
3. Configure environment variables in Supabase
4. Deploy functions using Supabase CLI:
   ```bash
   supabase functions deploy create_qoder
   supabase functions deploy share_qoder
   ```

## API Usage

### Create a Share
```bash
curl -X POST https://<PROJECT_REF>.supabase.co/functions/v1/create \
  -H "Content-Type: application/json" \
  -d '{"snippet": "console.log(\"Hello World\");", "language": "javascript"}'
```

Response:
```json
{
  "url": "https://<PROJECT_REF>.supabase.co/functions/v1/share?token=<JWT_TOKEN>"
}
```

### Access a Share
```bash
curl https://<PROJECT_REF>.supabase.co/functions/v1/share?token=<JWT_TOKEN>
```

Response:
```
console.log("Hello World");
```

## Guarantees

1. **Time-bound Ephemeral Storage**: All data is automatically deleted after 30 seconds
2. **Zero Permanent Storage**: No code snippets are stored permanently
3. **Proof of Deletion**: 410 Gone response confirms data has been deleted
4. **Secure Access**: JWT tokens prevent unauthorized access
5. **Tamper Resistance**: Signature verification ensures token integrity