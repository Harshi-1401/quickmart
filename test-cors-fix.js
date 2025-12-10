// Test CORS configuration for your specific URLs
const frontendUrl = 'https://quickmart-gamma.vercel.app';
const backendUrl = 'https://quickmart-backend-tvuf.onrender.com';

async function testCORSFix() {
  console.log('🧪 Testing CORS Fix for QuickMart...\n');
  
  console.log('📍 Frontend URL:', frontendUrl);
  console.log('📍 Backend URL:', backendUrl);
  console.log('📍 API Base URL:', `${backendUrl}/api`);
  
  // Test 1: Backend Health
  try {
    console.log('\n🔍 Testing Backend Health...');
    const healthResponse = await fetch(`${backendUrl}/api/health`);
    if (healthResponse.ok) {
      const data = await healthResponse.json();
      console.log('✅ Backend is healthy:', data.message);
    } else {
      console.log('❌ Backend health check failed:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ Backend error:', error.message);
  }

  // Test 2: CORS Preflight
  try {
    console.log('\n🔍 Testing CORS Preflight...');
    const corsResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': frontendUrl,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization'
      }
    });
    
    console.log('CORS Status:', corsResponse.status);
    console.log('CORS Headers:');
    corsResponse.headers.forEach((value, key) => {
      if (key.includes('access-control')) {
        console.log(`  ${key}: ${value}`);
      }
    });
  } catch (error) {
    console.log('❌ CORS test error:', error.message);
  }

  // Test 3: Actual API Call (will fail without valid data, but should not have CORS error)
  try {
    console.log('\n🔍 Testing Actual API Call...');
    const apiResponse = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': frontendUrl
      },
      body: JSON.stringify({ email: 'test@test.com', password: 'test' })
    });
    
    if (apiResponse.status === 400) {
      console.log('✅ API endpoint reachable (validation error expected)');
    } else if (apiResponse.status === 404) {
      console.log('❌ API endpoint not found');
    } else {
      console.log('⚠️ Unexpected response:', apiResponse.status);
    }
  } catch (error) {
    if (error.message.includes('CORS')) {
      console.log('❌ CORS error still present:', error.message);
    } else {
      console.log('✅ No CORS error, other error:', error.message);
    }
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Update Vercel environment variable: REACT_APP_API_URL');
  console.log('2. Redeploy frontend on Vercel');
  console.log('3. Test login on your frontend');
  console.log('4. If still issues, check browser Network tab');
}

testCORSFix().catch(console.error);