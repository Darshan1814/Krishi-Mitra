# New Features Added to KrishiMitra

## 1. Collaboration Platform

### Overview
A farmer collaboration platform that allows farmers to form teams and make bulk orders to save money on agricultural supplies.

### Features
- **Team Creation**: Farmers can create teams based on their location (city/state)
- **Team Joining**: Other farmers can join existing teams
- **Bulk Ordering**: Teams can place bulk orders for agricultural products
- **Cost Savings**: Bulk pricing offers significant savings compared to individual purchases
- **Product Categories**: Pesticides, Fertilizers, Seeds, Equipment, Tools, Testing, Technology

### Backend API Endpoints
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `POST /api/teams/:teamId/join` - Join a team
- `GET /api/products` - Get all products
- `POST /api/teams/:teamId/order` - Place bulk order
- `GET /api/categories` - Get product categories
- `GET /api/teams/:teamId/orders` - Get team orders

### Access
- **Frontend Route**: `/collaboration`
- **Backend Server**: Port 5003
- **Navigation**: Available in sidebar and top navigation

## 2. Soil Detection & Crop Recommendation

### Overview
AI-powered soil analysis system that provides crop recommendations based on soil parameters using Google Gemini AI.

### Features
- **Soil Parameter Input**: pH, Moisture, EC, Temperature, NPK values
- **Input Validation**: Ensures all parameters are within valid ranges
- **AI Analysis**: Uses Google Gemini AI for intelligent crop recommendations
- **Real-time Results**: Instant recommendations based on soil conditions
- **User-friendly Interface**: Clean form with helpful input hints

### Soil Parameters
1. **pH Level** (0-14): Soil acidity/alkalinity
2. **Moisture Content** (0-100%): Soil water content
3. **Electrical Conductivity** (dS/m): Soil salinity
4. **Temperature** (°C): Soil temperature
5. **Nitrogen (N)** (ppm): Nitrogen content
6. **Phosphorus (P)** (ppm): Phosphorus content
7. **Potassium (K)** (ppm): Potassium content

### Backend API Endpoints
- `POST /api/soil-recommendation` - Get crop recommendations
- `GET /api/health` - Health check

### Access
- **Frontend Route**: `/soil-detection`
- **Backend Server**: Port 5004
- **Navigation**: Available in sidebar and top navigation

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- Python (v3.8+)
- MongoDB
- Internet connection (for Gemini AI API)

### Starting the Services

#### Option 1: Start All Services
```bash
./start_all_services.sh
```

#### Option 2: Start Individual Services
```bash
# Collaboration Backend
./start-collaboration.sh
# or
node collaboration-backend.js

# Soil Detection Backend
./start-soil.sh
# or
node soil-backend.js
```

#### Option 3: Using npm scripts
```bash
npm run start-collaboration
npm run start-soil
npm run dev  # Starts both services concurrently
```

### Service URLs
- **Collaboration API**: http://localhost:5003/api
- **Soil Detection API**: http://localhost:5004/api
- **Frontend**: http://localhost:3000

## Navigation Integration

Both features are integrated into the main navigation:

### Sidebar Navigation
- **Collaboration**: Users icon with "Collaboration" label
- **Soil Detection**: Beaker icon with "Soil Detection" label

### Top Quick Access Bar
- **Collaborate**: Users icon
- **Soil**: Beaker icon

## Technical Implementation

### Frontend Components
- `CollaborationPage.jsx`: Team management and bulk ordering interface
- `SoilDetectionPage.jsx`: Soil parameter input and recommendation display

### Backend Services
- `collaboration-backend.js`: Standalone collaboration API server
- `soil-backend.js`: Standalone soil detection API server
- `backend/routes/collaboration.js`: Integrated collaboration routes
- `backend/routes/soil.js`: Integrated soil detection routes

### Data Storage
- **Collaboration**: File-based JSON storage (`collaboration-data.json`)
- **Soil Detection**: Stateless API using Gemini AI

### AI Integration
- **Google Gemini AI**: Used for intelligent crop recommendations
- **API Key**: Configured in soil detection backend
- **Retry Logic**: Exponential backoff for API reliability

## Usage Examples

### Collaboration Platform
1. Enter your farmer name
2. Create a new team or join existing team
3. Browse products by category
4. Place bulk orders to save money
5. Track team orders and members

### Soil Detection
1. Enter all soil parameters from your IoT devices or soil tests
2. Click "Get Recommendation" 
3. Receive AI-powered crop suggestions
4. Use recommendations for planting decisions

## Benefits

### Collaboration Platform
- **Cost Savings**: Bulk pricing reduces individual costs
- **Community Building**: Connects farmers in same region
- **Efficient Procurement**: Streamlined ordering process
- **Transparency**: Track all team orders and members

### Soil Detection
- **Data-Driven Decisions**: Scientific approach to crop selection
- **AI-Powered Insights**: Leverages advanced AI for recommendations
- **Easy to Use**: Simple form-based interface
- **Instant Results**: Real-time crop suggestions

## Future Enhancements

### Collaboration Platform
- Payment integration
- Delivery tracking
- Vendor management
- Rating and review system

### Soil Detection
- Historical data tracking
- Seasonal recommendations
- Integration with weather data
- Mobile app for field testing