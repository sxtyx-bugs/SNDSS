// Quick test to check environment variables in frontend
console.log('Environment Variable Test:');
console.log('VITE_USE_SUPABASE:', import.meta.env.VITE_USE_SUPABASE);
console.log('VITE_PUBLIC_API_URL:', import.meta.env.VITE_PUBLIC_API_URL);
console.log('VITE_SUPABASE_PROJECT_URL:', import.meta.env.VITE_SUPABASE_PROJECT_URL);

// Test the API utility
import { API_BASE_URL, USE_SUPABASE, getApiUrl } from './client/src/lib/api.ts';

console.log('API Configuration:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('USE_SUPABASE:', USE_SUPABASE);
console.log('API URL for /shares:', getApiUrl('/shares'));

// Test a simple API call
async function testAPI() {
  try {
    const url = getApiUrl('/shares');
    console.log('Testing API call to:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalContent: 'Test content from env test',
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
      }),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Success!', result);
    } else {
      const error = await response.text();
      console.error('Error:', error);
    }
  } catch (err) {
    console.error('Network error:', err);
  }
}

testAPI();