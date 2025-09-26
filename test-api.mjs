async function testApi() {
  // Dynamically import node-fetch for ES modules
  const { default: fetch } = await import('node-fetch');
  
  try {
    // Test creating a share
    const createResponse = await fetch('http://localhost:5000/api/shares', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        originalContent: 'Hello, World!',
        expiresAt: '2025-12-31T23:59:59.000Z'
      })
    });

    const createData = await createResponse.json();
    console.log('Create Share Response:', createData);

    // Test retrieving the share
    if (createData.id) {
      const getResponse = await fetch(`http://localhost:5000/api/shares/${createData.id}`);
      const getData = await getResponse.json();
      console.log('Get Share Response:', getData);
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi();