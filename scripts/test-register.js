const axios = require('axios');

const testRegister = async () => {
  const baseURL = 'http://localhost:5001';
  
  try {
    // Test 1: Check if server is running
    console.log('1. Testing server health...');
    const health = await axios.get(`${baseURL}/health`);
    console.log('✅ Server is running:', health.data.message);
    
    // Test 2: Check auth routes
    console.log('\n2. Testing auth routes...');
    const authTest = await axios.get(`${baseURL}/api/auth/test`);
    console.log('✅ Auth routes working:', authTest.data.message);
    
    // Test 3: Test GET register (should show format)
    console.log('\n3. Testing GET /api/auth/register...');
    const getRegister = await axios.get(`${baseURL}/api/auth/register`);
    console.log('✅ GET register response:', getRegister.data.message);
    
    // Test 4: Test POST register with valid data
    console.log('\n4. Testing POST /api/auth/register...');
    const registerData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'farmer'
    };
    
    const register = await axios.post(`${baseURL}/api/auth/register`, registerData);
    console.log('✅ Registration successful:', register.data.user.name);
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data);
    } else {
      console.log('❌ Error:', error.message);
      console.log('Make sure backend server is running: cd backend && npm start');
    }
  }
};

testRegister();