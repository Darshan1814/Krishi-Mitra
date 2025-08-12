# KrishiMitra - Agricultural Support Platform

KrishiMitra is a comprehensive agricultural support platform designed to help farmers and vendors in India. It provides features like crop management, disease detection, weather-based farming advice, marketplace functionality, and more.

## Features

- **User Authentication**: Secure login and registration for farmers and vendors
- **Multilingual Support**: Interface available in English and Hindi
- **Farmer Dashboard**: Manage crops, view market prices, track transactions
- **Vendor Dashboard**: Manage inventory, process orders, track sales
- **Plant Disease Detection**: AI-powered disease identification and treatment recommendations
- **Weather-based Farming Advice**: Get personalized farming recommendations based on weather conditions
- **Marketplace**: Connect farmers with vendors for buying/selling agricultural products
- **AI Chatbot**: Get farming advice and answers to agricultural questions
- **Collaboration Platform**: Team-based bulk ordering system for cost savings
- **Soil Detection**: AI-powered soil analysis and crop recommendations

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **ML Services**: Python with Flask, TensorFlow, and Google Gemini AI
- **Translation**: LibreTranslate API

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Git

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/krishiBandhu.git
   cd krishiBandhu
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

4. Install ML dependencies:
   ```
   cd ../ml-features
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   - Create `.env` files in both backend and frontend directories based on the provided examples

## Running the Application

You can start all services at once using the provided script:

```
./start_all_services.sh
```

Or start each service individually:

1. Start MongoDB:
   ```
   mongod --dbpath ~/mongodb-data
   ```

2. Start backend server:
   ```
   cd backend
   npm start
   ```

3. Start frontend server:
   ```
   cd frontend
   npm start
   ```

4. Start ML server:
   ```
   cd ml-features
   python app.py
   ```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- ML API: http://localhost:5002/api
- Collaboration API: http://localhost:5003/api
- Soil Detection API: http://localhost:5004/api

## User Roles

1. **Farmer**:
   - Manage crops
   - Access disease detection
   - Get weather-based farming advice
   - Sell products in marketplace
   - Track transactions

2. **Vendor**:
   - Manage inventory
   - Process orders
   - Track sales
   - Buy products from farmers

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenWeatherMap API for weather data
- LibreTranslate for translation services
- Google Gemini AI for intelligent farming recommendations and plant disease detection