#!/bin/bash

echo "Starting Fertilizer Store API..."

# Navigate to backend directory
cd backend

# Install Python dependencies if not already installed
if [ ! -d "venv_fertilizer" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv_fertilizer
fi

# Activate virtual environment
source venv_fertilizer/bin/activate

# Install requirements
pip install -r requirements_fertilizer.txt

# Start the Flask API
echo "Starting Flask API on port 5000..."
python fertilizer_api.py