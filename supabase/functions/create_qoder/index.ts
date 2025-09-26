// --- FILE: supabase/functions/create_qoder/index.ts ---

// --- FILE: supabase/functions/create_qoder/index.ts ---

import { serve } from "std/http/server.ts";
import { create, getNumericDate } from "djwt";

// Get environment variables
const UPSTASH_REDIS_REST_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const UPSTASH_REDIS_REST_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");
const JWT_SECRET = Deno.env.get("JWT_SECRET");
const PROJECT_REF = Deno.env.get("PROJECT_REF") || "budgaustyzkcciyscmuw";

// Validate environment variables
if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN || !JWT_SECRET) {
  throw new Error("Missing required environment variables");
}

// Generate a cryptographically secure random ID
function generateSecureId(length: number = 8): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

// Connect to Upstash Redis using REST API
const redis = {
  async setex(key: string, ttl: number, value: string): Promise<void> {
    const response = await fetch(`${UPSTASH_REDIS_REST_URL}/setex/${key}/${ttl}/${encodeURIComponent(value)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${UPSTASH_REDIS_REST_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Redis setex failed: ${response.status}`);
    }
  },
  
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
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Parse the request body
    const { snippet, language } = await req.json();

    // Validate input
    if (!snippet || typeof snippet !== "string") {
      return new Response(JSON.stringify({ error: "Snippet is required and must be a string" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!language || typeof language !== "string") {
      return new Response(JSON.stringify({ error: "Language is required and must be a string" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a secure ID for the Redis key
    const key = generateSecureId(16);

    // Prepare the data to store
    const data = { snippet, language };

    // Store the data in Redis with a 30-second TTL
    await redis.setex(key, 30, JSON.stringify(data));

    // Create JWT payload with expiration in 30 seconds
    const payload = {
      key,
      exp: getNumericDate(30),
    };

    // Sign the JWT
    const jwt = await create({ alg: "HS256", typ: "JWT" }, payload, JWT_SECRET);

    // Construct the share URL
    const shareUrl = `https://${PROJECT_REF}.supabase.co/functions/v1/share_qoder?token=${jwt}`;

    // Return the share URL with 201 status
    return new Response(JSON.stringify({ url: shareUrl }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in create_qoder function:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});