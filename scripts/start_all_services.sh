#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Start all KrishiMitra services
echo "Starting KrishiMitra services from: $PROJECT_ROOT"
echo "Current directory: $(pwd)"

# Start MongoDB (if not already running)
echo "Checking MongoDB status..."
if pgrep mongod > /dev/null
then
    echo "MongoDB is already running"
else
    echo "Starting MongoDB with brew..."
    brew services start mongodb-community 2>/dev/null || {
        echo "Brew service failed, starting manually..."
        mongod --dbpath ~/mongodb-data &
    }
    sleep 3
    echo "MongoDB started"
fi

# Start auth backend server (port 5000)
echo "Starting auth backend server..."
if [ -d "backend/auth" ]; then
    cd backend/auth
    PORT=5000 npm start &
    AUTH_BACKEND_PID=$!
    cd ../..
else
    echo "Warning: backend/auth directory not found"
    AUTH_BACKEND_PID=0
fi

# Start main backend server (port 5001)
echo "Starting main backend server..."
if [ -d "backend/main" ]; then
    cd backend/main
    npm start &
    BACKEND_PID=$!
    cd ../..
else
    echo "Error: backend/main directory not found"
    exit 1
fi

# Start ML server (port 5002)
echo "Starting ML server..."
if [ -d "backend/ml-features" ]; then
    cd backend/ml-features
    python3 app.py &
    ML_PID=$!
    cd ../..
else
    echo "Warning: backend/ml-features directory not found"
    ML_PID=0
fi

# Start Collaboration Backend (port 5003)
echo "Starting Collaboration Backend..."
if [ -f "backend/collaboration/collaboration-backend.js" ]; then
    cd backend/collaboration
    node collaboration-backend.js &
    COLLABORATION_PID=$!
    cd ../..
else
    echo "Warning: collaboration backend not found"
    COLLABORATION_PID=0
fi

# Start Soil Detection Backend (port 5004)
echo "Starting Soil Detection Backend..."
if [ -f "backend/soil/soil-backend.js" ]; then
    cd backend/soil
    node soil-backend.js &
    SOIL_PID=$!
    cd ../..
else
    echo "Warning: soil backend not found"
    SOIL_PID=0
fi

# Start Chat Server (port 5006)
echo "Starting Chat Server..."
if [ -f "backend/main/chat_server.js" ]; then
    cd backend/main
    node chat_server.js &
    CHAT_PID=$!
    cd ../..
else
    echo "Warning: chat_server.js not found"
    CHAT_PID=0
fi

# Start Video Server (port 5008)
echo "Starting Video Server..."
if [ -f "backend/main/video_server.js" ]; then
    cd backend/main
    node video_server.js &
    VIDEO_PID=$!
    cd ../..
else
    echo "Warning: video_server.js not found"
    VIDEO_PID=0
fi

# Start Orders Backend (port 5007)
echo "Starting Orders Backend..."
if [ -d "backend/orders" ]; then
    cd backend/orders
    python3 app.py &
    ORDERS_PID=$!
    cd ../..
else
    echo "Warning: orders backend not found"
    ORDERS_PID=0
fi

# Start frontend server (port 3000)
echo "Starting frontend server..."
if [ -d "frontend" ]; then
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
else
    echo "Error: frontend directory not found"
    exit 1
fi

echo ""
echo "All services started successfully!"
echo "Auth Backend PID: $AUTH_BACKEND_PID (Port: 5000)"
echo "Main Backend PID: $BACKEND_PID (Port: 5001)"
echo "ML Server PID: $ML_PID (Port: 5002)"
echo "Collaboration Backend PID: $COLLABORATION_PID (Port: 5003)"
echo "Soil Detection Backend PID: $SOIL_PID (Port: 5004)"
echo "Chat Server PID: $CHAT_PID (Port: 5006)"
echo "Orders Backend PID: $ORDERS_PID (Port: 5007)"
echo "Video Server PID: $VIDEO_PID (Port: 5008)"
echo "Frontend PID: $FRONTEND_PID (Port: 3000)"
echo ""
echo "=== SERVICE URLs ==="
echo "- Frontend: http://localhost:3000"
echo "- Auth Backend: http://localhost:5000"
echo "- Main Backend: http://localhost:5001"
echo "- ML API: http://localhost:5002"
echo "- Collaboration API: http://localhost:5003"
echo "- Soil Detection API: http://localhost:5004"
echo "- Chat Server: http://localhost:5006"
echo "- Orders Backend: http://localhost:5007"
echo "- Video Server: http://localhost:5008"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
trap "echo 'Stopping all services...'; kill $AUTH_BACKEND_PID $BACKEND_PID $ML_PID $COLLABORATION_PID $SOIL_PID $CHAT_PID $VIDEO_PID $ORDERS_PID $FRONTEND_PID 2>/dev/null; echo 'All services stopped'; exit" INT
wait