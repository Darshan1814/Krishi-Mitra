const axios = require('axios');

const testAuth = async () => {
  const BASE_URL = 'http://localhost:5001/api';
  
  try {
    console.log('🧪 Testing Clean Auth Flow...\n');
    
    // Test signup
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'farmer'
    };
    
    console.log('1️⃣ Testing Signup...');
    const signupRes = await axios.post(`${BASE_URL}/auth/register`, userData);
    console.log('✅ Signup Success:', signupRes.data.user.name);
    
    // Test signin
    console.log('\n2️⃣ Testing Signin...');
    const signinRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log('✅ Signin Success:', signinRes.data.user.name);
    console.log('🎯 Role:', signinRes.data.user.role);
    
    console.log('\n🎉 All tests passed!');
    
  } catch (error) {
    console.log('❌ Error:', error.response?.data?.message || error.message);
  }
};

testAuth();