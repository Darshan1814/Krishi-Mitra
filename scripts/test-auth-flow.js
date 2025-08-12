const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

const testAuthFlow = async () => {
  console.log('🧪 Testing Complete Auth Flow...\n');
  
  try {
    // Test 1: Register new user
    console.log('1️⃣ Testing Registration...');
    const registerData = {
      name: 'Test Farmer',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'farmer'
    };
    
    const registerRes = await axios.post(`${BASE_URL}/auth/register`, registerData);
    
    if (registerRes.data.success) {
      console.log('✅ Registration successful');
      console.log('👤 User:', registerRes.data.user.name);
      console.log('🔑 Token received:', !!registerRes.data.token);
      
      // Test 2: Login with same credentials
      console.log('\n2️⃣ Testing Login...');
      const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
        email: registerData.email,
        password: registerData.password
      });
      
      if (loginRes.data.success) {
        console.log('✅ Login successful');
        console.log('👤 User:', loginRes.data.user.name);
        console.log('🎯 Role:', loginRes.data.user.role);
        
        // Test 3: Get current user
        console.log('\n3️⃣ Testing Get Current User...');
        const token = loginRes.data.token;
        const meRes = await axios.get(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (meRes.data.success) {
          console.log('✅ Get current user successful');
          console.log('👤 Current User:', meRes.data.user.name);
          console.log('📧 Email:', meRes.data.user.email);
        }
        
        console.log('\n🎉 All tests passed! Auth flow is working correctly.');
        
      } else {
        console.log('❌ Login failed:', loginRes.data.message);
      }
      
    } else {
      console.log('❌ Registration failed:', registerRes.data.message);
    }
    
  } catch (error) {
    if (error.response) {
      console.log('❌ Error:', error.response.data.message || error.response.data);
    } else {
      console.log('❌ Network Error:', error.message);
      console.log('Make sure backend server is running on port 5001');
    }
  }
};

testAuthFlow();