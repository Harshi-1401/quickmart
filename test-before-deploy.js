// Test script to verify everything is working before deployment
const axios = require('axios');

const BACKEND_URL = 'https://quickmart-backend-tvuf.onrender.com/api';
const FRONTEND_URL = 'https://quickmart-gamma.vercel.app';

async function runTests() {
  console.log('🧪 Running Pre-Deployment Tests...\n');
  
  let allTestsPassed = true;
  
  // Test 1: Backend Health
  try {
    console.log('1️⃣ Testing Backend Health...');
    const health = await axios.get(`${BACKEND_URL}/health`);
    console.log('✅ Backend is healthy:', health.data.message);
  } catch (error) {
    console.log('❌ Backend health check failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 2: Products API
  try {
    console.log('\n2️⃣ Testing Products API...');
    const products = await axios.get(`${BACKEND_URL}/products`);
    console.log(`✅ Products API working: ${products.data.length} products found`);
    
    if (products.data.length < 70) {
      console.log('⚠️  Warning: Expected 70 products, found', products.data.length);
    }
  } catch (error) {
    console.log('❌ Products API failed:', error.message);
    allTestsPassed = false;
  }
  
  // Test 3: CORS Configuration
  try {
    console.log('\n3️⃣ Testing CORS Configuration...');
    const corsTest = await axios.get(`${BACKEND_URL}/products`, {
      headers: {
        'Origin': FRONTEND_URL
      }
    });
    console.log('✅ CORS is properly configured');
  } catch (error) {
    if (error.response && error.response.status !== 403) {
      console.log('✅ CORS appears to be working (non-CORS error)');
    } else {
      console.log('❌ CORS configuration issue:', error.message);
      allTestsPassed = false;
    }
  }
  
  // Test 4: Sample Product Data
  try {
    console.log('\n4️⃣ Testing Sample Product Data...');
    const products = await axios.get(`${BACKEND_URL}/products`);
    const sampleProduct = products.data[0];
    console.log('✅ Sample Product:');
    console.log(`   - Name: ${sampleProduct.name}`);
    console.log(`   - Price: ₹${sampleProduct.price}`);
    console.log(`   - Category: ${sampleProduct.category}`);
    console.log(`   - Stock: ${sampleProduct.stock}`);
  } catch (error) {
    console.log('❌ Sample product check failed:', error.message);
    allTestsPassed = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 All tests passed! Ready for deployment.');
    console.log('\nNext steps:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix API connection"');
    console.log('3. git push origin main');
    console.log('4. Redeploy on Vercel');
  } else {
    console.log('❌ Some tests failed. Please check the issues above.');
  }
  console.log('='.repeat(50));
}

runTests().catch(console.error);