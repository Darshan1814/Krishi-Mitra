# 🚀 KrishiMitra Deployment Guide

## 📋 Pre-deployment Checklist

### 1. Environment Setup
- [ ] Copy `.env.example` to `.env` in `backend/main/` and `frontend/`
- [ ] Update all API keys and secrets in `.env` files
- [ ] Ensure MongoDB is running locally or update connection string

### 2. Dependencies Installation
```bash
# Install root dependencies
npm install

# Install all project dependencies
npm run install:all
```

### 3. Test Local Setup
```bash
# Start all services
npm start

# Or use the script directly
./scripts/start_all_services.sh
```

## 🔄 GitHub Push Instructions

### Step 1: Initialize Git Repository
```bash
cd /Users/darshanpatil/Documents/Mern\ Stack/KrishiMitra-Organized
git init
```

### Step 2: Add Remote Repository
```bash
git remote add origin https://github.com/Darshan1814/Krishi-Mitra.git
```

### Step 3: Stage All Files
```bash
git add .
```

### Step 4: Commit Changes
```bash
git commit -m "🎉 Initial commit: Organized KrishiMitra project structure

✨ Features:
- Reorganized project structure with separate frontend/backend
- Added comprehensive documentation
- Updated scripts for new structure
- Added environment examples
- Cleaned up unnecessary files

🏗️ Structure:
- frontend/ - React.js application
- backend/ - All backend services (main, auth, ml, etc.)
- scripts/ - Utility and startup scripts
- docs/ - Documentation files"
```

### Step 5: Push to GitHub
```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## 🔧 Alternative Push Method (if repository exists)

If the repository already has content:

```bash
# Fetch existing content
git fetch origin

# Merge with existing content (if any)
git merge origin/main --allow-unrelated-histories

# Push changes
git push origin main
```

## 📁 Project Structure Overview

```
KrishiMitra/
├── 🎨 frontend/              # React.js frontend
├── ⚙️ backend/
│   ├── main/                 # Main backend (Port 5001)
│   ├── auth/                 # Auth service (Port 5000)
│   ├── ml-features/          # ML services (Port 5002)
│   ├── collaboration/        # Collaboration (Port 5003)
│   ├── soil/                 # Soil detection (Port 5004)
│   └── orders/               # Order management (Port 5007)
├── 📜 scripts/               # Utility scripts
├── 📚 docs/                  # Documentation
├── 🚀 package.json           # Root package configuration
├── 🔒 .gitignore            # Git ignore rules
└── 📖 README.md             # Main documentation
```

## 🌐 Service Ports

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 3000 | React.js application |
| Auth Backend | 5000 | Authentication service |
| Main Backend | 5001 | Core API services |
| ML Features | 5002 | AI/ML services |
| Collaboration | 5003 | Team collaboration |
| Soil Detection | 5004 | Soil analysis |
| Fertilizer API | 5005 | Fertilizer data |
| Chat Server | 5006 | Real-time chat |
| Orders Backend | 5007 | Order management |
| Video Server | 5008 | Video calls |

## 🔐 Security Notes

- ✅ All sensitive data is in `.env` files (ignored by git)
- ✅ API keys and secrets are in example files only
- ✅ Database credentials are environment-based
- ✅ File uploads are properly configured

## 🚨 Important Notes

1. **Environment Variables**: Make sure to set up `.env` files before running
2. **MongoDB**: Ensure MongoDB is running before starting services
3. **Python Dependencies**: ML features require Python 3.8+
4. **Node Version**: Use Node.js 14+ for best compatibility
5. **Port Conflicts**: Ensure all ports (3000, 5000-5008) are available

## 🆘 Troubleshooting

### Common Issues:

1. **Port Already in Use**:
   ```bash
   # Kill processes on specific ports
   lsof -ti:3000 | xargs kill -9
   lsof -ti:5001 | xargs kill -9
   ```

2. **MongoDB Connection Issues**:
   ```bash
   # Start MongoDB
   brew services start mongodb-community
   # Or manually
   mongod --dbpath ~/mongodb-data
   ```

3. **Python Dependencies**:
   ```bash
   # Install Python requirements
   cd backend/ml-features
   pip install -r requirements.txt
   ```

4. **Node Dependencies**:
   ```bash
   # Clear cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

If you encounter any issues:
1. Check the logs in respective service directories
2. Ensure all environment variables are set
3. Verify all dependencies are installed
4. Check port availability

---

**Happy Coding! 🌾👨‍💻**