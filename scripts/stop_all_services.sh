#!/bin/bash

# Stop all KrishiBandhu services
echo "Stopping KrishiBandhu services..."

# Stop Node.js processes (backend and frontend)
echo "Stopping Node.js processes..."
pkill -f "node.*krishiBandhu"

# Stop Python processes (ML server)
echo "Stopping Python processes..."
pkill -f "python.*app.py"

# Stop chat and video servers
echo "Stopping chat and video servers..."
pkill -f "chat_server.js"
pkill -f "video_server.js"

# Don't stop MongoDB as it might be used by other applications
echo "Note: MongoDB is still running. Stop it manually if needed."

echo "All KrishiMitra services stopped"
echo "Ports freed: 3000, 5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008"