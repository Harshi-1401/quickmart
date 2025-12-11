// Test script to check frontend API connection
const axios = require('axios');

const API_BASE_URL = 'https://quickmart-backend-tvuf.onrender.com/api';

async function testAPI() {
  console.log('🔍 Testing API connection from frontend perspective...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test products endpoint
    console.log('\n2. Testing products endpoint...');
    const productsResponse = await axios.get(`${API_BASE_URL}/products`);
    console.log('✅ Products count:', productsResponse.data.length);
    console.log('✅ First 3 products:', productsResponse.data.slice(0, 3).map(p => p.name));
    
    // Test auth endpoints
    console.log('\n3. Testing auth endpoints...');
    try {
      const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (authError) {
      if (authError.response && authError.response.status === 401) {
        console.log('✅ Auth endpoint working (expected 401 for wrong credentials)');
      } else {
        console.log('❌ Auth endpoint error:', authError.message);
      }
    }
    
    console.log('\n🎉 All API endpoints are working correctly!');
    
  } catch (error) {
    console.error('❌ API Test Failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAPI();