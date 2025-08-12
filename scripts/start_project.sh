#!/bin/bash

echo "🚀 Starting KrishiBandhu Full Stack Application..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:5001 | xargs kill -9 2>/dev/null || true
lsof -ti:5002 | xargs kill -9 2>/dev/null || true
lsof -ti:5003 | xargs kill -9 2>/dev/null || true

# Start MongoDB
echo "🗄️ Starting MongoDB..."
brew services start mongodb-community 2>/dev/null || mongod --fork --logpath /var/log/mongodb.log --dbpath /usr/local/var/mongodb 2>/dev/null || echo "MongoDB may already be running"

# Install and start Auth Backend
echo "🔐 Installing Auth Backend dependencies..."
cd auth-backend
npm install
echo "🔐 Starting Auth Backend on port 5001..."
npm start &
AUTH_PID=$!

# Install and start API Backend
echo "🌐 Installing API Backend dependencies..."
cd ../api-backend
npm install
echo "🌐 Starting API Backend on port 5003..."
npm start &
API_PID=$!

# Install and start ML service
echo "🤖 Installing ML dependencies..."
cd ../ml-features
pip3 install -r requirements.txt 2>/dev/null || echo "ML dependencies may already be installed"
echo "🤖 Starting ML server on port 5002..."
python3 app.py &
ML_PID=$!

# Wait for backend services
sleep 5

# Install and start frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install
echo "🌐 Starting frontend server on port 3000..."
npm start &
FRONTEND_PID=$!

echo "✅ All services started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔐 Auth Backend: http://localhost:5001"
echo "🤖 ML API: http://localhost:5002"
echo "🌐 API Backend: http://localhost:5003"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo "🛑 Stopping all services..."
    kill $AUTH_PID 2>/dev/null || true
    kill $API_PID 2>/dev/null || true
    kill $ML_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    lsof -ti:5001 | xargs kill -9 2>/dev/null || true
    lsof -ti:5002 | xargs kill -9 2>/dev/null || true
    lsof -ti:5003 | xargs kill -9 2>/dev/null || true
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for processes
wait