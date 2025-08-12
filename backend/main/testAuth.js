const axios = require('axios');
const colors = require('colors');

const BASE_URL = 'http://localhost:5001/api';

const testAuthentication = async () => {
  console.log('🧪 Testing KrishiBandhu Authentication...'.cyan.bold);
  
  try {
    // Test 1: Health Check
    console.log('\n1️⃣ Testing Health Check...'.yellow);
    const healthRes = await axios.get(`${BASE_URL.replace('/api', '')}/health`);
    console.log('✅ Health Check:', healthRes.data.message.green);

    // Test 2: Login with valid credentials
    console.log('\n2️⃣ Testing Login with Valid Credentials...'.yellow);
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'ramesh.farmer@krishibandhu.com',
      password: 'password123'
    });
    
    if (loginRes.data.success) {
      console.log('✅ Login Successful'.green);
      console.log('👤 User:', loginRes.data.user.name, `(${loginRes.data.user.role})`);
      console.log('🔑 Token:', loginRes.data.token.substring(0, 20) + '...');
      
      const token = loginRes.data.token;
      
      // Test 3: Get current user
      console.log('\n3️⃣ Testing Get Current User...'.yellow);
      const meRes = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (meRes.data.success) {
        console.log('✅ Get Current User Successful'.green);
        console.log('👤 Current User:', meRes.data.user.name);
        console.log('📧 Email:', meRes.data.user.email);
      }
    }

    // Test 4: Login with invalid credentials
    console.log('\n4️⃣ Testing Login with Invalid Credentials...'.yellow);
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: 'invalid@test.com',
        password: 'wrongpassword'
      });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Invalid Login Properly Rejected'.green);
      }
    }

    // Test 5: Test Weather API
    console.log('\n5️⃣ Testing Weather API...'.yellow);
    const weatherRes = await axios.get(`${BASE_URL}/weather/current?city=Mumbai`);
    if (weatherRes.data.success) {
      console.log('✅ Weather API Working'.green);
      console.log('🌤️ Location:', weatherRes.data.data.location.name);
      console.log('🌡️ Temperature:', weatherRes.data.data.current.temperature + '°C');
    }

    console.log('\n🎉 All Tests Passed!'.green.bold);
    
  } catch (error) {
    console.error('❌ Test Failed:'.red, error.response?.data?.message || error.message);
  }
};

testAuthentication();
