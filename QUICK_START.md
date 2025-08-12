# ⚡ Quick Start Guide

## 🚀 Push to GitHub (Copy & Paste)

```bash
# Navigate to project
cd "/Users/darshanpatil/Documents/Mern Stack/KrishiMitra-Organized"

# Initialize git
git init

# Add remote
git remote add origin https://github.com/Darshan1814/Krishi-Mitra.git

# Stage all files
git add .

# Commit with descriptive message
git commit -m "🎉 Initial commit: Complete KrishiMitra Agricultural Platform

✨ Features:
- 🌾 Agricultural support platform for Indian farmers
- 🤖 AI-powered disease detection & soil analysis
- 💬 Real-time expert consultation (chat/video)
- 🛒 Integrated marketplace
- 📱 Mobile-responsive with multilingual support

🏗️ Tech Stack:
- Frontend: React.js + Tailwind CSS
- Backend: Node.js microservices
- Database: MongoDB
- Real-time: Socket.IO + WebRTC
- AI/ML: Python + TensorFlow + Gemini AI

📁 Structure:
- frontend/ - React app (Port 3000)
- backend/ - Microservices (Ports 5000-5008)
- scripts/ - Utility scripts
- docs/ - Documentation"

# Push to GitHub
git branch -M main
git push -u origin main
```

## ✅ Verification

After pushing, check:
1. Visit: https://github.com/Darshan1814/Krishi-Mitra
2. Verify folder structure is clean and organized
3. Check README.md displays properly
4. Ensure no sensitive files (.env, logs) are visible

## 🔧 For New Developers

```bash
# Clone and setup
git clone https://github.com/Darshan1814/Krishi-Mitra.git
cd Krishi-Mitra
npm install
npm run install:all

# Setup environment
cp backend/main/.env.example backend/main/.env
cp frontend/.env.example frontend/.env

# Start all services
npm start
```

**🎉 Done! Your project is now perfectly organized on GitHub!**