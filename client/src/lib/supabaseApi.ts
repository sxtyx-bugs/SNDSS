// API configuration utility for Supabase Edge Functions
// This file provides a centralized way to manage Supabase API endpoints

// Define the base URL using the VITE_PUBLIC prefix (for Vite exposure)
// This should be set to the deployed Supabase project URL
export const SUPABASE_PROJECT_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL || '';
export const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY || '';

/**
 * Constructs a full URL for Supabase Edge Function endpoints
 * @param functionName - The name of the Supabase function (e.g., 'create_qoder')
 * @returns The full URL for the Supabase function
 */
export function getSupabaseFunctionUrl(functionName: string): string {
  if (!SUPABASE_PROJECT_URL) {
    throw new Error('VITE_SUPABASE_PROJECT_URL is not configured');
  }
  return `${SUPABASE_PROJECT_URL}/functions/v1/${functionName}`;
}

/**
 * Creates a new text share using Supabase Edge Functions
 * @param data - The share data to create (snippet and language)
 * @returns The response from the Supabase function
 */
export async function createSupabaseShare(data: { snippet: string; language: string }) {
  const response = await fetch(getSupabaseFunctionUrl('create_qoder'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_API_KEY}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create share: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gets a text share by token using Supabase Edge Functions
 * @param token - The JWT token for the share
 * @returns The share data
 */
export async function getSupabaseShare(token: string) {
  const response = await fetch(`${getSupabaseFunctionUrl('share_qoder')}?token=${token}`);
  
  if (!response.ok) {
    if (response.status === 410) {
      throw new Error('Share has expired and been deleted');
    }
    throw new Error(`Failed to fetch share: ${response.status} ${response.statusText}`);
  }

  return {
    content: await response.text(),
    contentType: response.headers.get('content-type') || 'text/plain',
    language: response.headers.get('x-content-language') || 'plaintext'
  };
}

/**
 * Extracts token from a Supabase share URL
 * @param url - The full share URL
 * @returns The JWT token
 */
export function extractTokenFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('token');
  } catch (error) {
    return null;
  }
}