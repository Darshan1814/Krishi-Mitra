# KrishiMitra - Agricultural Support Platform

KrishiMitra is a comprehensive agricultural support platform designed to help farmers and vendors in India. It provides features like crop management, disease detection, weather-based farming advice, marketplace functionality, and more.

## 🚀 Features

- **User Authentication**: Secure login and registration for farmers and vendors
- **Multilingual Support**: Interface available in English and Hindi
- **Farmer Dashboard**: Manage crops, view market prices, track transactions
- **Vendor Dashboard**: Manage inventory, process orders, track sales
- **Plant Disease Detection**: AI-powered disease identification and treatment recommendations
- **Weather-based Farming Advice**: Get personalized farming recommendations based on weather conditions
- **Marketplace**: Connect farmers with vendors for buying/selling agricultural products
- **AI Chatbot**: Get farming advice and answers to agricultural questions
- **Expert Consultation**: Live chat and video calls with agricultural experts
- **Collaboration Platform**: Team-based bulk ordering system for cost savings
- **Soil Detection**: AI-powered soil analysis and crop recommendations

## 🛠️ Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **ML Services**: Python with Flask, TensorFlow, and Google Gemini AI
- **Real-time Communication**: Socket.IO and WebRTC
- **Translation**: LibreTranslate API

## 📁 Project Structure

```
KrishiMitra/
├── frontend/                 # React.js frontend application
├── backend/
│   ├── main/                # Main backend server (Port 5001)
│   ├── auth/                # Authentication server (Port 5000)
│   ├── api/                 # API backend services
│   ├── ml-features/         # ML and AI services (Port 5002)
│   ├── collaboration/       # Collaboration features (Port 5003)
│   ├── orders/              # Order management (Port 5007)
│   └── soil/                # Soil detection services (Port 5004)
├── scripts/                 # Utility and startup scripts
└── docs/                    # Documentation files
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Darshan1814/Krishi-Mitra.git
   cd Krishi-Mitra
   ```

2. **Install dependencies:**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Main Backend
   cd ../backend/main
   npm install
   
   # Auth Backend
   cd ../auth
   npm install
   
   # ML Features
   cd ../ml-features
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in respective directories
   - Update the environment variables with your configurations

4. **Start all services:**
   ```bash
   # From root directory
   chmod +x scripts/start_all_services.sh
   ./scripts/start_all_services.sh
   ```

## 🌐 Service URLs

- **Frontend**: http://localhost:3000
- **Auth Backend**: http://localhost:5000
- **Main Backend**: http://localhost:5001
- **ML API**: http://localhost:5002
- **Collaboration API**: http://localhost:5003
- **Soil Detection API**: http://localhost:5004
- **Fertilizer Store API**: http://localhost:5005
- **Chat Server**: http://localhost:5006
- **Orders Backend**: http://localhost:5007
- **Video Call Server**: http://localhost:5008

## 👥 User Roles

### Farmer
- Manage crops and farming activities
- Access disease detection and soil analysis
- Get weather-based farming advice
- Sell products in marketplace
- Consult with agricultural experts
- Track transactions and orders

### Vendor
- Manage inventory and products
- Process orders from farmers
- Track sales and analytics
- Buy products from farmers

### Expert
- Provide consultation via chat/video
- Answer farming queries
- Review and accept consultation requests

## 🔧 Development

### Running Individual Services

```bash
# Frontend
cd frontend && npm start

# Main Backend
cd backend/main && npm start

# Auth Backend
cd backend/auth && npm start

# ML Services
cd backend/ml-features && python app.py

# Other services...
```

### Testing

```bash
# Test authentication
node scripts/test-auth-flow.js

# Test market prices
node scripts/test-market-prices.js

# Test services
node scripts/test-services.js
```

## 📱 Mobile Features

- WhatsApp market price alerts
- SMS notifications
- Mobile-responsive design

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- OpenWeatherMap API for weather data
- LibreTranslate for translation services
- Google Gemini AI for intelligent farming recommendations
- MongoDB for database services
- Socket.IO for real-time communication

## 📞 Support

For support, email support@krishimitra.com or join our Slack channel.

---

**Made with ❤️ for Indian Farmers**