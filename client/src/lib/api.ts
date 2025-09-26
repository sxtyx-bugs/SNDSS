// API configuration utility for handling different environments
// This file provides a centralized way to manage API endpoints

// Define the base URL using the VITE_PUBLIC prefix (for Vite exposure)
// In production, this should be set to the deployed backend URL
// In development, it will default to '/api' for relative calls
export const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL || '/api';

// Feature flag to enable Supabase integration
export const USE_SUPABASE = import.meta.env.VITE_USE_SUPABASE === 'true';

/**
 * Constructs a full URL for API endpoints
 * @param path - The API endpoint path (e.g., '/shares')
 * @returns The full URL for the API endpoint
 */
export function getApiUrl(path: string): string {
  // Remove leading slash from path if it exists to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * Creates a new text share
 * @param data - The share data to create
 * @returns The response from the API
 */
export async function createShare(data: any) {
  // If Supabase is enabled, use Supabase Edge Functions
  if (USE_SUPABASE) {
    const { createSupabaseShare } = await import('@/lib/supabaseApi');
    // Convert existing data format to Supabase format
    const supabaseData = {
      snippet: data.originalContent,
      language: 'plaintext' // Default language
    };
    return createSupabaseShare(supabaseData);
  }
  
  // Otherwise, use the existing Vercel API
  const response = await fetch(getApiUrl('/shares'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create share: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Gets a text share by ID or token
 * @param idOrToken - The ID of the share to retrieve or the Supabase JWT token
 * @returns The share data
 */
export async function getShare(idOrToken: string) {
  // If Supabase is enabled, use Supabase Edge Functions
  if (USE_SUPABASE) {
    const { getSupabaseShare } = await import('@/lib/supabaseApi');
    return getSupabaseShare(idOrToken);
  }
  
  // Otherwise, use the existing Vercel API
  const response = await fetch(getApiUrl(`/shares/${idOrToken}`));
  
  if (!response.ok) {
    throw new Error(`Failed to fetch share: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Determines if a URL is a Supabase share URL
 * @param url - The URL to check
 * @returns True if it's a Supabase share URL
 */
export async function isSupabaseShareUrl(url: string): Promise<boolean> {
  if (!USE_SUPABASE) return false;
  
  const { SUPABASE_PROJECT_URL } = await import('@/lib/supabaseApi');
  return SUPABASE_PROJECT_URL && url.includes(SUPABASE_PROJECT_URL);
}

/**
 * Extracts token from a Supabase share URL
 * @param url - The full share URL
 * @returns The JWT token
 */
export async function extractTokenFromUrl(url: string): Promise<string | null> {
  if (!USE_SUPABASE) return null;
  
  const { extractTokenFromUrl } = await import('@/lib/supabaseApi');
  return extractTokenFromUrl(url);
}