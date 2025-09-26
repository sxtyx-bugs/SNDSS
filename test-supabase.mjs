// Test script to verify Supabase Edge Functions
async function testSupabaseAPI() {
  try {
    console.log('Testing Supabase create_qoder function...');
    
    const response = await fetch('https://budgaustyzkcciyscmuw.supabase.co/functions/v1/create_qoder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1ZGdhdXN0eXprY2NpeXNjbXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MDg1MDcsImV4cCI6MjA3NDQ4NDUwN30.Bv2eEIcVLqZa0QjnK1W_lsp1Wy89ME4EDA48qLJvj3g'
      },
      body: JSON.stringify({
        snippet: 'git push origin main',
        language: 'plaintext'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Success! Response data:', data);
    } else {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network or other error:', error);
  }
}

testSupabaseAPI();