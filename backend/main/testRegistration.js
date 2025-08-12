const axios = require('axios');

const testRegistration = async () => {
  try {
    console.log('Testing user registration with new format...');
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'farmer'
    };
    
    const response = await axios.post('http://localhost:5001/api/auth/register', testUser);
    
    if (response.data.success) {
      console.log('✅ Registration successful!');
      console.log('User data:', response.data.user);
      console.log('Token received:', response.data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Registration failed:', response.data.message);
    }
  } catch (error) {
    if (error.response) {
      console.log('❌ Registration failed:', error.response.data.message);
    } else {
      console.log('❌ Error:', error.message);
      console.log('Make sure the backend server is running on port 5001');
    }
  }
};

testRegistration();