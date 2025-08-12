const axios = require('axios');

// Test Collaboration API
async function testCollaborationAPI() {
  console.log('Testing Collaboration API...');
  
  try {
    // Test getting teams
    const teamsResponse = await axios.get('http://localhost:5003/api/teams');
    console.log('✅ Teams API working:', teamsResponse.data.length, 'teams found');
    
    // Test getting products
    const productsResponse = await axios.get('http://localhost:5003/api/products');
    console.log('✅ Products API working:', productsResponse.data.length, 'products found');
    
    // Test getting categories
    const categoriesResponse = await axios.get('http://localhost:5003/api/categories');
    console.log('✅ Categories API working:', categoriesResponse.data.length, 'categories found');
    
  } catch (error) {
    console.log('❌ Collaboration API error:', error.message);
  }
}

// Test Soil Detection API
async function testSoilAPI() {
  console.log('\nTesting Soil Detection API...');
  
  try {
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5004/api/health');
    console.log('✅ Soil API health check:', healthResponse.data.status);
    
    // Test soil recommendation with sample data
    const soilData = {
      pH: 6.5,
      moisture: 25.0,
      EC: 1.2,
      temperature: 22.5,
      nitrogen: 70,
      phosphorus: 30,
      potassium: 150
    };
    
    console.log('🧪 Testing soil recommendation with sample data...');
    const recommendationResponse = await axios.post('http://localhost:5004/api/soil-recommendation', soilData);
    console.log('✅ Soil recommendation API working');
    console.log('📋 Sample recommendation:', recommendationResponse.data.recommendation.substring(0, 100) + '...');
    
  } catch (error) {
    console.log('❌ Soil API error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API Tests...\n');
  
  await testCollaborationAPI();
  await testSoilAPI();
  
  console.log('\n✨ Tests completed!');
  process.exit(0);
}

runTests();