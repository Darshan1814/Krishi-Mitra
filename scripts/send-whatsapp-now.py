#!/usr/bin/env python3
import requests
from twilio.rest import Client

# Twilio credentials
TWILIO_SID = "AC37947924c4f59732a614729521eaa699"
TWILIO_AUTH_TOKEN = "9f54f7b2dd934f5e07aa5ad10e373fcc"
TWILIO_WHATSAPP_NUMBER = "whatsapp:+14155238886"   # Twilio WhatsApp number

def get_market_prices():
    try:
        url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5'
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.ok and data.get('records'):
            return data['records'][:5]
        return []
    except Exception as e:
        print(f"Error fetching prices: {e}")
        return []

def send_market_prices_whatsapp(phone_number):
    prices = get_market_prices()
    
    if not prices:
        message = "🌾 KrishiMitra Market Update\n\nUnable to fetch current prices. Please check our website.\n\n🔗 Visit: http://localhost:3000/market-prices"
    else:
        message = "🌾 KrishiMitra Market Alert\n\n📊 *Current Market Prices:*\n\n"
        
        for i, price in enumerate(prices, 1):
            commodity = price.get('commodity', 'N/A')
            market = price.get('market', 'N/A')
            modal_price = price.get('modal_price', 'N/A')
            state = price.get('state', 'N/A')
            
            message += f"{i}. *{commodity}*\n   💰 Price: ₹{modal_price}/kg\n   📍 Market: {market}, {state}\n\n"
        
        message += "🔗 More prices: http://localhost:3000/market-prices\n📱 KrishiMitra - Your Smart Farming Assistant"
    
    try:
        client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
        
        sent_message = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body=message,
            to=f'whatsapp:{phone_number}'
        )
        
        print(f"✅ Message sent successfully!")
        print(f"📱 Message SID: {sent_message.sid}")
        print(f"📞 Sent to: {phone_number}")
        return True
        
    except Exception as e:
        print(f"❌ Error sending message: {e}")
        return False

if __name__ == "__main__":
    print("🚀 KrishiMitra WhatsApp Market Alert")
    print("="*50)
    
    # Check if credentials are set
    if TWILIO_SID.startswith("ACxxxxxxxx") or TWILIO_AUTH_TOKEN == "your_auth_token_here":
        print("❌ Please update your Twilio credentials in this script:")
        print("   - TWILIO_SID: Your Account SID")
        print("   - TWILIO_AUTH_TOKEN: Your Auth Token")
        print("\n📝 Edit this file and replace the placeholder values")
        exit(1)
    
    # Default phone number
    phone_number = "+919405442242"
    
    print(f"📞 Sending market prices to: {phone_number}")
    success = send_market_prices_whatsapp(phone_number)
    
    if success:
        print("\n🎉 Market price alert sent successfully!")
    else:
        print("\n💥 Failed to send market price alert")