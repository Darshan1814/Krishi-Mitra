#!/usr/bin/env python3
import requests
import json

def get_market_prices():
    """Fetch current market prices from government API"""
    try:
        url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001987c65666f9c49656f0f9ef4fa3650e7&format=json&offset=0&limit=5'
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if response.ok and data.get('records'):
            return data['records'][:5]  # Get top 5 prices
        return []
    except Exception as e:
        print(f"Error fetching prices: {e}")
        return []

def format_market_message():
    """Format market prices for WhatsApp"""
    prices = get_market_prices()
    
    if not prices:
        return "🌾 KrishiMitra Market Update\n\nUnable to fetch current prices. Please check our website for latest updates.\n\n🔗 Visit: http://localhost:3000/market-prices"
    
    message = "🌾 KrishiMitra Market Alert\n\n📊 *Current Market Prices:*\n\n"
    
    for i, price in enumerate(prices, 1):
        commodity = price.get('commodity', 'N/A')
        market = price.get('market', 'N/A')
        modal_price = price.get('modal_price', 'N/A')
        state = price.get('state', 'N/A')
        
        message += f"{i}. *{commodity}*\n   💰 Price: ₹{modal_price}/kg\n   📍 Market: {market}, {state}\n\n"
    
    message += "🔗 More prices: http://localhost:3000/market-prices\n📱 KrishiMitra - Your Smart Farming Assistant"
    return message

if __name__ == "__main__":
    print("📱 Generating market price message...")
    message = format_market_message()
    print("\n" + "="*50)
    print(message)
    print("="*50)
    print("\n✅ Message ready for WhatsApp!")
    print("📞 Default number: +919405442242")