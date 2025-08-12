import os
import requests
from twilio.rest import Client

# Load safely from environment variables
account_sid = os.environ.get('TWILIO_SID')
auth_token = os.environ.get('TWILIO_AUTH_TOKEN')
client = Client(account_sid, auth_token)

def get_market_prices():
    """Fetch current market prices from government API"""
    try:
        url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5'
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.ok and data.get('records'):
            return data['records'][:3]  # Get top 3 prices
        return []
    except:
        return []

def send_market_price_notification(phone_number):
    """Send WhatsApp notification with current market prices"""
    prices = get_market_prices()
    
    if not prices:
        message_body = "🌾 KrishiMitra Market Update\n\nUnable to fetch current prices. Please check our website for latest updates.\n\n🔗 Visit: http://localhost:3000/market-prices"
    else:
        message_body = "🌾 KrishiMitra Market Update\n\n📊 Current Market Prices:\n\n"
        
        for price in prices:
            commodity = price.get('commodity', 'N/A')
            market = price.get('market', 'N/A')
            modal_price = price.get('modal_price', 'N/A')
            
            message_body += f"• {commodity}: ₹{modal_price}/kg\n  Market: {market}\n\n"
        
        message_body += "🔗 Check more prices: http://localhost:3000/market-prices"
    
    try:
        message = client.messages.create(
            from_='whatsapp:+14155238886',
            body=message_body,
            to=f'whatsapp:{phone_number}'
        )
        
        print(f"Market price notification sent to {phone_number}. SID: {message.sid}")
        return True
    except Exception as e:
        print(f"Failed to send notification: {e}")
        return False

if __name__ == "__main__":
    # Send notification to farmer
    farmer_phone = "+919405442242"
    send_market_price_notification(farmer_phone)