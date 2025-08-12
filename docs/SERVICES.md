# KrishiMitra Services

## Service Architecture

### Auth Backend (Port 5001)
- **Purpose**: User authentication and product management
- **URL**: http://localhost:5001
- **Routes**: 
  - `/api/auth` - Authentication endpoints
  - `/api/products` - Product management

### Main Backend (Port 5002)
- **Purpose**: Core application features
- **URL**: http://localhost:5002
- **Routes**:
  - `/api/market-prices` - Market price data from CSV
  - `/api/weather` - Weather information
  - `/api/chat` - Chat functionality
  - `/api/ml` - Machine learning features

### Frontend (Port 3000)
- **Purpose**: React.js user interface
- **URL**: http://localhost:3000

### ML Features (Port 5002)
- **Purpose**: Machine learning services
- **URL**: http://localhost:5002/api

## Starting All Services

Run the following command to start all services:

```bash
./start_all_services.sh
```

This will start:
- MongoDB database
- Auth Backend (port 5001)
- Main Backend (port 5002) 
- Frontend (port 3000)
- ML Server (port 5002)

## Market Price Data

Market prices are now served from a local CSV file located at:
- `backend/data/Market Price.csv`

The data includes:
- State, District, Market information
- Commodity, Variety, Grade details
- Min, Max, and Modal prices
- Arrival dates

Access via: `GET http://localhost:5002/api/market-prices`