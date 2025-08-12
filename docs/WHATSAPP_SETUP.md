# WhatsApp Market Price Alerts Setup

## Quick Start

### 1. Send Market Prices via WhatsApp
```bash
# Send to default number
./send-prices.sh

# Send to specific number
./send-prices.sh "+919876543210"

# Or use node directly
node send-market-prices.js "+919876543210"
```

### 2. Test Market Prices API
```bash
node test-market-prices.js
```

## Configuration

### Environment Variables
Update `.env` file with your Twilio credentials:
```
TWILIO_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+14155238886
```

## API Endpoints

### Backend Routes
- `POST /api/market-alert/send-whatsapp` - Send market prices via WhatsApp
- `POST /api/sms/send-market-prices` - Send market prices via SMS
- `GET /api/sms/market-prices` - Get current market prices

### Example API Call
```javascript
fetch('http://localhost:5001/api/market-alert/send-whatsapp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ phoneNumber: '+919876543210' })
})
```

## Message Format

The WhatsApp message includes:
- 🌾 KrishiMitra branding
- 📊 Top 5 current market prices
- 💰 Price per kg
- 📍 Market location and state
- 🔗 Link to full price list
- 📱 App promotion

## Sample Message Output
```
🌾 KrishiMitra Market Alert

📊 *Current Market Prices:*

1. *Tomato*
   💰 Price: ₹3900/kg
   📍 Market: Kalikiri, Andhra Pradesh

2. *Banana*
   💰 Price: ₹8500/kg
   📍 Market: Tirupati, Andhra Pradesh

🔗 More prices: http://localhost:3000/market-prices
📱 KrishiMitra - Your Smart Farming Assistant
```

## Files Created
- `send-market-prices.js` - Main WhatsApp sender script
- `send-prices.sh` - Shell script wrapper
- `test-market-prices.js` - API testing script
- `backend/routes/marketAlert.js` - Backend API route
- `backend/routes/sms.js` - SMS functionality

## Usage Examples

### Command Line
```bash
# Send to farmer
./send-prices.sh "+919405442242"

# Test the API first
node test-market-prices.js
```

### From Backend API
```bash
curl -X POST http://localhost:5001/api/market-alert/send-whatsapp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

## Troubleshooting

1. **Module not found**: Run `npm install twilio axios`
2. **API timeout**: Check internet connection
3. **Twilio errors**: Verify credentials in `.env`
4. **No market data**: API might be temporarily unavailable

## Automation

You can set up cron jobs to send daily market updates:
```bash
# Add to crontab for daily 8 AM alerts
0 8 * * * cd /path/to/krishiBandhu && ./send-prices.sh "+919876543210"
```