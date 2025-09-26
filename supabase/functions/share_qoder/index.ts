// --- FILE: supabase/functions/share_qoder/index.ts ---

import { serve } from "std/http/server.ts";
import { verify } from "djwt";

// Get environment variables
const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
const JWT_SECRET = Deno.env.get("JWT_SECRET");

// Validate environment variables
if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN || !JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

// Connect to Upstash Redis using REST API
const redis = {
  async get(key: string): Promise<string | null> {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/get/${key}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Redis get failed: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  }
};

serve(async (req) => {
  // Only allow GET requests
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Extract the token from query parameters
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    // Validate token presence
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the JWT
    let payload;
    try {
      payload = await verify(token, JWT_SECRET);
    } catch (error) {
      // Token verification failed (invalid signature or expired)
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
        status: 410, // Gone
        headers: { "Content-Type": "application/json" },
      });
    }

    // Extract the Redis key from the payload
    const key = payload.key;
    
    // Validate key presence
    if (!key || typeof key !== "string") {
      return new Response(JSON.stringify({ error: "Invalid key in token" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retrieve the data from Redis
    const dataString = await redis.get(key);
    
    // Check if data exists (null means TTL expired and Redis deleted it)
    if (dataString === null) {
      return new Response(JSON.stringify({ error: "Content expired and deleted" }), {
        status: 410, // Gone - the ultimate proof of ephemerality
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the stored data
    const data = JSON.parse(dataString);
    
    // Validate data structure
    if (!data.snippet || !data.language) {
      return new Response(JSON.stringify({ error: "Invalid data structure" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the snippet with appropriate content type
    return new Response(data.snippet, {
      status: 200,
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Language": data.language
      },
    });
  } catch (error) {
    console.error("Error in share_qoder function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});