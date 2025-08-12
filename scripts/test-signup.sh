#!/bin/bash

echo "Testing KrishiBandhu Signup..."

# Test server health
echo "1. Checking server health..."
curl -s http://localhost:5001/health | grep -q "Server is running" && echo "✅ Server is running" || echo "❌ Server not running"

# Test registration with POST
echo -e "\n2. Testing registration..."
response=$(curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"farmer"}')

echo "Response: $response"

if echo "$response" | grep -q '"success":true'; then
    echo "✅ Registration successful!"
else
    echo "❌ Registration failed"
fi

echo -e "\n3. Testing with missing fields..."
curl -s -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}' | grep -o '"message":"[^"]*"'